from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pathlib import Path
from PIL import Image
import io
import torch
from torchvision import transforms as T
import os
from dotenv import load_dotenv
import numpy as np

from app.schemas.response import PartStatusResponse, AnalyzeResponse, BBox
from app.utils.inference import (
    load_model, get_img_masks, get_dict_value_to_id, retrieve_meta_data
)

# === Load environment ===
load_dotenv()

# === Config ===
DEVICE = torch.device(os.getenv("DEVICE", "cuda" if torch.cuda.is_available() else "cpu"))
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "http://localhost:5173").split(",")
PART_MODEL_PATH = os.getenv("PART_MODEL_PATH", "app/models_weights/checkpoint_parts.pth")
DAMAGE_MODEL_PATH = os.getenv("DAMAGE_MODEL_PATH", "app/models_weights/checkpoint_damages.pth")

PART_CLASSES = 22
DAMAGE_CLASSES = 9

# === Init FastAPI app ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load models ===
car_part_model = load_model(PART_MODEL_PATH, PART_CLASSES, device="cpu")
car_damage_model = load_model(DAMAGE_MODEL_PATH, DAMAGE_CLASSES, device="cpu")

# === Load metadata ===
damage_class_names, damage_class_ids = retrieve_meta_data("app/static/car_damage_meta.json")
part_class_names, part_class_ids = retrieve_meta_data("app/static/car_parts_meta.json")

damage_dict = get_dict_value_to_id(damage_class_names, damage_class_ids)
part_dict = get_dict_value_to_id(part_class_names, part_class_ids)

print(f"[DEBUG] Final part_dict: {part_dict}")

# === Preprocessing ===
preprocess = T.Compose([
    T.Resize((320, 320)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


@app.get("/api/meta")
def get_meta():
    return {
        "damage_dict": damage_dict,
        "car_part_dict": part_dict
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(files: List[UploadFile] = File(...)):
    content = await files[0].read()
    img = Image.open(io.BytesIO(content)).convert("RGB")

    (part_probs, part_mask), (damage_probs, damage_mask) = get_img_masks(
        car_part_model, car_damage_model, img, preprocess
    )

    part_mask = torch.tensor(part_mask)
    damage_probs = damage_probs.squeeze(0)  # [C, H, W]
    results = []

    for damage_class in range(damage_probs.shape[0]):
        damage_bin = (damage_probs[damage_class] > 0.5).numpy().astype("uint8")
        if damage_bin.sum() == 0:
            continue

        import cv2
        contours, _ = cv2.findContours(damage_bin, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            if w < 5 or h < 5:
                continue

            damage_crop = damage_bin[y:y + h, x:x + w]
            part_crop = part_mask[y:y + h, x:x + w].numpy()

            unique_parts, counts = np.unique(part_crop[damage_crop == 1], return_counts=True)
            if len(unique_parts) == 0:
                continue

            best_part = int(unique_parts[np.argmax(counts)])
            if best_part == 0:
                continue

            part_mask_bin = (part_mask == best_part).numpy().astype(int)
            union = (damage_bin | part_mask_bin).sum()
            intersection = (damage_bin & part_mask_bin).sum()
            iou = intersection / union if union > 0 else 0
            status = "Бита" if iou > 0.1 else "Не бита"

            mapped_id = part_dict.get(best_part)
            print(f"[DEBUG] best_part: {best_part}, mapped id: {mapped_id}, iou: {iou:.2f}")

            results.append(PartStatusResponse(
                id=mapped_id or f"part_{best_part}",
                status=status,
                score=round(iou * 5, 2),
                damage_class=damage_dict.get(damage_class, f"damage_{damage_class}"),
                box=BBox(x=int(x), y=int(y), width=int(w), height=int(h))
            ))

    final_score = sum([r.score for r in results]) / len(results) if results else 0
    return AnalyzeResponse(data=results, finalScore=final_score)

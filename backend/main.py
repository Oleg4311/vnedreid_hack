from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from PIL import Image
import io
import torch
import torchvision.transforms as T
from pathlib import Path

from manet import MANet

import segmentation_models_pytorch.metrics.functional as smp_metrics
torch.serialization.add_safe_globals([smp_metrics.iou_score])

class PartStatusResponse(BaseModel):
    id: str
    status: str
    score: float

class AnalyzeResponse(BaseModel):
    data: List[PartStatusResponse]
    finalScore: float

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = MANet(num_parts=10).to(DEVICE)

ckpt_path = BASE_DIR / "model" / "checkpoint_MAnet_damages1.pth"
ckpt = torch.load(ckpt_path, map_location=DEVICE, weights_only=False)
state_dict = ckpt.get("model_state_dict", ckpt)
model.load_state_dict(state_dict, strict=False)
model.eval()

preprocess = T.Compose([
    T.Resize((256, 256)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]),
])

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(files: List[UploadFile] = File(...)):
    content = await files[0].read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    x = preprocess(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        out = model(x)

    logits = out[0, :, 0]
    scores = out[0, :, 1]

    part_ids = [
        'hood', 'front_bumper', 'rear_bumper',
        'left_headlight', 'right_headlight',
        'left_fender_front', 'right_fender_front',
        'left_fender_rear', 'right_fender_rear',
        'roof'
    ]

    resp = []
    for idx, pid in enumerate(part_ids):
        prob = torch.sigmoid(logits[idx]).item()
        status = "Бита" if prob > 0.5 else "Не бита"
        score = float(scores[idx].clamp(0, 5).item())
        resp.append({"id": pid, "status": status, "score": score})

    final = sum(item["score"] for item in resp) / len(resp)
    return {"data": resp, "finalScore": final}

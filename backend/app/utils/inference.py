import json
import torch
import numpy as np
import torch.nn.functional as F
from torchvision import transforms as T
from PIL import Image
from segmentation_models_pytorch import MAnet


def retrieve_meta_data(path_to_json: str):
    meta_info = json.load(open(path_to_json, "r"))
    car_parts_classes = [cls_["title"] for cls_ in meta_info['classes']]
    assosiated_color_ids = [cls_["id"] for cls_ in meta_info['classes']]
    return car_parts_classes, assosiated_color_ids


def load_model(path_to_model: str, num_classes: int, device: str = 'cpu') -> MAnet:
    checkpoint = torch.load(path_to_model, map_location=torch.device(device), weights_only=False)
    model = MAnet(classes=num_classes, encoder_weights="imagenet")
    model.load_state_dict(checkpoint.get('model_state_dict'))
    return model


def get_dict_value_to_id(class_titles: list, class_ids: list):
    remap = {
        "hood": "hood",
        "front-bumper": "front_bumper",
        "back-bumper": "rear_bumper",
        "windshield": "windshield",
        "back-windshield": "rear_window",
        "headlight": "left_headlight",
        "fender": "left_fender_front",
        "roof": "roof",
        "front-door": "left_door_front",
        "back-door": "left_door_rear",
        "mirror": "left_mirror",
        "grille": "front_bumper",
        "front-wheel": "left_fender_front",
        "back-wheel": "left_fender_rear",
        "tail-light": "right_headlight",
        "license-plate": "rear_bumper",
        "trunk": "rear_bumper",
        "quarter-panel": "right_fender_rear",
        "rocker-panel": "right_door_rear",
        "front-window": "windshield",
    }

    d = {}
    for idx, (title, cid) in enumerate(zip(class_titles, class_ids), start=1):
        norm = title.lower().strip().replace(" ", "-")
        frontend_id = remap.get(norm, f"part_{cid}")
        d[idx] = frontend_id
        print(f"[DEBUG] Class {idx}: '{title}' → '{frontend_id}'")
    d[0] = "none"
    print("[DEBUG] Final part_dict:", d)
    return d


def get_prob_and_mask(model, image, transform):
    img_tensor = transform(image)[:3, :, :]
    model.eval()
    with torch.no_grad():
        outputs = model(img_tensor.unsqueeze(0))
    probs = F.softmax(outputs, dim=1)
    mask = torch.argmax(probs, dim=1).squeeze().cpu().numpy()
    return probs, mask


def get_img_masks(part_model, damage_model, image, transform):
    part_probs, part_mask = get_prob_and_mask(part_model, image, transform)
    damage_probs, damage_mask = get_prob_and_mask(damage_model, image, transform)
    return (part_probs, part_mask), (damage_probs, damage_mask)

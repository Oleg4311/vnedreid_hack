import base64
import io
import cv2
import numpy as np
import torch
import plotly.graph_objects as go
from PIL import Image

def np_to_base64_img(np_img: np.ndarray):
    pil_img = Image.fromarray(np_img)
    buff = io.BytesIO()
    pil_img.save(buff, format="PNG")
    base64_img = base64.b64encode(buff.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{base64_img}"


def plot_damage_with_plotly_interactive(original_image, damage_probs, parts_mask,
                                        class_names_damage, class_names_parts, threshold=0.5):
    if isinstance(original_image, Image.Image):
        original_image = np.array(original_image.convert("RGB"))

    H_img, W_img = original_image.shape[:2]

    if damage_probs.shape[2:] != (H_img, W_img):
        import torch.nn.functional as F
        damage_probs = F.interpolate(damage_probs, size=(H_img, W_img), mode='bilinear', align_corners=False)

    damage_probs = damage_probs.squeeze(0).cpu().numpy()
    parts_mask = parts_mask.cpu().numpy() if torch.is_tensor(parts_mask) else parts_mask

    fig = go.Figure()
    fig.add_layout_image(
        dict(
            source=np_to_base64_img(original_image),
            x=0, y=0, xref="x", yref="y",
            sizex=W_img, sizey=H_img,
            sizing="stretch", layer="below"
        )
    )

    for damage_class in range(damage_probs.shape[0]):
        mask = (damage_probs[damage_class] > threshold).astype(np.uint8)
        if mask.sum() == 0:
            continue
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            if w < 5 or h < 5:
                continue
            damage_crop = mask[y:y+h, x:x+w]
            part_crop = parts_mask[y:y+h, x:x+w]
            unique_parts, counts = np.unique(part_crop[damage_crop == 1], return_counts=True)
            if len(unique_parts) == 0:
                continue
            best_part = unique_parts[np.argmax(counts)]
            if best_part == 0:
                continue
            label = f"{class_names_damage[damage_class]} on {class_names_parts[best_part]}"
            fig.add_shape(type="rect", x0=x, y0=y, x1=x+w, y1=y+h, line=dict(color="lime", width=2))
            fig.add_trace(go.Scatter(
                x=[x + w / 2], y=[y],
                mode="markers", hovertext=label, hoverinfo="text",
                marker=dict(size=10, color='rgba(0,0,0,0)'),
                hoverlabel=dict(bgcolor="black", font_size=14, font_family="Arial", bordercolor="lime"),
                showlegend=False
            ))

    fig.update_layout(
        title="Detected Damages with Affected Parts (Hover to View Labels)",
        xaxis=dict(visible=False, range=[0, W_img]),
        yaxis=dict(visible=False, range=[H_img, 0]),
        margin=dict(l=0, r=0, t=40, b=0),
        height=H_img, width=W_img
    )
    fig.show(renderer='browser')

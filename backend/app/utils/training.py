import os
import json
import torch
import numpy as np
from PIL import Image
from tqdm import tqdm
from skimage.draw import polygon
from torch.utils.data import Dataset
from torchvision import transforms as T
from segmentation_models_pytorch.metrics import get_stats, iou_score


class CarDataset(Dataset):
    def __init__(self, imgs_path, annotations_path, classes, sizes):
        self.imgs_path = imgs_path
        self.annotations_path = annotations_path
        self.classes = classes
        self.images = list(sorted(os.listdir(imgs_path)))
        self.annotations = [x + ".json" for x in self.images]
        self.sizes = sizes
        self.train_transform = T.Compose([T.Resize(self.sizes), T.ToTensor()])

    def get_mask(self, annfile):
        img_height, img_width = annfile["size"]["height"], annfile["size"]["width"]
        mask = torch.zeros((img_height, img_width), dtype=torch.long)
        mask_numpy = mask.numpy()
        for object_ in annfile["objects"]:
            class_id = self.classes.index(object_["classId"])
            polygon_ = np.asarray(object_["points"]["exterior"])
            x_, y_ = polygon(polygon_[:, 0], polygon_[:, 1], (img_width, img_height))
            mask_numpy[y_, x_] = class_id + 1
        masks = [(mask_numpy == class_id) for class_id in range(len(self.classes) + 1)]
        return np.stack(masks, axis=-1).astype('int')

    def __getitem__(self, idx):
        img_path = os.path.join(self.imgs_path, self.images[idx])
        ann_path = os.path.join(self.annotations_path, self.annotations[idx])
        image = np.array(Image.open(img_path).convert("RGB"))
        annfile = json.load(open(ann_path, 'r'))
        annotated_mask = self.get_mask(annfile)
        augmented = self.train_transform(image=image, mask=annotated_mask)
        image = augmented["image"]
        mask = augmented["mask"]
        return image, mask.long()

    def __len__(self):
        return len(self.images)


def train_and_validate(model, optim, criterion, dataloader, epochs, checkpointName, folder_to_save, device):
    history = {'train_loss': [], 'train_score': [], 'valid_loss': [], 'valid_score': []}
    best_loss = np.inf
    best_score = 0

    for epoch in tqdm(range(epochs), leave=True):
        loop = tqdm(enumerate(dataloader), total=len(dataloader))
        for batch_idx, (X, y) in loop:
            if batch_idx + 5 < len(dataloader):
                model.train()
                y = y.squeeze(1)
                X, y = X.to(device), y.to(device)
                y = y.permute(0, 3, 1, 2)
                logits = model(X)
                tp, fp, fn, tn = get_stats(logits.int(), y.int(), mode="multilabel", threshold=0.5)
                iouscore = iou_score(tp, fp, fn, tn, reduction="micro")
                loss = criterion(logits, y)
                optim.zero_grad()
                loss.backward()
                optim.step()
                loop.set_description(f'Epoch {epoch+1}/{epochs}')
                loop.set_postfix(loss=loss.item(), iou_score=iouscore.item())
                history['train_loss'].append(loss.item())
                history['train_score'].append(iouscore.item())
            else:
                model.eval()
                y = y.squeeze(1)
                X, y = X.to(device), y.to(device)
                y = y.permute(0, 3, 1, 2)
                logits = model(X)
                tp, fp, fn, tn = get_stats(logits.int(), y.int(), mode='multilabel', threshold=0.5)
                iouscore = iou_score(tp, fp, fn, tn, reduction="micro")
                loss = criterion(logits, y.long())
                score = iouscore.item()
                history['valid_loss'].append(loss.item())
                history['valid_score'].append(score)

        if loss.item() < best_loss:
            best_loss = loss.item()
            torch.save({
                'epoch': epoch + 1,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optim.state_dict(),
                'loss': loss.item(),
                'iou_score': iouscore.item()
            }, os.path.join(folder_to_save, f"checkpoint_{checkpointName}_best_loss.pth"))

        if score > best_score:
            best_score = score
            torch.save({
                'epoch': epoch + 1,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optim.state_dict(),
                'loss': loss.item(),
                'iou_score': iouscore.item()
            }, os.path.join(folder_to_save, f"checkpoint_{checkpointName}_best_score.pth"))

    torch.save(model, os.path.join(folder_to_save, f'model_{checkpointName}.pth'))
    return model, history

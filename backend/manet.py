import torch.nn as nn
import torchvision.models as models

class MANet(nn.Module):
    def __init__(self, num_parts: int = 10):
        super().__init__()
        self.backbone = models.resnet18(pretrained=True)
        self.backbone.fc = nn.Identity()
        self.head = nn.Linear(512, num_parts * 2)

    def forward(self, x):
        features = self.backbone(x)
        out = self.head(features)
        out = out.view(x.size(0), -1, 2)
        return out

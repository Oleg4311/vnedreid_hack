from pydantic import BaseModel
from typing import List


class BBox(BaseModel):
    x: int
    y: int
    width: int
    height: int


class PartStatusResponse(BaseModel):
    id: str
    status: str
    score: float
    damage_class: str
    box: BBox


class AnalyzeResponse(BaseModel):
    data: List[PartStatusResponse]
    finalScore: float
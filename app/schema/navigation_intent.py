from pydantic import BaseModel
from typing import Dict, List, Optional


class NavigationResponse(BaseModel):
    web: Optional[str] = None
    android: Optional[str] = None
    ios: Optional[str] = None

class NavigationIntent(BaseModel):
    id: int
    intent: str
    description: str
    parameters: Dict[str, str]
    required: List[str]
    responses: NavigationResponse 

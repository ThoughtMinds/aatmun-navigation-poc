from pydantic import BaseModel
from typing import Dict, List, Optional

class IntentCreate(BaseModel):
    intent: str
    description: str
    parameters: Dict[str, str]
    required: List[str]
    responses: Dict[str, str]

class IntentResponse(BaseModel):
    intent_id: int
    intent: str
    description: str
    parameters: Dict[str, str]
    required: List[str]
    responses: Dict[str, str]

class NavigationQuery(BaseModel):
    query: str
    source: Optional[str] = None
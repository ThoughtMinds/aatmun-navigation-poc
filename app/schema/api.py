from pydantic import BaseModel
from typing import Dict, List, Optional

class IntentCreate(BaseModel):
    chroma_id: Optional[str] = None # Not needed when creating intent
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
    
class NavigationTestResult(BaseModel):
    query: str
    actual_intent: str
    predicted_intent: str
from pydantic import BaseModel, field_validator

class Navigation(BaseModel):
    id: int
    reasoning: str
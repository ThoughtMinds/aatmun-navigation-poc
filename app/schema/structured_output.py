from pydantic import BaseModel, field_validator
from typing import Union

class Navigation(BaseModel):
    id: Union[str, int]
    reasoning: str
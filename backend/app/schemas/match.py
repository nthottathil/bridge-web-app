from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class MatchResponse(BaseModel):
    user_id: int
    first_name: str
    age: int
    profession: str
    statement: Optional[str]
    interests: List[str]
    compatibility_score: int
    location: str
    primary_goal: str

    class Config:
        from_attributes = True


class MatchRequestCreate(BaseModel):
    to_user_id: int


class MatchRequestResponse(BaseModel):
    request_id: int
    from_user: MatchResponse
    created_at: datetime

    class Config:
        from_attributes = True

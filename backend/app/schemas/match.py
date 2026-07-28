from pydantic import BaseModel
from typing import Any, List, Dict, Optional
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
    # Fields below are declared so FastAPI doesn't strip them from the
    # response — the match cards render all of them.
    surname: Optional[str] = None
    focus: Optional[str] = None
    headline: Optional[str] = None
    profile_photo_url: Optional[str] = None
    perspective_answers: Optional[Dict[str, Any]] = None

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

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class GroupMemberResponse(BaseModel):
    user_id: int
    first_name: Optional[str] = None
    surname: Optional[str] = None
    age: Optional[int] = None
    profession: Optional[str] = None
    interests: Optional[List[str]] = []
    primary_goal: Optional[str] = None
    statement: Optional[str] = None
    location: Optional[str] = None
    focus: Optional[str] = None
    profile_photo_url: Optional[str] = None
    joined_at: datetime

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    group_id: int
    group_name: Optional[str] = None
    created_at: datetime
    member_count: int
    members: List[GroupMemberResponse]
    message_count: int

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import List
from datetime import datetime


class GroupMemberResponse(BaseModel):
    user_id: int
    first_name: str
    age: int
    profession: str
    interests: List[str]
    primary_goal: str
    statement: str
    joined_at: datetime

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    group_id: int
    created_at: datetime
    member_count: int
    members: List[GroupMemberResponse]
    message_count: int

    class Config:
        from_attributes = True

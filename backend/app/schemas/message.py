from pydantic import BaseModel
from datetime import datetime


class MessageCreate(BaseModel):
    message_text: str


class MessageResponse(BaseModel):
    id: int
    group_id: int
    user_id: int
    message_text: str
    created_at: datetime
    user_first_name: str  # From join

    class Config:
        from_attributes = True

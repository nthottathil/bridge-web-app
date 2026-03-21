from pydantic import BaseModel
from typing import Optional, Any, List
from datetime import datetime


class MessageCreate(BaseModel):
    message_text: str


class PollOptionResponse(BaseModel):
    id: int
    text: str
    vote_count: int = 0


class MessageResponse(BaseModel):
    id: int
    group_id: int
    user_id: int
    message_text: str
    message_type: str = "text"
    metadata_json: Optional[Any] = None
    created_at: datetime
    user_first_name: str  # From join
    # Enriched fields for special message types
    collection_id: Optional[int] = None
    collection_title: Optional[str] = None
    poll_options: Optional[List[PollOptionResponse]] = None

    class Config:
        from_attributes = True

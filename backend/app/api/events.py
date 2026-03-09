from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.api.user import get_current_user_from_token
from app.models.user import User
from app.models.event import CalendarEvent
from app.models.group import GroupMember

router = APIRouter(prefix="/api/events", tags=["events"])


class EventCreate(BaseModel):
    group_id: int
    title: str
    location: Optional[str] = None
    event_date: datetime


class EventResponse(BaseModel):
    id: int
    group_id: int
    created_by: int
    title: str
    location: Optional[str]
    event_date: datetime

    class Config:
        from_attributes = True


@router.get("/{group_id}")
def get_events(
    group_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db),
):
    """Get all events for a group."""
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.status == "active",
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    events = db.query(CalendarEvent).filter(
        CalendarEvent.group_id == group_id
    ).order_by(CalendarEvent.event_date).all()

    return [EventResponse.from_orm(e) for e in events]


@router.post("/", response_model=EventResponse)
def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db),
):
    """Create a calendar event for a group."""
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == event_data.group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.status == "active",
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    event = CalendarEvent(
        group_id=event_data.group_id,
        created_by=current_user.id,
        title=event_data.title,
        location=event_data.location,
        event_date=event_data.event_date,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return EventResponse.from_orm(event)


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db),
):
    """Delete a calendar event."""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator can delete this event")

    db.delete(event)
    db.commit()
    return {"status": "deleted"}

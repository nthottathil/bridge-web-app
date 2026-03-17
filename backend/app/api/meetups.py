"""
Meetup invitations API endpoints.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.group import GroupMember
from app.models.meetup import MeetupInvitation, MeetupAttendee
from app.models.message import Message

router = APIRouter(prefix="/api/meetups", tags=["meetups"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user


def _verify_group_member(db: Session, user_id: int, group_id: int):
    """Verify the user is an active member of the group."""
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
        GroupMember.status == "active"
    ).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )


@router.post("")
def create_meetup(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a meetup invitation for a group."""
    group_id = data.get("group_id")
    location = data.get("location")
    event_date = data.get("event_date")
    notes = data.get("notes")

    if not group_id or not location or not event_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="group_id, location, and event_date are required"
        )

    _verify_group_member(db, current_user.id, group_id)

    # Parse event_date if it's a string
    if isinstance(event_date, str):
        event_date = datetime.fromisoformat(event_date)

    meetup = MeetupInvitation(
        group_id=group_id,
        created_by=current_user.id,
        location=location,
        event_date=event_date,
        notes=notes
    )
    db.add(meetup)
    db.flush()

    # Also create a message in the group chat
    message = Message(
        group_id=group_id,
        user_id=current_user.id,
        message_text=f"📍 Meetup created: {location}",
        message_type="meetup",
        metadata_json={"meetup_id": meetup.id}
    )
    db.add(message)
    db.commit()
    db.refresh(meetup)

    return {
        "id": meetup.id,
        "group_id": meetup.group_id,
        "created_by": meetup.created_by,
        "location": meetup.location,
        "event_date": meetup.event_date.isoformat() if meetup.event_date else None,
        "notes": meetup.notes,
        "created_at": meetup.created_at.isoformat() if meetup.created_at else None,
        "attendees": []
    }


@router.get("/{group_id}")
def get_meetups(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all meetups for a group with attendee info."""
    _verify_group_member(db, current_user.id, group_id)

    meetups = db.query(MeetupInvitation).filter(
        MeetupInvitation.group_id == group_id
    ).order_by(MeetupInvitation.event_date.asc()).all()

    result = []
    for meetup in meetups:
        attendees = []
        for att in meetup.attendees:
            user = db.query(User).filter(User.id == att.user_id).first()
            attendees.append({
                "id": att.id,
                "user_id": att.user_id,
                "first_name": user.first_name if user else "Unknown",
                "profile_photo_url": user.profile_photo_url if user else None,
                "created_at": att.created_at.isoformat() if att.created_at else None
            })

        creator = db.query(User).filter(User.id == meetup.created_by).first()
        result.append({
            "id": meetup.id,
            "group_id": meetup.group_id,
            "created_by": meetup.created_by,
            "creator_name": creator.first_name if creator else "Unknown",
            "location": meetup.location,
            "event_date": meetup.event_date.isoformat() if meetup.event_date else None,
            "notes": meetup.notes,
            "created_at": meetup.created_at.isoformat() if meetup.created_at else None,
            "attendees": attendees
        })

    return result


@router.post("/{meetup_id}/attend")
def attend_meetup(
    meetup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark current user as attending a meetup."""
    meetup = db.query(MeetupInvitation).filter(MeetupInvitation.id == meetup_id).first()
    if not meetup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meetup not found"
        )

    _verify_group_member(db, current_user.id, meetup.group_id)

    # Check if already attending
    existing = db.query(MeetupAttendee).filter(
        MeetupAttendee.meetup_id == meetup_id,
        MeetupAttendee.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already attending this meetup"
        )

    attendee = MeetupAttendee(
        meetup_id=meetup_id,
        user_id=current_user.id
    )
    db.add(attendee)
    db.commit()

    return {"message": "You are now attending this meetup", "meetup_id": meetup_id}


@router.post("/{meetup_id}/unattend")
def unattend_meetup(
    meetup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove current user's attendance from a meetup."""
    meetup = db.query(MeetupInvitation).filter(MeetupInvitation.id == meetup_id).first()
    if not meetup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meetup not found"
        )

    _verify_group_member(db, current_user.id, meetup.group_id)

    attendee = db.query(MeetupAttendee).filter(
        MeetupAttendee.meetup_id == meetup_id,
        MeetupAttendee.user_id == current_user.id
    ).first()
    if not attendee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are not attending this meetup"
        )

    db.delete(attendee)
    db.commit()

    return {"message": "You are no longer attending this meetup", "meetup_id": meetup_id}

"""
Group settings API endpoints (notifications, name, timeline).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.group import Group, GroupMember
from app.models.settings import GroupNotificationSettings
from app.models.timeline import WeeklyFocus, DEFAULT_WEEKLY_FOCUSES

router = APIRouter(prefix="/api/group-settings", tags=["group-settings"])
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


@router.get("/{group_id}")
def get_notification_settings(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notification settings for the current user in a group. Creates defaults if not exist."""
    _verify_group_member(db, current_user.id, group_id)

    settings = db.query(GroupNotificationSettings).filter(
        GroupNotificationSettings.group_id == group_id,
        GroupNotificationSettings.user_id == current_user.id
    ).first()

    if not settings:
        settings = GroupNotificationSettings(
            group_id=group_id,
            user_id=current_user.id
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "id": settings.id,
        "group_id": settings.group_id,
        "user_id": settings.user_id,
        "note_created": settings.note_created,
        "poll_created": settings.poll_created,
        "group_goal_created": settings.group_goal_created,
        "ask_the_group": settings.ask_the_group,
        "vote_on_member_changes": settings.vote_on_member_changes
    }


@router.put("/{group_id}")
def update_notification_settings(
    group_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update notification settings for the current user in a group."""
    _verify_group_member(db, current_user.id, group_id)

    settings = db.query(GroupNotificationSettings).filter(
        GroupNotificationSettings.group_id == group_id,
        GroupNotificationSettings.user_id == current_user.id
    ).first()

    if not settings:
        settings = GroupNotificationSettings(
            group_id=group_id,
            user_id=current_user.id
        )
        db.add(settings)

    allowed_fields = [
        "note_created", "poll_created", "group_goal_created",
        "ask_the_group", "vote_on_member_changes"
    ]
    for field in allowed_fields:
        if field in data:
            setattr(settings, field, data[field])

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "group_id": settings.group_id,
        "user_id": settings.user_id,
        "note_created": settings.note_created,
        "poll_created": settings.poll_created,
        "group_goal_created": settings.group_goal_created,
        "ask_the_group": settings.ask_the_group,
        "vote_on_member_changes": settings.vote_on_member_changes
    }


@router.put("/{group_id}/name")
def update_group_name(
    group_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the group name."""
    _verify_group_member(db, current_user.id, group_id)

    name = data.get("name")
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="name is required"
        )

    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )

    group.name = name
    db.commit()
    db.refresh(group)

    return {
        "id": group.id,
        "name": group.name,
        "message": "Group name updated"
    }


@router.get("/{group_id}/timeline")
def get_timeline(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get weekly focuses for a group. Seeds defaults if none exist."""
    _verify_group_member(db, current_user.id, group_id)

    focuses = db.query(WeeklyFocus).filter(
        WeeklyFocus.group_id == group_id
    ).order_by(WeeklyFocus.week_number.asc()).all()

    # Seed defaults if empty
    if not focuses:
        for item in DEFAULT_WEEKLY_FOCUSES:
            focus = WeeklyFocus(
                group_id=group_id,
                week_number=item["week"],
                title=item["title"],
                description=item["description"],
                is_current=(item["week"] == 1)
            )
            db.add(focus)
        db.commit()

        focuses = db.query(WeeklyFocus).filter(
            WeeklyFocus.group_id == group_id
        ).order_by(WeeklyFocus.week_number.asc()).all()

    return [
        {
            "id": f.id,
            "group_id": f.group_id,
            "week_number": f.week_number,
            "title": f.title,
            "description": f.description,
            "is_current": f.is_current,
            "created_at": f.created_at.isoformat() if f.created_at else None
        }
        for f in focuses
    ]


@router.post("/{group_id}/timeline")
def add_weekly_focus(
    group_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a custom weekly focus to the group timeline."""
    _verify_group_member(db, current_user.id, group_id)

    title = data.get("title")
    description = data.get("description")
    week_number = data.get("week_number")

    if not title or week_number is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="title and week_number are required"
        )

    focus = WeeklyFocus(
        group_id=group_id,
        week_number=week_number,
        title=title,
        description=description,
        is_current=False
    )
    db.add(focus)
    db.commit()
    db.refresh(focus)

    return {
        "id": focus.id,
        "group_id": focus.group_id,
        "week_number": focus.week_number,
        "title": focus.title,
        "description": focus.description,
        "is_current": focus.is_current,
        "created_at": focus.created_at.isoformat() if focus.created_at else None
    }

"""
Groups and messaging API endpoints.
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.group import Group, GroupMember
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse
from app.schemas.group import GroupResponse, GroupMemberResponse
from app.services.group_service import (
    get_user_active_group,
    get_group_members,
    is_user_in_group,
    leave_group,
    get_group_info
)
from app.services.email_service import send_group_joined_notification
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/api", tags=["groups"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    """
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


@router.get("/user/group", response_model=Optional[GroupResponse])
def get_my_group(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current user's active group.

    Returns group details if user is in a group, null otherwise.
    """
    group = get_user_active_group(db, current_user.id)

    if not group:
        return None

    group_info = get_group_info(db, group.id)
    return group_info


@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get details about a specific group.

    User must be a member of the group to view it.
    """
    # Check if user is in this group
    if not is_user_in_group(db, current_user.id, group_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )

    group_info = get_group_info(db, group_id)

    if not group_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )

    return group_info


@router.get("/groups/{group_id}/members", response_model=List[GroupMemberResponse])
def get_group_members_endpoint(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all active members of a group.

    User must be a member of the group.
    """
    # Check if user is in this group
    if not is_user_in_group(db, current_user.id, group_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )

    members = get_group_members(db, group_id)
    return members


@router.post("/groups/{group_id}/leave", response_model=dict)
def leave_group_endpoint(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Leave a group.

    Marks the user's membership as 'left' so they can find new matches.
    """
    # Check if user is in this group
    if not is_user_in_group(db, current_user.id, group_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not a member of this group"
        )

    success = leave_group(db, current_user.id, group_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to leave group"
        )

    return {
        "message": "Successfully left the group",
        "group_id": group_id
    }


@router.post("/groups/{group_id}/messages", response_model=MessageResponse)
def send_message(
    group_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to a group.

    User must be an active member of the group.
    """
    # Check if user is in this group
    if not is_user_in_group(db, current_user.id, group_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )

    # Create message
    new_message = Message(
        group_id=group_id,
        user_id=current_user.id,
        message_text=message_data.message_text
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "id": new_message.id,
        "group_id": new_message.group_id,
        "user_id": new_message.user_id,
        "message_text": new_message.message_text,
        "created_at": new_message.created_at,
        "user_first_name": current_user.first_name
    }


@router.get("/groups/{group_id}/messages", response_model=List[MessageResponse])
def get_messages(
    group_id: int,
    since: Optional[datetime] = Query(None, description="Get messages after this timestamp"),
    limit: int = Query(50, le=100, description="Maximum number of messages to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get messages from a group (for polling).

    Returns messages in chronological order (oldest first).
    Use 'since' parameter to get only new messages since last poll.

    Recommended polling interval: 5 seconds.
    """
    # Check if user is in this group
    if not is_user_in_group(db, current_user.id, group_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )

    # Build query
    query = db.query(Message).filter(Message.group_id == group_id)

    # Filter by timestamp if provided
    if since:
        query = query.filter(Message.created_at > since)

    # Order by creation time (oldest first) and limit
    messages = query.order_by(Message.created_at.asc()).limit(limit).all()

    # Format response with user names
    response = []
    for msg in messages:
        user = db.query(User).filter(User.id == msg.user_id).first()
        response.append({
            "id": msg.id,
            "group_id": msg.group_id,
            "user_id": msg.user_id,
            "message_text": msg.message_text,
            "created_at": msg.created_at,
            "user_first_name": user.first_name if user else "Unknown"
        })

    return response

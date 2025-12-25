"""
Group service for managing group membership and operations.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.group import Group, GroupMember
from app.models.message import Message


def get_user_active_group(db: Session, user_id: int) -> Optional[Group]:
    """
    Get the active group for a user.

    Args:
        db: Database session
        user_id: User ID

    Returns:
        Group if user is in an active group, None otherwise
    """
    membership = db.query(GroupMember).filter(
        GroupMember.user_id == user_id,
        GroupMember.status == "active"
    ).first()

    if not membership:
        return None

    return db.query(Group).filter(Group.id == membership.group_id).first()


def get_group_members(db: Session, group_id: int) -> List[Dict[str, Any]]:
    """
    Get all active members of a group.

    Args:
        db: Database session
        group_id: Group ID

    Returns:
        List of member information dictionaries
    """
    memberships = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.status == "active"
    ).all()

    members = []
    for membership in memberships:
        user = db.query(User).filter(User.id == membership.user_id).first()
        if user:
            members.append({
                "user_id": user.id,
                "first_name": user.first_name,
                "age": user.age,
                "profession": user.profession,
                "interests": user.interests,
                "primary_goal": user.primary_goal,
                "statement": user.statement,
                "joined_at": membership.joined_at
            })

    return members


def is_user_in_group(db: Session, user_id: int, group_id: int) -> bool:
    """
    Check if a user is an active member of a specific group.

    Args:
        db: Database session
        user_id: User ID
        group_id: Group ID

    Returns:
        True if user is active member, False otherwise
    """
    membership = db.query(GroupMember).filter(
        GroupMember.user_id == user_id,
        GroupMember.group_id == group_id,
        GroupMember.status == "active"
    ).first()

    return membership is not None


def leave_group(db: Session, user_id: int, group_id: int) -> bool:
    """
    Remove a user from a group by marking their membership as 'left'.

    Args:
        db: Database session
        user_id: User ID
        group_id: Group ID

    Returns:
        True if successful, False if user not in group
    """
    membership = db.query(GroupMember).filter(
        GroupMember.user_id == user_id,
        GroupMember.group_id == group_id,
        GroupMember.status == "active"
    ).first()

    if not membership:
        return False

    membership.status = "left"
    db.commit()

    return True


def get_group_info(db: Session, group_id: int) -> Optional[Dict[str, Any]]:
    """
    Get detailed information about a group.

    Args:
        db: Database session
        group_id: Group ID

    Returns:
        Dictionary with group info or None if not found
    """
    group = db.query(Group).filter(Group.id == group_id).first()

    if not group:
        return None

    members = get_group_members(db, group_id)

    # Get message count
    message_count = db.query(Message).filter(Message.group_id == group_id).count()

    return {
        "group_id": group.id,
        "created_at": group.created_at,
        "member_count": len(members),
        "members": members,
        "message_count": message_count
    }

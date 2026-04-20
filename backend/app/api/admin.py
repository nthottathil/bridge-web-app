"""
Admin API endpoints for managing users.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.match import MatchRequest
from app.models.group import GroupMember
from app.models.message import Message
from app.models.friend import Friend
from app.models.collection import (
    Poll, PollVote, GroupGoal, PersonalGoal, Note, AskTheGroup, AskReply
)
from app.models.group import Group

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/reset-account")
def reset_account(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Reset a user account by email so they go through onboarding again.

    Clears: group memberships, match requests, messages, friends,
    collection data, and profile fields.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_id = user.id

    # Remove group memberships
    db.query(GroupMember).filter(GroupMember.user_id == user_id).delete()

    # Remove match requests (sent and received)
    db.query(MatchRequest).filter(
        (MatchRequest.from_user_id == user_id) | (MatchRequest.to_user_id == user_id)
    ).delete(synchronize_session=False)

    # Remove messages
    db.query(Message).filter(Message.user_id == user_id).delete()

    # Remove friends (both directions)
    db.query(Friend).filter(
        (Friend.user_id == user_id) | (Friend.friend_user_id == user_id)
    ).delete(synchronize_session=False)

    # Remove poll votes
    db.query(PollVote).filter(PollVote.user_id == user_id).delete()

    # Remove collection items created by user
    db.query(Poll).filter(Poll.created_by == user_id).delete()
    db.query(GroupGoal).filter(GroupGoal.created_by == user_id).delete()
    db.query(Note).filter(Note.created_by == user_id).delete()
    db.query(AskReply).filter(AskReply.user_id == user_id).delete()
    db.query(AskTheGroup).filter(AskTheGroup.created_by == user_id).delete()

    # Reset profile fields to force re-onboarding
    user.first_name = ""
    user.surname = ""
    user.age = 0
    user.profession = ""
    user.primary_goal = ""
    user.interests = []
    user.personality = {}
    user.gender_preference = []
    user.age_preference = {}
    user.statement = None
    user.gender = None
    user.focus = None
    user.headline = None
    user.commitment_level = None
    user.deal_breakers = None
    user.perspective_answers = None
    user.profile_photo_url = None
    user.age_collab_only = False
    user.gender_collab_only = False
    user.country = None
    user.location = ""
    user.max_distance = 5

    db.commit()

    return {
        "message": f"Account {email} has been reset successfully",
        "user_id": user_id
    }


@router.get("/groups")
def list_groups(db: Session = Depends(get_db)):
    """List all groups with their names and member info."""
    groups = db.query(Group).all()
    result = []
    for g in groups:
        members = db.query(GroupMember).filter(GroupMember.group_id == g.id, GroupMember.status == "active").all()
        member_names = []
        for m in members:
            user = db.query(User).filter(User.id == m.user_id).first()
            if user:
                member_names.append(user.first_name or user.email)
        result.append({"id": g.id, "name": g.name, "members": member_names})
    return result


@router.put("/groups/{group_id}/name")
def admin_rename_group(group_id: int, name: str, db: Session = Depends(get_db)):
    """Rename a group by ID."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    group.name = name
    db.commit()
    return {"message": f"Group {group_id} renamed to '{name}'"}


@router.post("/groups/{group_id}/add-member")
def admin_add_member(group_id: int, email: str, db: Session = Depends(get_db)):
    """Add a user to a group by email."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Remove any existing active memberships
    db.query(GroupMember).filter(
        GroupMember.user_id == user.id,
        GroupMember.status == "active"
    ).update({"status": "left"})

    # Add to new group
    new_member = GroupMember(group_id=group_id, user_id=user.id, status="active")
    db.add(new_member)
    db.commit()

    return {"message": f"{user.first_name or user.email} added to group {group_id}"}

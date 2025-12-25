"""
Matching API endpoints for finding and requesting matches.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.match import MatchRequest
from app.models.group import Group, GroupMember
from app.schemas.match import MatchResponse, MatchRequestCreate, MatchRequestResponse
from app.services.matching_service import (
    find_potential_matches,
    is_user_in_active_group,
    get_existing_match_request,
    calculate_compatibility_score
)
from app.services.email_service import send_match_notification
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/api/matches", tags=["matches"])
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


@router.get("", response_model=List[MatchResponse])
def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get top 3 potential matches for the current user.

    Returns the 3 users with highest compatibility scores.
    Filters out users already in groups and those with pending requests.
    """
    # Check if user is already in a group
    if is_user_in_active_group(db, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already in a group. Leave your current group to find new matches."
        )

    matches = find_potential_matches(db, current_user, limit=3)

    return matches


@router.post("/request", response_model=dict)
def send_match_request(
    match_request: MatchRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a match request to another user.

    Creates a pending match request that the other user can accept or reject.
    """
    # Check if user is already in a group
    if is_user_in_active_group(db, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already in a group"
        )

    # Check if target user exists
    target_user = db.query(User).filter(User.id == match_request.to_user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Can't match with yourself
    if current_user.id == match_request.to_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send match request to yourself"
        )

    # Check if target user is already in a group
    if is_user_in_active_group(db, target_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user is already in a group"
        )

    # Check if there's already a pending request
    existing_request = get_existing_match_request(db, current_user.id, target_user.id)
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A match request already exists between you and this user"
        )

    # Create match request
    new_request = MatchRequest(
        from_user_id=current_user.id,
        to_user_id=target_user.id,
        status="pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # Send notification email
    send_match_notification(target_user.email, current_user.first_name)

    return {
        "message": "Match request sent successfully",
        "request_id": new_request.id
    }


@router.get("/requests", response_model=List[MatchRequestResponse])
def get_match_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all pending match requests received by the current user.
    """
    requests = db.query(MatchRequest).filter(
        MatchRequest.to_user_id == current_user.id,
        MatchRequest.status == "pending"
    ).all()

    response = []
    for req in requests:
        from_user = db.query(User).filter(User.id == req.from_user_id).first()
        if from_user:
            compatibility = calculate_compatibility_score(current_user, from_user)
            response.append({
                "request_id": req.id,
                "from_user": {
                    "user_id": from_user.id,
                    "first_name": from_user.first_name,
                    "age": from_user.age,
                    "profession": from_user.profession,
                    "statement": from_user.statement,
                    "interests": from_user.interests,
                    "compatibility_score": compatibility,
                    "location": from_user.location,
                    "primary_goal": from_user.primary_goal
                },
                "created_at": req.created_at
            })

    return response


@router.post("/{request_id}/accept", response_model=dict)
def accept_match_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accept a match request and create/join a group.

    If the sender is already in a group, the receiver joins that group.
    Otherwise, a new group is created for both users.
    """
    # Get the match request
    match_request = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.to_user_id == current_user.id,
        MatchRequest.status == "pending"
    ).first()

    if not match_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match request not found"
        )

    # Check if current user is already in a group
    if is_user_in_active_group(db, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already in a group"
        )

    # Get the sender
    sender = db.query(User).filter(User.id == match_request.from_user_id).first()

    # Check if sender is in a group
    sender_membership = db.query(GroupMember).filter(
        GroupMember.user_id == sender.id,
        GroupMember.status == "active"
    ).first()

    if sender_membership:
        # Join sender's existing group
        group_id = sender_membership.group_id
        group = db.query(Group).filter(Group.id == group_id).first()

        # Add current user to the group
        new_member = GroupMember(
            group_id=group_id,
            user_id=current_user.id,
            status="active"
        )
        db.add(new_member)
    else:
        # Create new group for both users
        new_group = Group()
        db.add(new_group)
        db.flush()  # Get the group ID

        # Add both users to the group
        sender_member = GroupMember(
            group_id=new_group.id,
            user_id=sender.id,
            status="active"
        )
        receiver_member = GroupMember(
            group_id=new_group.id,
            user_id=current_user.id,
            status="active"
        )
        db.add(sender_member)
        db.add(receiver_member)

        group_id = new_group.id

    # Update match request status
    match_request.status = "accepted"

    db.commit()

    return {
        "message": "Match request accepted",
        "group_id": group_id
    }


@router.post("/{request_id}/reject", response_model=dict)
def reject_match_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Reject a match request.
    """
    # Get the match request
    match_request = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.to_user_id == current_user.id,
        MatchRequest.status == "pending"
    ).first()

    if not match_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match request not found"
        )

    # Update status
    match_request.status = "rejected"
    db.commit()

    return {
        "message": "Match request rejected"
    }

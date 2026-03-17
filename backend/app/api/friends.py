"""
Friends API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.friend import Friend

router = APIRouter(prefix="/api/friends", tags=["friends"])
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


@router.post("")
def add_friend(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a friend by user ID."""
    friend_user_id = data.get("friend_user_id")
    if not friend_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="friend_user_id is required"
        )

    if friend_user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot add yourself as a friend"
        )

    # Check friend user exists
    friend_user = db.query(User).filter(User.id == friend_user_id).first()
    if not friend_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check not already friends
    existing = db.query(Friend).filter(
        Friend.user_id == current_user.id,
        Friend.friend_user_id == friend_user_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already friends with this user"
        )

    friend = Friend(
        user_id=current_user.id,
        friend_user_id=friend_user_id
    )
    db.add(friend)
    db.commit()
    db.refresh(friend)

    return {
        "id": friend.id,
        "user_id": friend.user_id,
        "friend_user_id": friend.friend_user_id,
        "created_at": friend.created_at.isoformat() if friend.created_at else None
    }


@router.get("")
def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all friends of the current user with their profile info."""
    friends = db.query(Friend).filter(
        Friend.user_id == current_user.id
    ).all()

    result = []
    for f in friends:
        user = db.query(User).filter(User.id == f.friend_user_id).first()
        if user:
            result.append({
                "id": f.id,
                "user_id": user.id,
                "first_name": user.first_name,
                "surname": user.surname,
                "profession": user.profession,
                "location": user.location,
                "profile_photo_url": user.profile_photo_url,
                "focus": user.focus
            })

    return result


@router.delete("/{friend_id}")
def remove_friend(
    friend_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a friend."""
    friend = db.query(Friend).filter(
        Friend.id == friend_id,
        Friend.user_id == current_user.id
    ).first()
    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend not found"
        )

    db.delete(friend)
    db.commit()

    return {"message": "Friend removed", "friend_id": friend_id}

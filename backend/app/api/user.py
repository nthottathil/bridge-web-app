from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.group import GroupMember
from app.schemas.user import UserProfile, UserProfileUpdate

router = APIRouter(prefix="/api/user", tags=["user"])


def get_current_user_from_token(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """Get current user from JWT token in Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )

    token = authorization.replace("Bearer ", "")
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user_from_token)):
    """Get current user's full profile."""
    return UserProfile.from_orm(current_user)


@router.put("/profile", response_model=UserProfile)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Update current user's profile."""
    # A profile is frozen while its owner is in a group — the group matched
    # with what it says, so it can't change underneath them.
    in_group = db.query(GroupMember).filter(
        GroupMember.user_id == current_user.id,
        GroupMember.status == "active",
    ).first()
    if in_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your profile is locked while you're in a group. Leave the group to make changes.",
        )

    update_dict = profile_data.model_dump(exclude_unset=True)

    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )

    for field, value in update_dict.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return UserProfile.from_orm(current_user)

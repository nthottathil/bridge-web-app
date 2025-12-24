from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, generate_verification_code
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, VerifyEmail
from app.services.email_service import send_verification_email

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=dict)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account and send verification email.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate verification code
    verification_code = generate_verification_code()

    # Create user
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        email_verified=False,
        verification_token=verification_code,
        first_name=user_data.first_name,
        surname=user_data.surname,
        age=user_data.age,
        profession=user_data.profession,
        primary_goal=user_data.primary_goal,
        interests=user_data.interests,
        personality=user_data.personality.dict(),
        gender_preference=user_data.gender_preference,
        age_preference=user_data.age_preference.dict(),
        statement=user_data.statement,
        location=user_data.location,
        max_distance=user_data.max_distance
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send verification email (or simulate)
    send_verification_email(user_data.email, verification_code)

    return {
        "message": "User created successfully. Please check your email for verification code.",
        "email": user_data.email
    }


@router.post("/verify", response_model=Token)
def verify_email(verify_data: VerifyEmail, db: Session = Depends(get_db)):
    """
    Verify email with code and return JWT token.
    """
    user = db.query(User).filter(User.email == verify_data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    if user.verification_token != verify_data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )

    # Mark as verified
    user.email_verified = True
    user.verification_token = None
    db.commit()
    db.refresh(user)

    # Create access token
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})

    return Token(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.
    """
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first."
        )

    # Create access token
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})

    return Token(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.post("/resend-code", response_model=dict)
def resend_verification_code(email: str, db: Session = Depends(get_db)):
    """
    Resend verification code to email.
    """
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    # Generate new code
    new_code = generate_verification_code()
    user.verification_token = new_code
    db.commit()

    # Send email
    send_verification_email(email, new_code)

    return {"message": "Verification code resent successfully"}

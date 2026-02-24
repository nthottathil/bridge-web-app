"""
Script to reset user password
"""
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User

# Database connection
from app.core.config import settings
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def reset_password(email: str, new_password: str):
    """Reset password for a user"""
    db = SessionLocal()
    try:
        # Find user
        user = db.query(User).filter(User.email == email).first()

        if not user:
            print(f"User with email {email} not found!")
            return

        # Hash new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Update password
        user.password_hash = hashed_password
        db.commit()

        print(f"Password updated successfully for {email}")
        print(f"New password: {new_password}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_password("nthottathil@live.co.uk", "test718")

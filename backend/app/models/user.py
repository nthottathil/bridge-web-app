from sqlalchemy import Column, Integer, String, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True)

    # Profile fields
    first_name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    profession = Column(String, nullable=False)

    # Matching criteria
    primary_goal = Column(String, nullable=False)
    interests = Column(JSON, nullable=False, default=list)  # Array of strings
    personality = Column(JSON, nullable=False)  # {extroversion, openness, agreeableness, conscientiousness}
    gender_preference = Column(JSON, nullable=False, default=list)  # Array of strings
    age_preference = Column(JSON, nullable=False)  # {min, max}

    # User statement
    statement = Column(Text, nullable=True)

    # Location
    location = Column(String, nullable=False)
    max_distance = Column(Integer, nullable=False, default=5)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    group_memberships = relationship("GroupMember", back_populates="user")
    sent_match_requests = relationship("MatchRequest", foreign_keys="MatchRequest.from_user_id", back_populates="from_user")
    received_match_requests = relationship("MatchRequest", foreign_keys="MatchRequest.to_user_id", back_populates="to_user")
    messages = relationship("Message", back_populates="user")

"""Models for meetup invitations."""
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class MeetupInvitation(Base):
    __tablename__ = "meetup_invitations"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    location = Column(String, nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendees = relationship("MeetupAttendee", back_populates="meetup")
    creator = relationship("User", foreign_keys=[created_by])


class MeetupAttendee(Base):
    __tablename__ = "meetup_attendees"

    id = Column(Integer, primary_key=True, index=True)
    meetup_id = Column(Integer, ForeignKey("meetup_invitations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    meetup = relationship("MeetupInvitation", back_populates="attendees")
    user = relationship("User", foreign_keys=[user_id])

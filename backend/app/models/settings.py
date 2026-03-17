"""Models for group notification settings."""
from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class GroupNotificationSettings(Base):
    __tablename__ = "group_notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note_created = Column(Boolean, default=True)
    poll_created = Column(Boolean, default=True)
    group_goal_created = Column(Boolean, default=False)
    ask_the_group = Column(Boolean, default=True)
    vote_on_member_changes = Column(Boolean, default=True)

    user = relationship("User", foreign_keys=[user_id])

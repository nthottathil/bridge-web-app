"""Models for group collections: goals, polls, notes, ask-the-group."""
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class GroupGoal(Base):
    __tablename__ = "group_goals"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    week_number = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    personal_goals = relationship("PersonalGoal", back_populates="group_goal")
    creator = relationship("User", foreign_keys=[created_by])


class PersonalGoal(Base):
    __tablename__ = "personal_goals"

    id = Column(Integer, primary_key=True, index=True)
    group_goal_id = Column(Integer, ForeignKey("group_goals.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    review_text = Column(Text, nullable=True)
    blockers = Column(Text, nullable=True)
    help_needed = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    group_goal = relationship("GroupGoal", back_populates="personal_goals")
    user = relationship("User", foreign_keys=[user_id])


class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    options = relationship("PollOption", back_populates="poll")
    creator = relationship("User", foreign_keys=[created_by])


class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    text = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    poll = relationship("Poll", back_populates="options")
    votes = relationship("PollVote", back_populates="option")
    creator = relationship("User", foreign_keys=[created_by])


class PollVote(Base):
    __tablename__ = "poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    option = relationship("PollOption", back_populates="votes")
    user = relationship("User", foreign_keys=[user_id])


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    reminder_date = Column(DateTime(timezone=True), nullable=True)
    repeat = Column(String, nullable=True)  # None, Weekly, Monthly
    add_to_calendar = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", foreign_keys=[created_by])


class AskTheGroup(Base):
    __tablename__ = "ask_the_group"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    replies = relationship("AskReply", back_populates="ask")
    creator = relationship("User", foreign_keys=[created_by])


class AskReply(Base):
    __tablename__ = "ask_replies"

    id = Column(Integer, primary_key=True, index=True)
    ask_id = Column(Integer, ForeignKey("ask_the_group.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reply_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ask = relationship("AskTheGroup", back_populates="replies")
    user = relationship("User", foreign_keys=[user_id])

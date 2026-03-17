"""Models for group timeline / weekly focuses."""
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# Pre-defined weekly focus themes for the 8-week cycle
DEFAULT_WEEKLY_FOCUSES = [
    {"week": 1, "title": "Getting comfortable", "description": "Introduce yourselves and set expectations for the group."},
    {"week": 2, "title": "Trust & expectations", "description": "Build trust by sharing goals and what you expect from each other."},
    {"week": 3, "title": "Work style & boundaries", "description": "Share how each person likes to work / communicate."},
    {"week": 4, "title": "Goals & momentum", "description": "Set concrete goals and start building momentum together."},
    {"week": 5, "title": "Doing things together", "description": "Collaborate on a shared activity or project milestone."},
    {"week": 6, "title": "Connection beyond goals", "description": "Deepen connections beyond just the work you're doing."},
    {"week": 7, "title": "Looking ahead", "description": "Reflect on progress and plan for what comes next."},
    {"week": 8, "title": "Closing or continuing", "description": "Decide if you want to continue as a group or part ways."},
]


class WeeklyFocus(Base):
    __tablename__ = "weekly_focuses"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_current = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

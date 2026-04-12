"""
Bridge API - FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, matches, groups, user, events, tasks, collections, meetups, friends, group_settings, admin
# Ensure all models are imported so tables are registered
from app.models import (  # noqa: F401
    User, Group, GroupMember, MatchRequest, Message,
    GroupGoal, PersonalGoal, Poll, PollOption, PollVote,
    Note, AskTheGroup, AskReply,
    MeetupInvitation, MeetupAttendee,
    Friend, WeeklyFocus, GroupNotificationSettings,
)
from app.models import event, task  # noqa: F401

# Create database tables
Base.metadata.create_all(bind=engine)

# Add missing columns to existing tables (safe for re-runs)
def add_missing_columns():
    inspector = inspect(engine)
    if 'users' in inspector.get_table_names():
        existing = {col['name'] for col in inspector.get_columns('users')}
        new_cols = {
            'gender': 'VARCHAR',
            'focus': 'VARCHAR',
            'headline': 'TEXT',
            'commitment_level': 'VARCHAR',
            'deal_breakers': 'JSON',
            'perspective_answers': 'JSON',
            'profile_photo_url': 'TEXT',
            'age_collab_only': 'BOOLEAN',
            'gender_collab_only': 'BOOLEAN',
            'country': 'VARCHAR',
        }
        with engine.begin() as conn:
            for col_name, col_type in new_cols.items():
                if col_name not in existing:
                    conn.execute(text(f'ALTER TABLE users ADD COLUMN {col_name} {col_type}'))

    # Add name to groups table
    if 'groups' in inspector.get_table_names():
        existing = {col['name'] for col in inspector.get_columns('groups')}
        if 'name' not in existing:
            with engine.begin() as conn:
                conn.execute(text('ALTER TABLE groups ADD COLUMN name VARCHAR'))

    # Add message_type and metadata_json to messages table
    if 'messages' in inspector.get_table_names():
        existing = {col['name'] for col in inspector.get_columns('messages')}
        with engine.begin() as conn:
            if 'message_type' not in existing:
                conn.execute(text("ALTER TABLE messages ADD COLUMN message_type VARCHAR DEFAULT 'text'"))
            if 'metadata_json' not in existing:
                conn.execute(text('ALTER TABLE messages ADD COLUMN metadata_json JSON'))

try:
    add_missing_columns()
except Exception as e:
    print(f"Column migration note: {e}")

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="API for Bridge - Connect with like-minded people",
    version="1.0.0",
    debug=settings.DEBUG
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://bridgewebapp.netlify.app",
        "https://thebridgeapp.online",
        "https://www.thebridgeapp.online",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(matches.router)
app.include_router(groups.router)
app.include_router(user.router)
app.include_router(events.router)
app.include_router(tasks.router)
app.include_router(collections.router)
app.include_router(meetups.router)
app.include_router(friends.router)
app.include_router(group_settings.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"status": "healthy", "app": settings.APP_NAME, "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected", "app": settings.APP_NAME}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)

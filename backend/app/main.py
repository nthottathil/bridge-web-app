"""
Bridge API - FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, matches, groups, user, events, tasks
from app.models import event, task  # ensure new tables are registered

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
            'profile_photo_url': 'VARCHAR',
            'age_collab_only': 'BOOLEAN',
            'gender_collab_only': 'BOOLEAN',
            'country': 'VARCHAR',
        }
        with engine.begin() as conn:
            for col_name, col_type in new_cols.items():
                if col_name not in existing:
                    conn.execute(text(f'ALTER TABLE users ADD COLUMN {col_name} {col_type}'))

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
        "http://localhost:3000",  # React development server
        "http://localhost:5173",  # Vite development server (alternative)
        "https://bridgewebapp.netlify.app",  # Netlify frontend
        "https://thebridgeapp.online",  # Custom domain
        "https://www.thebridgeapp.online",  # Custom domain (www)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(matches.router)
app.include_router(groups.router)
app.include_router(user.router)
app.include_router(events.router)
app.include_router(tasks.router)

# Health check endpoint
@app.get("/")
def read_root():
    """
    Health check endpoint to verify API is running.
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Detailed health check with database connection status.
    """
    # TODO: Add database connection check
    return {
        "status": "healthy",
        "database": "connected",  # Will be checked properly in production
        "app": settings.APP_NAME
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5000,
        reload=True  # Auto-reload on code changes during development
    )

"""
Bridge API - FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, matches

# Create database tables
Base.metadata.create_all(bind=engine)

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
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(matches.router)

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

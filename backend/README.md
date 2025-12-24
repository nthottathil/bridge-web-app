# Bridge Backend API

FastAPI backend for the Bridge application - connecting people based on shared interests, personality, and goals.

## Technology Stack

- **Framework**: FastAPI 0.109.0
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with email verification
- **Password Hashing**: bcrypt via passlib
- **Migrations**: Alembic

## Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── matches.py    # Matching endpoints (TODO)
│   │   ├── groups.py     # Group management (TODO)
│   │   └── messages.py   # Messaging endpoints (TODO)
│   ├── core/             # Core configuration
│   │   ├── config.py     # Settings and environment variables
│   │   ├── database.py   # Database connection
│   │   └── security.py   # JWT and password utilities
│   ├── models/           # SQLAlchemy database models
│   │   ├── user.py       # User model
│   │   ├── group.py      # Group and GroupMember models
│   │   ├── match.py      # MatchRequest model
│   │   └── message.py    # Message model
│   ├── schemas/          # Pydantic validation schemas
│   │   ├── user.py       # User request/response schemas
│   │   ├── match.py      # Match schemas (TODO)
│   │   └── message.py    # Message schemas
│   ├── services/         # Business logic
│   │   ├── email_service.py       # Email sending (simulated)
│   │   ├── matching_service.py    # Compatibility algorithm (TODO)
│   │   └── group_service.py       # Group formation logic (TODO)
│   └── main.py           # FastAPI application entry point
├── alembic/              # Database migrations
│   ├── versions/         # Migration files
│   ├── env.py            # Migration environment
│   └── script.py.mako    # Migration template
├── alembic.ini           # Alembic configuration
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (create from .env.example)
└── .env.example          # Environment template
```

## Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Install Python Dependencies

**Option A: Using pip (Recommended for Windows)**
```bash
cd backend
pip install -r requirements.txt
```

**Option B: Using virtual environment (Recommended for Mac/Linux)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Note**: If you encounter Rust-related errors during installation (especially with `cryptography` or `pydantic-core`), you may need to install pre-built binaries or use a different Python version (3.11 recommended).

### 2. Set Up PostgreSQL Database

**Install PostgreSQL:**
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bridge;

# Create user (optional)
CREATE USER bridge_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bridge TO bridge_user;

# Exit
\q
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and update with your configuration:
```env
# Update this with your PostgreSQL credentials
DATABASE_URL=postgresql://bridge_user:your_password@localhost:5432/bridge

# Generate a secure secret key (use: openssl rand -hex 32)
JWT_SECRET=your-generated-secret-key-here

# Other settings can remain as defaults
```

### 4. Run Database Migrations

Create initial migration:
```bash
# Generate migration from models
alembic revision --autogenerate -m "Initial migration"

# Apply migration to database
alembic upgrade head
```

### 5. Run the Development Server

```bash
# From the backend directory
python -m uvicorn app.main:app --reload --port 5000
```

Or using the main.py directly:
```bash
python app/main.py
```

The API will be available at:
- **API**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:5000/redoc

## API Endpoints

### Authentication

- **POST /auth/signup** - Create new user account
- **POST /auth/verify** - Verify email with code
- **POST /auth/login** - Login with email/password
- **POST /auth/resend-code** - Resend verification code

### Coming Soon (Week 2-3)

- **GET /api/matches** - Get compatible matches
- **POST /api/matches/request** - Send match request
- **POST /api/matches/:id/accept** - Accept match request
- **GET /api/groups/:id** - Get group details
- **POST /api/groups/:id/messages** - Send message
- **POST /api/groups/:id/leave** - Leave group

## Database Schema

### Tables

1. **users** - User profiles with preferences and personality data
2. **groups** - Group chat rooms
3. **group_members** - User membership in groups
4. **match_requests** - Pending/accepted/rejected match requests
5. **messages** - Chat messages within groups

See `app/models/` for detailed schema definitions.

## Email Verification

Currently, email verification is **simulated** by printing codes to the console. When a user signs up, look for output like:

```
============================================================
📧 VERIFICATION EMAIL (SIMULATED)
============================================================
To: user@example.com
Subject: Verify your Bridge account

Your verification code is: 123456

Enter this code in the app to verify your email.
============================================================
```

To enable real email sending:
1. Uncomment email settings in `.env`
2. Add SMTP credentials (e.g., Gmail with app password)
3. Uncomment SMTP code in `app/services/email_service.py`

## Testing the API

### Using Swagger UI (Recommended)

1. Navigate to http://localhost:5000/docs
2. Click on an endpoint to expand it
3. Click "Try it out"
4. Fill in request body and click "Execute"

### Using curl

**Signup:**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "surname": "Doe",
    "age": 28,
    "profession": "Engineer",
    "primary_goal": "networking",
    "interests": ["technology", "hiking", "music"],
    "personality": {
      "extroversion": 7,
      "openness": 8,
      "agreeableness": 6,
      "conscientiousness": 7
    },
    "gender_preference": ["any"],
    "age_preference": {"min": 25, "max": 35},
    "statement": "Looking to connect with like-minded people",
    "location": "London",
    "max_distance": 10
  }'
```

**Verify Email:**
```bash
curl -X POST http://localhost:5000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Database Connection Issues

**Error**: `could not connect to server: Connection refused`

**Solution**: Ensure PostgreSQL is running:
```bash
# Mac
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Check Services app for PostgreSQL service
```

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution**: Make sure you're running from the `backend` directory and that all `__init__.py` files exist in the app folder structure.

### Migration Issues

**Error**: `Target database is not up to date`

**Solution**: Run migrations:
```bash
alembic upgrade head
```

To reset database (⚠️ deletes all data):
```bash
alembic downgrade base
alembic upgrade head
```

## Development Workflow

1. Make changes to models in `app/models/`
2. Generate migration: `alembic revision --autogenerate -m "Description"`
3. Review migration in `alembic/versions/`
4. Apply migration: `alembic upgrade head`
5. Test endpoints in Swagger UI

## Next Steps (Implementation Plan)

### Week 2: Matching System
- Implement compatibility scoring algorithm
- Create match request endpoints
- Add filtering for users already in groups

### Week 3: Groups & Chat
- Implement group formation logic
- Create message storage and retrieval
- Add polling-based chat endpoints

### Week 4: Frontend Integration
- Connect React frontend to API
- Add authentication context
- Replace fake data with real API calls

### Week 5: Deployment
- Deploy database to Supabase
- Deploy backend to Render
- Configure production environment

## Security Notes

⚠️ **Important for Production**:

1. **Change JWT_SECRET**: Use a long, random string (not the default)
2. **Enable HTTPS**: Use SSL certificates in production
3. **Update CORS**: Restrict allowed origins to your frontend domain
4. **Environment Variables**: Never commit `.env` to version control
5. **Rate Limiting**: Add rate limiting for auth endpoints
6. **SQL Injection**: Already protected by SQLAlchemy parameterization
7. **Password Requirements**: Consider adding minimum password strength

## Support

For issues or questions about the implementation plan, refer to:
- Implementation plan: `C:\Users\nthot\.claude\plans\hashed-jumping-unicorn.md`
- FastAPI docs: https://fastapi.tiangolo.com/
- SQLAlchemy docs: https://docs.sqlalchemy.org/

## License

Private project - Bridge App

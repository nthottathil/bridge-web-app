# Bridge Backend - Quick Start Guide

## What's Been Built (Week 1 Complete ✅)

Your backend foundation is ready with:
- ✅ Complete authentication system (signup, login, email verification)
- ✅ Database models for users, groups, matches, and messages
- ✅ JWT token-based security
- ✅ Email verification system (simulated for now)
- ✅ Full project structure ready for Week 2-5 features

## Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Having trouble?** If you get Rust/cryptography errors on Windows:
- Try: `pip install --only-binary :all: -r requirements.txt`
- Or use Python 3.11 instead of 3.13

### 2. Set Up Database

**Option A: Use PostgreSQL (Recommended for Production)**

Install PostgreSQL and create database:
```bash
# Install PostgreSQL from https://www.postgresql.org/download/

# Create database
psql -U postgres
CREATE DATABASE bridge;
\q
```

Update `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bridge
```

**Option B: Use SQLite (Quick Testing Only)**

Update `backend/.env`:
```env
DATABASE_URL=sqlite:///./bridge.db
```

Note: SQLite doesn't support some PostgreSQL features, so use only for initial testing.

### 3. Run Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply to database
alembic upgrade head
```

### 4. Start the Server

```bash
python app/main.py
```

Visit: http://localhost:5000/docs

## Test It Out

### 1. Sign Up a User

Go to http://localhost:5000/docs and try the `/auth/signup` endpoint:

```json
{
  "email": "test@example.com",
  "password": "password123",
  "first_name": "John",
  "surname": "Doe",
  "age": 28,
  "profession": "Software Engineer",
  "primary_goal": "networking",
  "interests": ["technology", "hiking", "music"],
  "personality": {
    "extroversion": 7,
    "openness": 8,
    "agreeableness": 6,
    "conscientiousness": 7
  },
  "gender_preference": ["any"],
  "age_preference": {
    "min": 25,
    "max": 35
  },
  "statement": "Looking to connect with like-minded tech professionals",
  "location": "London",
  "max_distance": 10
}
```

### 2. Check Console for Verification Code

Look for output like:
```
============================================================
📧 VERIFICATION EMAIL (SIMULATED)
============================================================
Your verification code is: 123456
============================================================
```

### 3. Verify Email

Use `/auth/verify` endpoint:
```json
{
  "email": "test@example.com",
  "code": "123456"
}
```

You'll get back a JWT token!

### 4. Login

Use `/auth/login` endpoint:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## What's Next?

### Week 2: Matching System (Ready to Implement)
- Build compatibility scoring algorithm
- Create endpoints to find and request matches
- Filter out users already in groups

### Week 3: Groups & Chat
- Create group formation when matches are accepted
- Build polling-based chat system
- Add message storage and retrieval

### Week 4: Frontend Integration
- Connect your React app to this API
- Replace fake data with real API calls
- Add authentication context

### Week 5: Deployment
- Deploy to Supabase (database) + Render (backend) + Vercel (frontend)
- All on free tiers!

## Available API Endpoints (Week 1)

✅ **POST /auth/signup** - Create new user account
✅ **POST /auth/verify** - Verify email with 6-digit code
✅ **POST /auth/login** - Login and get JWT token
✅ **POST /auth/resend-code** - Resend verification code
✅ **GET /** - Health check
✅ **GET /health** - Detailed health check

## Common Issues

**Can't install dependencies?**
- Make sure you have Python 3.8+ installed
- Try: `pip install --upgrade pip`
- On Windows with Rust errors, try pre-built binaries: `pip install --only-binary :all: cryptography`

**Database connection error?**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env` is correct
- Verify database exists: `psql -U postgres -l`

**Import errors?**
- Make sure you're in the `backend` directory when running
- Check all `__init__.py` files exist in subdirectories

**Migration errors?**
- Delete `alembic/versions/*.py` files
- Run `alembic revision --autogenerate -m "Initial"` again
- Then `alembic upgrade head`

## File Structure Reference

```
backend/
├── app/
│   ├── api/
│   │   └── auth.py          ✅ Authentication endpoints
│   ├── core/
│   │   ├── config.py        ✅ Settings & environment
│   │   ├── database.py      ✅ DB connection
│   │   └── security.py      ✅ JWT & password hashing
│   ├── models/
│   │   ├── user.py          ✅ User model
│   │   ├── group.py         ✅ Group models
│   │   ├── match.py         ✅ Match request model
│   │   └── message.py       ✅ Message model
│   ├── schemas/
│   │   ├── user.py          ✅ User validation schemas
│   │   ├── match.py         ✅ Match schemas
│   │   └── message.py       ✅ Message schemas
│   ├── services/
│   │   └── email_service.py ✅ Email sending (simulated)
│   └── main.py              ✅ FastAPI app entry point
├── alembic/                 ✅ Database migrations
├── .env                     ✅ Your configuration
└── requirements.txt         ✅ Dependencies
```

## Need Help?

- **API Documentation**: http://localhost:5000/docs (when server is running)
- **Full README**: See [README.md](README.md) for detailed documentation
- **Implementation Plan**: `C:\Users\nthot\.claude\plans\hashed-jumping-unicorn.md`

---

**Week 1 Status: COMPLETE ✅**

Ready to move on to Week 2 when you are!
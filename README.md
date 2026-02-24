# Bridge - Connect with Like-Minded People

**Live at [thebridgeapp.online](https://thebridgeapp.online)**

Bridge is a social networking app that matches people based on shared interests, personality compatibility, and goals. Form groups, chat, and build meaningful connections.

## Features

- **Smart Matching** - Compatibility algorithm scoring interests, personality (Big Five), and goals
- **Match Requests** - Send and receive match requests with accept/decline
- **Group Chat** - Real-time messaging with matched users
- **Profile Editing** - Full profile management with interests, personality, preferences
- **Email Verification** - Secure signup with verification codes via Resend

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcrypt |
| Email | Resend API |
| Hosting | Netlify (frontend), Render (backend) |

## Architecture

```
React Frontend (Netlify)
    ↓ HTTPS/JSON
FastAPI Backend (Render)
    ↓
SQLAlchemy ORM
    ↓
PostgreSQL (Supabase)
```

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 5000
```

### Frontend
```bash
cd bridge-app
npm install
npm start
```

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
RESEND_API_KEY=your-resend-key
APP_NAME=Bridge API
DEBUG=True
```

**Frontend** (`bridge-app/.env.production`):
```
REACT_APP_API_URL=https://bridge-backend-jou8.onrender.com
```

## API Endpoints

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/verify` - Verify email
- `POST /auth/login` - Login
- `POST /auth/resend-code` - Resend verification code

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Matching
- `GET /api/matches` - Find compatible matches
- `POST /api/matches/request` - Send match request
- `GET /api/matches/requests` - View incoming requests
- `POST /api/matches/{id}/accept` - Accept match
- `POST /api/matches/{id}/reject` - Reject match

### Groups & Chat
- `GET /api/user/group` - Get current group
- `GET /api/groups/{id}` - Group details
- `POST /api/groups/{id}/messages` - Send message
- `GET /api/groups/{id}/messages` - Get messages
- `POST /api/groups/{id}/leave` - Leave group

## Matching Algorithm

Scores users on three dimensions (100 points total):
- **Interest Overlap** (0-30 pts) - Jaccard similarity of selected interests
- **Personality Compatibility** (0-40 pts) - Big Five trait comparison
- **Goal Alignment** (0-30 pts) - Primary goal matching

Minimum 50/100 to appear as a match. Filters by age/gender preferences and distance.

## Deployment

- **Frontend**: Auto-deploys from `main` branch via Netlify
- **Backend**: Auto-deploys from `main` branch via Render
- **Database**: Supabase PostgreSQL (session pooler for IPv4 compatibility)
- **Domain**: thebridgeapp.online (Namecheap → Netlify DNS)

## Project Structure

```
bridge-web-app/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config, DB, security
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── Procfile
└── bridge-app/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── screens/      # Page components
    │   ├── context/      # Auth context
    │   └── services/     # API client
    └── package.json
```

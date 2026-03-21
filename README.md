# Bridge - Connect with Like-Minded People

**Live at [thebridgeapp.online](https://thebridgeapp.online)**

Bridge is a social networking app that matches people based on shared interests, personality compatibility, and goals. Form groups, chat, and build meaningful connections.

## Features

- **Smart Matching** - Compatibility algorithm scoring interests, personality (Big Five), and goals
- **Match Requests** - Send and receive match requests with accept/decline
- **Group Chat** - Real-time messaging with polls, goals, asks, notes, image sharing, and voice notes
- **Collections** - Collaborative group tools: polls with voting, group goals, ask the group, shared notes
- **Calendar & Events** - Group event scheduling with calendar view
- **Group Management** - Editable group names, member profiles, weekly timeline with focus topics
- **Profile Editing** - Full profile management with photo upload, interests, personality, preferences
- **Friends System** - Add and manage friends across groups
- **Responsive Design** - Fully responsive across all screen sizes with safe area support for notched devices
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
- `GET /api/groups/{id}/messages` - Get messages (enriched with poll/goal/note/ask data)
- `POST /api/groups/{id}/leave` - Leave group

### Group Settings
- `PUT /api/group-settings/{id}/name` - Update group name
- `GET /api/group-settings/{id}/timeline` - Get weekly timeline

### Collections
- `POST /api/collections/{id}/polls` - Create poll
- `POST /api/collections/{id}/polls/{poll_id}/vote` - Vote on poll
- `POST /api/collections/{id}/goals` - Create group goal
- `GET /api/collections/{id}/goals` - Get group goals
- `POST /api/collections/{id}/asks` - Create ask the group
- `GET /api/collections/{id}/asks` - Get group asks
- `POST /api/collections/{id}/notes` - Create shared note

### Friends
- `GET /api/friends` - Get friends list

### Events & Calendar
- `GET /api/events/{id}` - Get group events

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
    │   ├── components/   # Reusable UI (BottomNav, SplitLayout, BridgeLogo)
    │   ├── screens/      # Page components (Home, Chat, Profile, Matching, etc.)
    │   ├── context/      # Auth context
    │   ├── services/     # API client (Axios)
    │   └── theme.js      # Centralized design tokens
    └── package.json
```

## Screens

| Screen | Description |
|--------|-------------|
| HomeScreen | Dashboard with profile card, group info, calendar widget, friends list |
| ChatScreen | Group messaging with polls, image sharing, voice notes, plus menu for collections |
| MatchingScreen | Card carousel for browsing matches with compatibility scores |
| ProfileScreen | View/edit profile with photo upload, interests, personality traits |
| GroupInfoScreen | Group overview with member avatars, chat preview, collections, photos, timeline |
| CalendarScreen | Full calendar view with group events |
| CollectionsScreen | Browse group polls, goals, asks, and notes |
| SettingsScreen | Group settings and preferences |

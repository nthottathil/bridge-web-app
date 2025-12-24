# PostgreSQL Setup Guide for Bridge Backend

## Option 1: PostgreSQL (Recommended for Full Development)

### Windows Installation

#### 1. Download and Install

1. Visit https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download PostgreSQL 16 (latest version)
4. Run the installer

**During Installation:**
- ✅ Install all components (Server, pgAdmin 4, Command Line Tools)
- ✅ Set a password for "postgres" user (write this down!)
- ✅ Use port **5432** (default)
- ✅ Use default locale

#### 2. Verify Installation

Open Command Prompt and test:
```bash
psql --version
```

You should see something like: `psql (PostgreSQL) 16.x`

If not found, add to PATH:
- Search "Environment Variables" in Windows
- Edit "Path" under System Variables
- Add: `C:\Program Files\PostgreSQL\16\bin`
- Restart Command Prompt

#### 3. Create the Bridge Database

**Option A: Using Command Line (Recommended)**

Open Command Prompt:
```bash
# Connect to PostgreSQL (will ask for password)
psql -U postgres

# You'll see: postgres=#
# Now create the database:
CREATE DATABASE bridge;

# Verify it was created:
\l

# Exit:
\q
```

**Option B: Using pgAdmin 4 (GUI)**

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Enter your master password when prompted
3. Expand "Servers" → "PostgreSQL 16"
4. Right-click "Databases" → "Create" → "Database"
5. Name: `bridge`
6. Click "Save"

#### 4. Update Your .env File

Edit `backend/.env`:
```env
# Replace 'your_password' with the password you set during installation
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bridge
```

Example:
```env
DATABASE_URL=postgresql://postgres:MySecurePass123@localhost:5432/bridge
```

#### 5. Test the Connection

From the `backend` directory:
```bash
python -c "from app.core.database import engine; print('✅ Connected!' if engine.connect() else '❌ Failed')"
```

---

## Option 2: Supabase (Cloud PostgreSQL - Free Tier)

If you don't want to install PostgreSQL locally, use Supabase's free cloud database:

### 1. Create Supabase Account

1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project:
   - Name: `bridge`
   - Database Password: (set a strong password)
   - Region: Choose closest to you
   - Wait 2-3 minutes for setup

### 2. Get Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password

### 3. Update .env File

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
```

**Advantages of Supabase:**
- ✅ No local installation needed
- ✅ Already in the cloud (ready for deployment)
- ✅ Free tier: 500MB database, good for development
- ✅ Built-in dashboard to view your data

---

## Option 3: SQLite (Quick Testing Only - Not Recommended)

For very quick testing without PostgreSQL:

Edit `backend/.env`:
```env
DATABASE_URL=sqlite:///./bridge.db
```

**⚠️ Limitations:**
- No concurrent writes (can cause issues)
- Missing some PostgreSQL features
- Not suitable for production
- You'll need to migrate to PostgreSQL later anyway

**Only use SQLite if:**
- You just want to test the API quickly
- You plan to set up PostgreSQL/Supabase later

---

## After Database Setup

Once your database is configured:

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Database Migrations

```bash
# Generate initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations to create tables
alembic upgrade head
```

You should see output like:
```
INFO  [alembic.runtime.migration] Running upgrade  -> xxxxx, Initial schema
```

### 3. Verify Tables Were Created

**PostgreSQL:**
```bash
psql -U postgres -d bridge
\dt
```

You should see: `users`, `groups`, `group_members`, `match_requests`, `messages`

**Supabase:**
- Go to Table Editor in Supabase dashboard
- You should see all 5 tables

### 4. Start the Server

```bash
python app/main.py
```

Visit http://localhost:5000/docs to test!

---

## Troubleshooting

### "psql is not recognized as a command"

**Fix:** Add PostgreSQL to PATH
1. Search "Environment Variables" in Windows
2. Edit "Path" under System Variables
3. Add: `C:\Program Files\PostgreSQL\16\bin`
4. Restart terminal

### "password authentication failed for user postgres"

**Fix:** Wrong password in DATABASE_URL
- Double-check the password in your `.env` file
- Make sure it matches what you set during installation

### "could not connect to server: Connection refused"

**Fix:** PostgreSQL service not running
1. Search "Services" in Windows
2. Find "postgresql-x64-16"
3. Right-click → Start
4. Set to "Automatic" startup type

### "pip install fails with cryptography errors"

**Fix:** Install pre-built binaries
```bash
pip install --only-binary :all: cryptography
pip install -r requirements.txt
```

Or use Python 3.11 instead of 3.13

### "FATAL: database 'bridge' does not exist"

**Fix:** Create the database
```bash
psql -U postgres
CREATE DATABASE bridge;
\q
```

---

## What Database Should I Choose?

| Option | Best For | Pros | Cons |
|--------|----------|------|------|
| **PostgreSQL Local** | Full development | Fast, full control, offline work | Requires installation |
| **Supabase** | Quick start, cloud-first | No installation, production-ready | Requires internet |
| **SQLite** | Very quick testing only | Zero setup | Limited features, not production-ready |

**Recommendation:**
- Start with **Supabase** if you want to get running in 5 minutes
- Use **PostgreSQL Local** if you want to develop offline or need full control

---

## Next Steps

Once your database is set up and migrations are run:

✅ Test authentication endpoints at http://localhost:5000/docs
✅ Create a test user with `/auth/signup`
✅ Ready for Week 2: Matching System implementation!

Need help? Check the [QUICKSTART.md](QUICKSTART.md) for testing the API.
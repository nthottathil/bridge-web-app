# Bridge App - Deployment Guide

## 🚀 Deploy to Railway + Vercel (FREE)

### Step 1: Deploy Backend to Railway

1. Go to https://railway.app and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select the `bridge-web-app` repository
4. Railway will detect Python and start deploying

#### Configure Environment Variables:
In the Railway dashboard, go to **Variables** and add:
```
JWT_SECRET=your-super-secret-random-string-change-this
DEBUG=False
APP_NAME=Bridge
```

#### Add PostgreSQL Database:
1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically set `DATABASE_URL` environment variable
3. Your backend will redeploy automatically!

#### Get your Backend URL:
- Railway will provide a URL like: `https://bridge-backend-production.up.railway.app`
- Copy this URL - you'll need it for the frontend!

---

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `bridge-web-app` repository
4. Configure the build settings:
   - **Root Directory**: `bridge-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Add Environment Variable:
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:
```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
```
(Replace with your actual Railway backend URL from Step 1)

5. Click **"Deploy"**!

---

### Step 3: Update Backend CORS

After deploying, you need to update the backend to allow requests from your Vercel frontend.

In `backend/app/main.py`, update the CORS middleware:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-vercel-app.vercel.app",  # Add your Vercel URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push this change to GitHub, and Railway will auto-redeploy!

---

### 🎉 Done!

Your app is now live! Share the Vercel URL with anyone:
- **App URL**: `https://your-bridge-app.vercel.app`

Anyone can now sign up and use your Bridge app!

---

## Troubleshooting

### Backend Issues:
- Check Railway logs: Dashboard → Deployments → View logs
- Make sure PostgreSQL database is connected
- Verify environment variables are set

### Frontend Issues:
- Check Vercel logs: Dashboard → Deployments → View Function Logs  
- Make sure `REACT_APP_API_URL` points to your Railway backend
- Check browser console for CORS errors

### Database Migration:
If you need to reset the database:
```bash
# In Railway dashboard, go to PostgreSQL database
# Click "Data" → "Query" and run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then redeploy the backend - tables will be recreated automatically.

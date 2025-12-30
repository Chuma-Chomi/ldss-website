# LDSS Website Deployment Guide

## Free Hosting Platforms

### Frontend Deployment - Netlify (Free)
### Backend Deployment - Render (Free)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend
1. Your backend is already configured in `backend/` folder
2. Make sure you have a `package.json` with start script

### Step 2: Deploy to Render
1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub account (you'll need to push your code to GitHub first)
4. Or use "Deploy from Git URL" if you have a repo
5. Configure:
   - **Name**: ldss-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables (if any from .env.example)
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL (e.g., https://ldss-backend.onrender.com)

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Update API URL
Before deploying, update the frontend to use your deployed backend URL.

Edit `frontend/src/config.ts` or wherever API URL is configured.

### Step 2: Build Frontend Locally (Optional Test)
```bash
cd frontend
npm run build
```

### Step 3: Deploy to Netlify

**Option A: Using Netlify CLI (Already Installed)**
```bash
cd frontend
netlify login
netlify init
netlify deploy --prod
```

**Option B: Using Netlify Web Interface**
1. Go to https://netlify.com and sign up (free)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `frontend/dist` folder (after running `npm run build`)
4. Your site will be live at: https://[random-name].netlify.app

**Option C: Connect to GitHub (Best for continuous deployment)**
1. Push your code to GitHub
2. Go to Netlify → "Add new site" → "Import from Git"
3. Select your repository
4. Configure:
   - **Base directory**: frontend
   - **Build command**: npm run build
   - **Publish directory**: frontend/dist
5. Click "Deploy site"

---

## Part 3: Alternative - Vercel (Frontend Only)

If you prefer Vercel for frontend:
1. Go to https://vercel.com
2. Sign up (free)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist
6. Deploy

---

## Part 4: Update Environment Variables

### Frontend Environment Variables
Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend Environment Variables
On Render dashboard, add:
- Any database URLs
- JWT secrets
- Other sensitive data from `.env.example`

---

## Quick Deploy Commands

### Deploy Frontend to Netlify (CLI)
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Test Locally Before Deploy
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm run build
npm run preview
```

---

## Important Notes

1. **Free Tier Limitations**:
   - Render: Backend sleeps after 15 min of inactivity (takes 30s to wake up)
   - Netlify: 100GB bandwidth/month, 300 build minutes/month
   
2. **CORS**: Make sure backend allows your Netlify domain in CORS settings

3. **Database**: If using a database, consider:
   - MongoDB Atlas (Free tier)
   - Supabase (Free tier)
   - Railway (Free tier with limitations)

4. **Custom Domain**: Both Netlify and Render allow free custom domains

---

## Troubleshooting

### Build Fails
- Check Node version compatibility
- Ensure all dependencies are in package.json
- Check build logs for specific errors

### API Not Working
- Verify backend URL in frontend config
- Check CORS settings in backend
- Verify environment variables are set

### Site Not Loading
- Check build output directory is correct
- Verify redirects in netlify.toml
- Check browser console for errors

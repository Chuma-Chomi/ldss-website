# Backend Deployment Guide - LDSS Website

## 🚀 Deploy Backend to Render (Free Tier)

### Prerequisites
✅ Git installed
✅ GitHub account
✅ Render account (free)

---

## Step 1: Initialize Git and Push to GitHub

### 1.1 Initialize Git Repository
```bash
cd C:\Users\dell 3190\Desktop\LDSS_website
git init
git add .
git commit -m "Initial commit - LDSS Website"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `ldss-website`
3. Description: `Lukulu Day Secondary School Website`
4. Keep it **Public** (required for free Render deployment)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ldss-website.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Database (PostgreSQL)

### Option A: Render PostgreSQL (Recommended - Free)
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: ldss-database
   - **Database**: ldss_db
   - **User**: ldss_user
   - **Region**: Oregon (US West)
   - **Plan**: Free
4. Click "Create Database"
5. Wait 2-3 minutes for creation
6. **Copy the External Database URL** (starts with `postgresql://`)

### Option B: Supabase (Alternative - Free)
1. Go to https://supabase.com
2. Create new project
3. Copy the PostgreSQL connection string

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Click "Connect GitHub" and authorize Render
4. Select your `ldss-website` repository

### 3.2 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `ldss-backend`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: 
  ```
  npm install && npm run build && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Advanced Settings:**
- **Plan**: Free
- **Auto-Deploy**: Yes

### 3.3 Add Environment Variables
Click "Environment" tab and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `DATABASE_URL` | `[Your PostgreSQL URL from Step 2]` |
| `JWT_SECRET` | `[Generate a random string]` |

**To generate JWT_SECRET:**
- Use: https://randomkeygen.com/
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see: ✅ "Live"

### 3.5 Copy Backend URL
Your backend URL will be: `https://ldss-backend.onrender.com`

---

## Step 4: Seed Database (Optional)

After deployment, run the seed script:

1. Go to Render Dashboard → Your Service
2. Click "Shell" tab
3. Run:
```bash
npm run prisma:seed
```

This will create default admin, staff, and learner accounts.

---

## Step 5: Update Frontend with Backend URL

### 5.1 Update API Configuration
Create `frontend/.env.production`:
```
VITE_API_URL=https://ldss-backend.onrender.com
```

### 5.2 Rebuild and Redeploy Frontend
```bash
cd frontend
npm run build
```

Then redeploy to Netlify (drag & drop the new `dist` folder).

---

## Step 6: Test Your Deployment

### 6.1 Test Backend
Visit: `https://ldss-backend.onrender.com/api/health`

Should return: `{"status":"ok"}`

### 6.2 Test Frontend
Visit your Netlify URL and try logging in with:
- **Admin**: `202501` / `LDSSadmin123`
- **Staff**: `2025001` / `LDSSstaff123`
- **Learner**: `202500123456` / `LDSS2025`

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles: `npm run build` locally

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is running on Render
- Ensure Prisma migrations ran: Check logs for "prisma migrate deploy"

### CORS Errors
- Backend should allow your Netlify domain
- Check `backend/src/index.ts` CORS configuration
- Add your Netlify URL to allowed origins

### Backend Sleeps (Free Tier)
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid tier for production

---

## 📝 Important Notes

### Free Tier Limitations
- **Render Free**: 
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - 512 MB RAM
  - Shared CPU
- **PostgreSQL Free**: 
  - 1 GB storage
  - Expires after 90 days (need to recreate)

### Database Backup
Free PostgreSQL expires after 90 days. Before expiry:
1. Export data: `pg_dump DATABASE_URL > backup.sql`
2. Create new database
3. Import: `psql NEW_DATABASE_URL < backup.sql`

### Custom Domain
Both Render and Netlify support custom domains on free tier.

---

## ✅ Deployment Checklist

- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] Database seeded with initial data
- [ ] Frontend updated with backend URL
- [ ] Frontend redeployed to Netlify
- [ ] Login tested and working
- [ ] All features tested

---

## 🎉 Success!

Your LDSS website is now fully deployed:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://ldss-backend.onrender.com
- **Database**: PostgreSQL on Render

Both are on free tiers and will work great for a school website!

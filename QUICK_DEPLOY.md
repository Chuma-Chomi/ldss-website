# Quick Deployment Guide - LDSS Website

## ✅ Frontend Build Complete!
Your frontend is built and ready in the `frontend/dist` folder.

---

## 🚀 Option 1: Deploy to Netlify (Drag & Drop - Easiest)

### Steps:
1. Go to: https://app.netlify.com/drop
2. Drag and drop the entire `frontend/dist` folder onto the page
3. Your site will be live in seconds!
4. You'll get a URL like: `https://random-name-123.netlify.app`
5. You can change the site name in Netlify settings

**That's it! No CLI needed.**

---

## 🚀 Option 2: Deploy to Vercel (Also Easy)

### Steps:
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `cd frontend`
3. Run: `vercel --prod`
4. Follow the prompts (press Enter for defaults)
5. Your site will be live!

---

## 🚀 Option 3: Deploy to GitHub Pages (Free)

### Steps:
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch and `/frontend/dist` folder
4. Save and your site will be live at: `https://yourusername.github.io/repo-name`

---

## 📦 Backend Deployment (Render - Free)

### Steps:
1. Go to: https://render.com
2. Sign up for free
3. Click "New +" → "Web Service"
4. Connect your GitHub repo (you'll need to push code first)
5. Configure:
   - **Name**: ldss-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add environment variables from `.env.example`
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy your backend URL: `https://ldss-backend.onrender.com`

---

## 🔗 Connect Frontend to Backend

After backend is deployed, update frontend:

1. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Rebuild frontend: `npm run build`
3. Redeploy frontend with new build

---

## 📝 Current Status

✅ Frontend built successfully
✅ Build files ready in `frontend/dist`
⏳ Ready to deploy to Netlify/Vercel
⏳ Backend needs deployment to Render

---

## 🎯 Recommended: Netlify Drag & Drop

**Fastest way to get your site live:**
1. Open: https://app.netlify.com/drop
2. Drag `frontend/dist` folder
3. Done! 🎉

Your site will work immediately (without backend features like login).
Deploy backend separately to enable full functionality.

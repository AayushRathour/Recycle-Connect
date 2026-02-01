# 🚀 Deployment Guide - RecycleConnect

## Quick Start: Deploy to Railway (Recommended)

### Prerequisites
- GitHub account
- Railway account (sign up at railway.app)
- Your project pushed to GitHub

---

## Step-by-Step Deployment

### 1️⃣ Push Your Code to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub (go to github.com)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository** (Buyer-Seller-AI)
6. **Railway will auto-detect** Node.js and start deploying

### 3️⃣ Configure Environment Variables

In Railway dashboard:
1. Click on your project
2. Go to **"Variables"** tab
3. Add these variables:

```
NODE_ENV=production
SESSION_SECRET=your-super-secret-random-string-here-min-32-chars
AI_INTEGRATIONS_GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

**To generate SESSION_SECRET:**
```powershell
# Run this in PowerShell:
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 4️⃣ Configure Persistent Storage (Important!)

For SQLite database and uploads folder:

1. In Railway dashboard, click **"Settings"**
2. Scroll to **"Volumes"**
3. Click **"Add Volume"**
4. Mount path: `/app/uploads`
5. Click **"Add Volume"** again
6. Mount path: `/app/data` (for SQLite database)

### 5️⃣ Generate Your Live URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://your-app-name.up.railway.app`

### 6️⃣ Test Your Deployment

1. Visit your generated URL
2. Try registering a user
3. Test creating a listing
4. Verify image uploads work

---

## Alternative: Deploy to Render.com

### Step 1: Create Render Account
Go to https://render.com and sign up

### Step 2: New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: buyer-seller-ai
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
Same as Railway (NODE_ENV, SESSION_SECRET, AI_INTEGRATIONS_GEMINI_API_KEY)

### Step 4: Add Persistent Disk
1. Scroll to **"Disks"**
2. Click **"Add Disk"**
3. Name: `uploads`
4. Mount Path: `/app/uploads`
5. Size: 1GB (free)

### Step 5: Deploy
Click **"Create Web Service"** - Render will provide a URL

---

## Alternative: Deploy to Replit

### Step 1: Import Project
1. Go to https://replit.com
2. Click **"Create Repl"**
3. Choose **"Import from GitHub"**
4. Paste your repo URL

### Step 2: Configure
Replit will auto-detect the project

### Step 3: Add Secrets
In "Secrets" tab (🔒 icon), add:
- `SESSION_SECRET`
- `AI_INTEGRATIONS_GEMINI_API_KEY`

### Step 4: Run
Click **"Run"** button - Replit will provide a URL

---

## Post-Deployment Checklist

✅ **Test Registration** - Create buyer and seller accounts
✅ **Test Listings** - Create a listing with image upload
✅ **Test Search** - Use filters and search
✅ **Test Purchase Flow** - Send and accept purchase requests
✅ **Test Maps** - Check routing and directions
✅ **Test Forgot Password** - Verify email functionality (may need SMTP setup)
✅ **Test Performance Page** - View metrics

---

## Troubleshooting

### Issue: "Cannot GET /"
**Solution**: Ensure `NODE_ENV=production` is set in environment variables

### Issue: Images not showing
**Solution**: Check persistent storage is mounted at `/app/uploads`

### Issue: Database resets on restart
**Solution**: Add persistent volume for `/app/data` or `/app`

### Issue: Port error
**Solution**: Ensure your hosting platform sets PORT automatically (Railway/Render do this)

---

## Free Hosting Comparison

| Platform | Free Tier | SQLite Support | File Storage | Pros |
|----------|-----------|----------------|--------------|------|
| **Railway** | $5/mo credit | ✅ Yes | ✅ Yes | Best for this project, easy setup |
| **Render** | 750 hrs/mo | ✅ Yes | ✅ Yes (1GB) | Good free tier, slower cold starts |
| **Replit** | Limited | ✅ Yes | ✅ Yes | Easiest, built-in IDE |
| **Vercel** | Unlimited | ❌ No (needs external DB) | ❌ No | Good for frontend only |

---

## Recommended: Railway

**Why?**
- ✅ Persistent SQLite database
- ✅ File upload storage
- ✅ Fast deployment
- ✅ Custom domain support
- ✅ Automatic HTTPS
- ✅ Easy environment variables

**Your live URL will be**: `https://buyer-seller-ai-production.up.railway.app`
(or similar - Railway auto-generates)

---

## Need Help?

1. **Railway Docs**: https://docs.railway.app
2. **Render Docs**: https://render.com/docs
3. **Check deployment logs** in your platform's dashboard
4. **Ensure all environment variables** are set correctly

---

## 🎉 Once Deployed

Share your live URL:
```
https://your-app-name.up.railway.app
```

Users can:
- Register as buyer or seller
- Create listings
- Browse with search/filters
- Send purchase requests
- View maps and routes
- Track performance metrics

**All features will work exactly like in development!**

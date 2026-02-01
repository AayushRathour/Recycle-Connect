# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment!

## Pre-Deployment

- [ ] All features tested locally
- [ ] Database working (SQLite)
- [ ] Image uploads working
- [ ] Environment variables documented
- [ ] .gitignore includes sensitive files
- [ ] README.md updated

## GitHub Setup

- [ ] Created GitHub account
- [ ] Created new repository on GitHub
- [ ] Repository is public (or private with Railway access)
- [ ] Local code pushed to GitHub
  ```bash
  git init
  git add .
  git commit -m "Ready for deployment"
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```

## Railway Deployment

- [ ] Created Railway account (railway.app)
- [ ] Connected GitHub account to Railway
- [ ] Created new project from GitHub repo
- [ ] Waited for initial build (check logs)
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `SESSION_SECRET=<generated-secret>`
  - [ ] `AI_INTEGRATIONS_GEMINI_API_KEY=<your-key>`
- [ ] Added persistent volumes:
  - [ ] `/app/uploads` for image storage
  - [ ] `/app/data` for SQLite database
- [ ] Generated custom domain
- [ ] Copied live URL

## Post-Deployment Testing

- [ ] Visit live URL successfully
- [ ] Register new buyer account
- [ ] Register new seller account
- [ ] Seller: Create a listing with image
- [ ] Buyer: Browse listings
- [ ] Buyer: Use search and filters
- [ ] Buyer: View listing detail page
- [ ] Check map displays correctly
- [ ] Check seller phone number visible
- [ ] Click "Get Directions" - route displays
- [ ] Buyer: Send purchase request
- [ ] Seller: View purchase request in dashboard
- [ ] Seller: Accept purchase request
- [ ] Buyer: Check accepted request in dashboard
- [ ] Visit Profile page - stats display
- [ ] Visit Performance/Metrics page - data displays
- [ ] Test AI Scan feature (if buyer)
- [ ] Test forgot password flow

## Share Your App

- [ ] Copy your live URL: `https://your-app.up.railway.app`
- [ ] Test in incognito/private browser
- [ ] Share with others
- [ ] Collect feedback

## Troubleshooting

If something doesn't work:

1. **Check Railway Logs**:
   - Go to your project in Railway
   - Click "Deployments"
   - View build and runtime logs

2. **Common Issues**:
   - Images not loading? → Check `/app/uploads` volume
   - Database resets? → Check `/app/data` volume
   - 500 errors? → Check environment variables
   - Can't load page? → Check `NODE_ENV=production` is set

3. **Restart Deployment**:
   - In Railway, click "⋯" menu
   - Select "Restart"

## Environment Variables Reference

```env
NODE_ENV=production
SESSION_SECRET=<your-32-char-secret>
AI_INTEGRATIONS_GEMINI_API_KEY=<your-gemini-key>
```

**Generate SESSION_SECRET** (run in PowerShell):
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## Success! 🎉

When everything works:
- ✅ Live URL accessible
- ✅ Users can register
- ✅ Listings can be created
- ✅ Images upload successfully
- ✅ Maps and routing work
- ✅ Purchase flow works end-to-end
- ✅ All pages load correctly

**Your app is now live and ready to share!**

---

## Alternative Platforms

If Railway doesn't work, try:

### Render.com
- Same process as Railway
- Free tier available
- Supports persistent disks
- URL: `https://your-app.onrender.com`

### Replit.com
- Import from GitHub
- Click "Run"
- Add secrets in Secrets tab
- URL: `https://your-repl.replit.app`

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions!

# StageDeck - Vercel Deployment Guide

## Prerequisites

- Your code is pushed to GitHub ✅
- A [Vercel](https://vercel.com) account
- MongoDB database (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Step 1: Create New Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **StageDeck** repository

---

## Step 2: Configure Project Settings

| Setting | Value |
|---------|-------|
| **Project Name** | `stagedeck` (or your choice) |
| **Framework Preset** | `Other` |
| **Root Directory** | Leave **empty** (clear any value) |

> [!IMPORTANT]
> The Root Directory must be empty (not `backend`). Click Edit and clear it.

---

## Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

### Required Variables

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | `your-secret-key-here` | Random string for JWT signing (32+ chars) |
| `JWT_REFRESH_SECRET` | `another-secret-key` | Random string for refresh tokens |
| `NODE_ENV` | `production` | Environment mode |

### Frontend Variables (prefix with VITE_)

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | Leave empty or set to your domain after deploy |

### Optional Variables

| Key | Description |
|-----|-------------|
| `GEMINI_API_KEY` | For AI chat feature |
| `SMTP_HOST` | Email server host |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |
| `FROM_EMAIL` | Sender email address |

---

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

---

## Step 5: Verify Deployment

### Check API Health
Visit: `https://your-project.vercel.app/api/health`

Expected response:
```json
{"success": true, "message": "StageDeck API is running"}
```

### Check Frontend
Visit your main URL and try:
- Navigate between pages
- **Refresh the page** (should work now!)
- Register/Login

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure Root Directory is **empty**
- Ensure Framework Preset is **Other**

### API Returns 500 Errors
- Check Environment Variables are set correctly
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0`)

### CORS Errors
- The backend already allows your Vercel domain
- Check browser console for specific origin issues

### Page Refresh Shows Error
- This should be fixed with the current `vercel.json`
- If not, check the rewrites configuration

---

## Your Vercel.json (Already Configured)

```json
{
    "version": 2,
    "framework": null,
    "installCommand": "npm install --prefix frontend && npm install --prefix backend",
    "buildCommand": "npm run build --prefix frontend",
    "outputDirectory": "frontend/dist",
    "functions": {
        "api/**/*.js": {
            "runtime": "@vercel/node@3",
            "includeFiles": "backend/**"
        }
    },
    "rewrites": [
        { "source": "/api/:path*", "destination": "/api/index.js" },
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

---

## Quick Checklist

- [ ] GitHub repo connected
- [ ] Root Directory is **empty**
- [ ] Framework Preset is **Other**
- [ ] `MONGO_URI` is set
- [ ] `JWT_SECRET` is set
- [ ] Deploy clicked
- [ ] Site loads correctly
- [ ] Page refresh works
- [ ] API health check passes

# StageDeck - Render Deployment Guide

This guide explains how to deploy StageDeck to Render.

## Prerequisites

- A [Render](https://render.com) account
- Your code pushed to a GitHub repository
- MongoDB database (e.g., MongoDB Atlas)

## Option 1: Blueprint Deployment (Recommended)

The `render.yaml` file in this repository defines both the backend and frontend services.

### Steps:

1. **Go to Render Dashboard**
   - Navigate to [dashboard.render.com](https://dashboard.render.com)
   - Click **New** → **Blueprint**

2. **Connect Repository**
   - Connect your GitHub account if not already connected
   - Select the `StageDeck` repository

3. **Configure Environment Variables**
   
   Render will detect the `render.yaml` and show you the services. You need to set these environment variables:

   **Backend (stagedeck-api):**
   | Variable | Description |
   |----------|-------------|
   | `MONGO_URI` | MongoDB connection string |
   | `JWT_SECRET` | Secret for JWT tokens (generate a random string) |
   | `JWT_REFRESH_SECRET` | Secret for refresh tokens |
   | `CORS_ORIGIN` | Frontend URL (set after frontend deploys) |
   | `GEMINI_API_KEY` | Google Gemini API key |
   | `SMTP_HOST` | Email SMTP host |
   | `SMTP_PORT` | Email SMTP port |
   | `SMTP_USER` | Email SMTP username |
   | `SMTP_PASS` | Email SMTP password |
   | `FROM_EMAIL` | Sender email address |

   **Frontend (stagedeck-frontend):**
   | Variable | Description |
   |----------|-------------|
   | `VITE_API_BASE_URL` | Backend URL (e.g., `https://stagedeck-api.onrender.com`) |

4. **Deploy**
   - Click **Apply** to deploy both services
   - Wait for the build to complete

5. **Update CORS Origin**
   - After the frontend deploys, copy its URL
   - Go to backend service → Environment → Add `CORS_ORIGIN` with the frontend URL
   - The service will automatically redeploy

## Option 2: Manual Deployment

### Deploy Backend

1. **Create Web Service**
   - Go to Render Dashboard → **New** → **Web Service**
   - Connect your GitHub repo
   - Configure:
     - **Name:** `stagedeck-api`
     - **Root Directory:** `backend`
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

2. **Add Environment Variables**
   - Add all the backend variables listed above

### Deploy Frontend

1. **Create Static Site**
   - Go to Render Dashboard → **New** → **Static Site**
   - Connect your GitHub repo
   - Configure:
     - **Name:** `stagedeck-frontend`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`

2. **Add Rewrite Rule**
   - Go to **Redirects/Rewrites**
   - Add a rule:
     - Source: `/*`
     - Destination: `/index.html`
     - Action: Rewrite

3. **Add Environment Variables**
   - Add `VITE_API_BASE_URL` with your backend URL

## Verifying Deployment

1. **Check Backend Health**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```
   
   Expected response:
   ```json
   {"success": true, "message": "StageDeck API is running", "timestamp": "..."}
   ```

2. **Test Frontend**
   - Open your frontend URL in a browser
   - Try registering a new account
   - Check browser console for any errors

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGIN` in backend matches your frontend URL exactly
- Check there are no trailing slashes

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)

### Build Failures
- Check Render build logs for specific errors
- Verify all dependencies are in `package.json`

### Cold Start Delays
- Free tier services spin down after inactivity
- First request after spin-down may take 30-60 seconds

## Notes

- Free tier services have limited resources and spin down after 15 minutes of inactivity
- For production, consider upgrading to a paid plan
- Render automatically provides HTTPS for all services

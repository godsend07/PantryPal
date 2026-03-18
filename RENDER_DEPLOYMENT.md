# Render Deployment Guide

This project is ready to deploy on Render as a single Node web service.

## What You Need
- A Render account
- A GitHub repository containing this project
- A MongoDB Atlas connection string

## 1. Push Project To GitHub
If this folder is not yet in GitHub, use:

```bash
git init
git add .
git commit -m "Initial PantryPal deployment-ready build"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Important:
- Do not push `.env`
- Confirm `.gitignore` is present before pushing

## 2. Create MongoDB Atlas Database
Create a cluster and copy the connection string.

Use a connection string like:
```env
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/pantrypal?retryWrites=true&w=majority&appName=PantryPal
```

Important:
- Add your Render outbound IP access rule or allow `0.0.0.0/0` temporarily for setup.
- Replace username, password, and cluster details.

## 3. Create Render Web Service
In Render:
- New +
- Web Service
- Connect your GitHub repo

Render will detect `render.yaml` automatically.

If you configure manually, use:
- Name: `pantrypal`
- Runtime: Node
- Branch: `main`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Root Directory: leave blank
- Auto-Deploy: Yes
- Plan: Free (or higher if needed)

## 4. Set Environment Variable
In Render service settings, add:
- `MONGODB_URI` = your MongoDB Atlas URI
- `NODE_ENV` = `production`

You do not need to manually set `PORT` on Render.

## 5. Deploy
Trigger deploy and wait for the service to finish.

Expected first successful deploy signs:
- Build completes without missing dependency errors
- Health check returns `200`
- Render shows service as `Live`

Expected health endpoint:
- `/api/health`

Expected app root:
- `/`

## 6. Post-Deploy Verification
Check these flows:
- Homepage loads
- Signup and login work
- Pantry add/list works
- Leftovers add/list works
- Waste log works
- Recipe search works
- KPI summary endpoint works

Useful public checks after deploy:
- `https://<your-render-service>.onrender.com/`
- `https://<your-render-service>.onrender.com/api/health`

## 7. Recommended Viva Talking Point
"I deployed PantryPal on Render with MongoDB Atlas because it reduced infrastructure overhead while still giving me a public, production-style deployment suitable for testing and demonstration."

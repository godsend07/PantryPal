# PantryPal

Ingredient-first recipe recommendation platform focused on reducing household food waste.

## Core Features
- User auth with session tokens
- Ingredient-based recipe search (TheMealDB integration)
- Waste-aware ranking (expiry and leftovers rescue modes)
- Favorites and shopping list
- Pantry management with soon-expiring alerts
- Leftovers tracking
- Waste logging and impact metrics

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Vanilla JS frontend

## Prerequisites
- Node.js 18+
- MongoDB running locally (or cloud URI)

## Environment
Create `.env` from `.env.example`.

Required values:
- `MONGODB_URI`
- `PORT`

Example:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/pantrypal
PORT=3000
```

## Run
```bash
npm start
```

App URL:
- `http://localhost:3000`

## Test
```bash
npm test
```

Current suite:
- API validation tests for auth, pantry, leftovers, and waste-log write paths
- Uses isolated MongoDB test database (`pantrypal_test_<timestamp>`)

## Smoke Test
Run a quick end-to-end API verification (health, auth, pantry, leftovers, waste logs, metrics):

```bash
npm run smoke
```

## Deploy On Render
This project is configured for Render using [render.yaml](render.yaml).

Deployment stack:
- Render Web Service
- MongoDB Atlas

Minimum steps:
1. Push this project to GitHub.
2. Create a MongoDB Atlas cluster.
3. Create a new Render Web Service from the GitHub repo.
4. Set `MONGODB_URI` in Render environment variables.
5. Deploy.

Suggested GitHub push flow:
```bash
git init
git add .
git commit -m "Initial PantryPal deployment-ready build"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Health check path:
- `GET /api/health`

Detailed guide:
- See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

## API Health Check
- `GET /api/health`

## KPI Analytics Endpoint
- `GET /api/user/metrics/kpi-summary?days=30`
- Requires auth token
- Returns dissertation-ready KPI summary structure:
	- `totals`: search and recommendation counts
	- `kpis`: zero-missing %, missing averages, rescue/expiry usage rates
	- `series`: day-level metrics for charting/export

## Notes
- Canonical pantry API namespace: `/api/user/pantry`
- API now includes centralized 404 handling for unknown `/api/*` routes.

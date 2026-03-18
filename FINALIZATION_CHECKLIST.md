# PantryPal Finalization Checklist (March 2026)

This checklist is ordered by impact first, then effort.

## Status Snapshot
- Completed: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3
- Completed: 3.1 (KPI analytics capture)
- Next high-impact: 3.2 (repeatable evaluation protocol)

## 1) Critical (Do First)

### 1.1 Consolidate duplicate pantry API routes
- Why: You currently maintain both `/api/user/pantry` and `/api/pantry` route families. This increases bug risk and code drift.
- Current references:
  - `server.js` defines `/api/user/pantry` family around lines 499-626.
  - `server.js` defines `/api/pantry` fallback family around lines 629-725.
  - `public/app.js` uses fallback logic in `fetchPantryJson` around lines 551-563.
- Actions:
  - Keep one canonical pantry route family (recommended: `/api/user/pantry`).
  - Remove duplicate route family from backend.
  - Remove fallback logic in frontend and call canonical path only.
- Done when:
  - All pantry add/list/delete/soon-expiring features still work.
  - No fallback code remains.
- Status: Completed.

### 1.2 Add centralized API error handling middleware
- Why: Current try/catch style works, but a global error handler improves reliability, consistency, and dissertation code quality.
- Actions:
  - Add Express error middleware for consistent JSON errors.
  - Ensure thrown async errors map to safe messages.
- Done when:
  - API errors are returned in a consistent shape.
  - No unhandled rejection / crash on expected runtime failures.
- Status: Completed.

### 1.3 Introduce request validation for key write endpoints
- Why: Prevents invalid data reaching MongoDB and improves robustness for viva/demo questions.
- Priority endpoints:
  - Auth signup/login
  - Pantry create/update
  - Leftovers create/update
  - Waste log create
- Done when:
  - Invalid payloads return 400 with clear messages.
  - Happy-path requests still pass.
- Status: Completed.

## 2) High Value (Next)

### 2.1 Add a minimal automated test suite
- Why: Your codebase is feature-rich; tests are the biggest credibility gain now.
- Current state: `package.json` still has placeholder test script.
- Suggested first tests:
  - Auth signup -> login -> me flow
  - Recipe search with ingredient input
  - Pantry CRUD basic checks
  - Waste metrics endpoint returns shape
- Done when:
  - `npm test` runs real tests.
  - At least 8-12 core API tests exist.
- Status: Completed (`npm test` now runs 10 passing API validation tests).

### 2.2 Add API smoke test collection
- Why: Fast manual verification before demo.
- Actions:
  - Create a Postman collection or curl script for top 10 routes.
  - Include auth token flow and pantry/leftover/waste metrics flow.
- Done when:
  - You can verify full backend health in under 5 minutes.
- Status: Completed (`npm run smoke` now verifies core API flows).

### 2.3 Stabilize environment and startup docs
- Why: Prevent "works on my machine" during marker/demo run.
- Actions:
  - Ensure `.env.example` includes every required variable.
  - Add quick start steps in README (install, env, run).
  - Mention MongoDB requirement explicitly.
- Done when:
  - A new machine can run project using docs only.
- Status: Completed (README + `.env.example` aligned).

## 3) Dissertation Evidence Tasks

### 3.1 Add real metric capture for proposal KPIs
- Why: You already describe targets; now make evidence exportable.
- KPI examples:
  - Percentage of recipes with 0 missing ingredients
  - Average missing ingredient count per query
  - Rescue-mode usage frequency
- Actions:
  - Add lightweight query analytics storage (can be minimal).
  - Add endpoint/export for summary statistics.
- Done when:
  - You can show numeric before/after or trend charts in dissertation.
- Status: Completed (`/api/recipes` now logs KPI analytics and `/api/user/metrics/kpi-summary` provides export-ready summary + series output).

### 3.2 Add a repeatable evaluation protocol
- Why: Strong methodology section and stronger viva defense.
- Actions:
  - Define 3-5 user scenarios (budget user, busy parent, etc.).
  - Measure completion time, missing ingredients, chosen recipe quality.
- Done when:
  - You can reproduce results and show table/graph outputs.

## 4) Nice-to-Have Polish

### 4.1 Break up large frontend file
- Why: `public/app.js` is large and harder to maintain.
- Actions:
  - Split into modules: auth, recipes, pantry, leftovers, waste, UI helpers.
- Done when:
  - Main file shrinks significantly and feature ownership is clearer.

### 4.2 Security hardening pass
- Add basic rate limit for auth/search routes.
- Add stricter CORS/origin policy if deploying publicly.
- Ensure no sensitive debug output leaks in production.

### 4.3 Deployment readiness
- Add production start command and hosting notes.
- Verify Node version compatibility in docs.

## 5) Suggested 7-Day Finish Plan

### Day 1
- Consolidate pantry routes and remove frontend fallback.
- Add centralized error middleware.

### Day 2
- Add request validation to auth + pantry.

### Day 3
- Add request validation to leftovers + waste logs.

### Day 4
- Set up Jest/Supertest (or equivalent) and write first 5 API tests.

### Day 5
- Expand tests to 8-12 core API paths.
- Build smoke-test script/collection.

### Day 6
- Add KPI capture + summary endpoint for dissertation evidence.

### Day 7
- Full demo rehearsal, documentation cleanup, final bug fixes.

## 6) Final Pre-Submission Gate
- App starts cleanly with MongoDB connected.
- Auth, recipes, pantry, leftovers, waste logs, impact metrics all verified.
- No duplicate APIs for same feature.
- `npm test` passes.
- README and env docs are complete.
- Dissertation includes measurable KPI evidence from system data.

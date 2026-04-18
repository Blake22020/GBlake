# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Backend (root):**
```bash
npm run dev       # Start backend with hot reload (logs to backend-dev.log)
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled backend
npm run clear-db  # Clear MongoDB (debugging)
```

**Frontend (`frontend/`):**
```bash
npm start         # Start React dev server on :3000 (proxies API to backend)
npm run build     # Build production bundle into frontend/build/
npm test          # Run tests
```

**Production:** build frontend first (`frontend/npm run build`), then build and start backend — the Express server serves the React static files.

## Environment

Backend requires a `.env` file:
```
MONGO_URL=mongodb://127.0.0.1:27017/gblake
JWT_SECRET=<secret>
PORT=3000
CREATOR=<email>   # This email gets role 3 (highest privilege) on signup
```

Frontend uses `REACT_APP_API_URL` (defaults to `http://localhost:3000` in dev).

## Architecture

Full-stack social media platform. The Express backend runs on port 3000, serves the compiled React app in production, and exposes a REST API at `/api/*`. In development, the React dev server on port 3000 proxies API requests to the backend.

**Auth flow:** JWT tokens stored in localStorage, sent as `Authorization: Bearer <token>`. Two middleware variants: `auth` (required) and `optionalAuth` (allows unauthenticated requests, used on the public feed).

**User roles:** -1 banned, 0 user, 1 moderator, 2 admin, 3 creator. The `CREATOR` env email auto-gets role 3. Role promotion via `POST /api/admin/promote/:id`.

**Registration is two-step:** `POST /api/register1` (email/password/username) → `PATCH /api/register2` (display name, bio, completes profile).

**Feed algorithm** in `src/routes/feedRoutes.ts` is personalized when authenticated — weights posts by recency and engagement from followed users.

**File uploads** (avatars) use Multer, saved to `/uploads` directory, served as static files.

## Key file locations

| Concern | Path |
|---|---|
| Express app setup | `src/server.ts` |
| Mongoose models | `src/models/User.ts`, `src/models/Post.ts` |
| All API functions (frontend) | `frontend/src/services/api.ts` |
| Global loading state | `frontend/src/context/LoadingContext.tsx` |
| Route definitions (frontend) | `frontend/src/App.tsx` |
| Auth middleware | `src/middleware/auth.ts` |
| Admin middleware | `src/middleware/isAdmin.ts` |

## Frontend conventions

- Axios instance in `services/api.ts` attaches the JWT token and manages global loading state via interceptors — all API calls go through functions defined there, not raw axios calls.
- Skeleton components (`*Skeleton.tsx`) are used for loading states; new list/page components should follow the same pattern.
- Infinite scroll pagination is implemented across feed, user profile, search, and post listing pages — new paginated lists should follow the same pattern.
- Post component is memoized; avoid breaking that optimization when editing it.

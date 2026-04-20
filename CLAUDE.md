# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

«ДИАМАНД» — a jewelry store web app (Lab 3). React frontend + Node.js/Express backend + PostgreSQL database.

## Development Commands

### Frontend (root directory)
```bash
npm run dev       # Start Vite dev server (port 5173, proxies /api → localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

### Backend (`server/` directory)
```bash
cd server
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start without auto-reload
npm run init-db   # Initialize DB schema (server/schema.sql)
npm run create-admin  # Create admin user via server/create-admin.js
```

Both servers must run simultaneously during development. The Vite proxy handles CORS — the frontend always uses `/api/...` paths.

## Architecture

### Two separate Node projects
- **Root** (`package.json`, ESM): React + Vite frontend
- **`server/`** (`server/package.json`, CommonJS): Express API

### Frontend (`src/`)
- `App.jsx` — routing with `react-router-dom`; all pages wrapped in `<AuthProvider>` + `<Layout>`
- `context/AuthContext.jsx` — global auth state; exposes `user`, `loading`, `login()`, `logout()`, `register()`; hydrates from `GET /api/auth/me` on mount
- `components/Layout/` — wraps every page with Header + Sidebar + Footer
- `components/Messages/` — floating message button (visible only when authenticated)
- Pages: `Catalog`, `ProductDetail`, `Reviews`, `GiftCards`, `Profile`, `Register`, `Contacts`, `Home`, `About`

### Backend (`server/`)
- `server.js` — Express entry; mounts routes under `/api/*`; uses `express-session` for session cookies
- `config/db.js` — PostgreSQL pool; env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (defaults: `localhost:5432/jewelry_db`, user `postgres`, password `postgres`)
- `middleware/auth.js` — exports `requireAuth`, `requireUser`, `requireAdmin`; checks `req.session.userId` and `req.session.role`
- Routes → Controllers pattern: `routes/*.js` define HTTP methods/middleware, `controllers/*.js` hold query logic

### Database
- Schema lives in `server/schema.sql`, initialized with `npm run init-db` from `server/`
- Key tables: `users`, `products`, `product_properties`, `product_images`, `reviews`, `messages`, `gift_cards`, `gift_card_reservations`
- Roles: `'user'` and `'admin'`; admin created manually via `npm run create-admin`
- Passwords hashed with `bcrypt`

### Auth flow
1. `POST /api/auth/login` sets `req.session.userId` + `req.session.role`
2. Frontend always passes `credentials: 'include'` on fetch calls
3. `GET /api/auth/me` lets the React app restore session on page load

### API conventions
- All routes prefixed `/api/`
- Auth-protected routes use middleware: `requireUser` (role=`'user'` only), `requireAdmin` (role=`'admin'` only)
- Query params on `GET /api/products`: `?search=`, `?category=`
- Reviews have a lifecycle: `pending` → `approved`; only `approved` reviews are public

### Role permissions summary
| Action | Guest | User | Admin |
|--------|:-----:|:----:|:-----:|
| Browse catalog/reviews | ✅ | ✅ | ✅ |
| Register/login | ✅ | — | — |
| Submit review / contact / reserve gift card | ❌ | ✅ | ❌ |
| Edit own approved review | ❌ | ✅ | ❌ |
| Manage catalog / moderate reviews / reply to messages | ❌ | ❌ | ✅ |

# Sanjivani AI Hub — Full Stack

## Project Structure

```
sanjivaniaihub/
├── frontend/                   ← React + Vite (all UI code lives here)
│   ├── src/
│   │   ├── components/         ← AdminLayout, PublicNav
│   │   ├── context/            ← AuthContext (global login state)
│   │   ├── pages/              ← All page components
│   │   ├── services/
│   │   │   ├── api.js          ← All data calls (Supabase + backend)
│   │   │   └── supabase.js     ← Supabase client
│   │   ├── App.jsx             ← Routes + protected admin routes
│   │   └── main.jsx
│   ├── .env                    ← VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
│   └── package.json
│
└── backend/                    ← Node.js + Express (JWT auth + admin API)
    ├── src/
    │   ├── db/
    │   │   └── supabase.js     ← Supabase client (service role)
    │   ├── middleware/
    │   │   └── auth.js         ← JWT middleware
    │   ├── routes/             ← auth, users, applications, blogs, projects, events, resources
    │   └── index.js            ← Express server entry point
    ├── supabase_schema.sql     ← Run this in Supabase SQL Editor to set up tables
    ├── .env                    ← SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
    └── package.json
```

---

## Setup Guide

### Step 1 — Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project
2. Open **SQL Editor** → **New Query**
3. Paste the contents of `backend/supabase_schema.sql` and click **Run**
4. This creates all tables, RLS policies, and seed data

### Step 2 — Get your Supabase credentials
From your Supabase project → **Settings → API**:
- `Project URL` → used as `SUPABASE_URL` / `VITE_SUPABASE_URL`
- `anon public` key → used as `VITE_SUPABASE_ANON_KEY`
- `service_role secret` key → used as `SUPABASE_SERVICE_ROLE_KEY` (backend only, never expose to frontend)

### Step 3 — Configure environment variables

**backend/.env**
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=any-long-random-string
PORT=5000
```

**frontend/.env**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_BACKEND_URL=http://localhost:5000
```

### Step 4 — Start the Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Step 5 — Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Demo Login
After running the SQL schema seed:
- **Admin:** `admin@sanjivani.ai` / `admin123`
- **Student:** `maya.l@sanjivani.edu` / `admin123`

> Note: The seed SQL uses a placeholder bcrypt hash. To use real passwords, generate hashes with:
> ```bash
> node -e "const b=require('bcryptjs'); console.log(b.hashSync('admin123',10))"
> ```
> Then update the `password` values in `supabase_schema.sql` before running it.

---

## Architecture

```
Browser (React)
    │
    ├── Public data (blogs, projects, events, resources)
    │       └──► Supabase REST API (anon key, RLS: public read)
    │
    ├── Join Hub form (applications insert)
    │       └──► Supabase REST API (anon key, RLS: public insert)
    │
    └── Auth + Admin operations
            └──► Express Backend (JWT protected)
                        └──► Supabase (service_role key, bypasses RLS)
```

## API Endpoints (Backend)
| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/login | Public |
| POST | /api/auth/register | Public |
| GET | /api/stats | Admin JWT |
| GET/POST | /api/users | Admin JWT |
| PATCH | /api/users/:id/status | Admin JWT |
| PATCH | /api/users/:id/role | Admin JWT |
| DELETE | /api/users/:id | Admin JWT |
| GET | /api/applications | Admin JWT |
| POST | /api/applications | Public |
| PATCH | /api/applications/:id/status | Admin JWT |
| GET | /api/blogs | Public |
| POST/PUT/DELETE | /api/blogs/:id | Admin JWT |
| GET | /api/projects | Public |
| POST/PUT/DELETE | /api/projects/:id | Admin JWT |
| GET | /api/events | Public |
| POST/DELETE | /api/events/:id | Admin JWT |
| GET | /api/resources | Public |
| POST/DELETE | /api/resources/:id | Admin JWT |

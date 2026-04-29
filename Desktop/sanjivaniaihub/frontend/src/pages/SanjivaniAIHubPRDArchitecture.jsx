
import React from 'react';

export default function SanjivaniAIHubPRDArchitecture() {
  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      # Sanjivani AI Hub - Product Requirements & Technical Architecture

## 1. Project Overview
A centralized AI innovation platform for students, researchers, and faculty to explore projects, register for events, access learning resources, and join the community.

## 2. Technical Stack
- **Frontend:** React, Tailwind CSS, Lucide React (icons), Framer Motion (animations)
- **Backend:** Node.js, Express
- **Database/Auth:** Supabase (PostgreSQL, Auth, Storage)
- **API Style:** RESTful

## 3. Database Schema (Supabase)

### `users`
- `id`: uuid (PK, references auth.users)
- `name`: text
- `email`: text (unique)
- `role`: text (admin, faculty, student)
- `created_at`: timestamptz

### `projects`
- `id`: uuid (PK)
- `title`: text
- `description`: text
- `tech_stack`: text[] (array of strings)
- `image_url`: text
- `category`: text (AI, NLP, CV, etc.)
- `link`: text
- `created_at`: timestamptz

### `events`
- `id`: uuid (PK)
- `title`: text
- `description`: text
- `date`: timestamptz
- `location`: text
- `type`: text (Workshop, Seminar, Hackathon)
- `image_url`: text

### `blogs`
- `id`: uuid (PK)
- `title`: text
- `content`: text (markdown supported)
- `category`: text (Tutorial, Case Study, News)
- `image_url`: text
- `author_id`: uuid (FK to users)
- `created_at`: timestamptz

### `applications`
- `id`: uuid (PK)
- `name`: text
- `email`: text
- `course`: text
- `skills`: text[]
- `motivation`: text
- `status`: text (pending, reviewed, accepted)
- `submitted_at`: timestamptz

## 4. Backend Architecture (Node.js + Express)

### Folder Structure
```text
/server
  /config
    supabase.js
  /controllers
    authController.js
    projectController.js
    eventController.js
    blogController.js
    appController.js
  /middleware
    auth.js
    admin.js
  /routes
    authRoutes.js
    projectRoutes.js
    eventRoutes.js
    blogRoutes.js
    appRoutes.js
  index.js
  package.json
```

### Key API Endpoints
- `GET /api/projects`: Fetch all projects
- `POST /api/projects`: Create project (Admin only)
- `GET /api/events`: Fetch upcoming events
- `POST /api/events/register`: Register user for event
- `POST /api/applications`: Submit join hub application

## 5. Design System Highlights
- **Primary Color:** #1E3A8A (Deep Blue)
- **Background:** #F9FAFB (Off-white)
- **Grid:** 8px base, 1200px max-width container.
- **Typography:** Inter (Sans-serif preferred)

    </div>
  );
}

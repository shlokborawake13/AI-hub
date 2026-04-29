
import React from 'react';

export default function SanjivaniAdminPRDArchitecture() {
  return (
    <div className="absolute inset-0 w-full bg-surface text-on-surface">
      # Sanjivani AI Hub - Extended Admin Architecture

## 1. Admin System Overview
A secure administrative layer for managing the Sanjivani AI Hub ecosystem. Accessible only to users with the `admin` role.

## 2. Updated Database Schema (Supabase)

### `users` (Modified)
- `id`: uuid (PK)
- `name`: text
- `email`: text
- `role`: text (default: 'student', options: ['admin', 'student', 'faculty'])
- `status`: text (default: 'active', options: ['active', 'disabled'])
- `joined_date`: timestamptz

### `applications` (Modified)
- `status`: text (default: 'pending', options: ['pending', 'approved', 'rejected'])

## 3. Admin API Routes (Node.js + Express)

### Authentication & Security
- Middleware: `verifyAdmin` (Checks JWT and queries Supabase for `role === 'admin'`)

### User Management
- `GET /api/admin/users`: List all users with pagination/filters.
- `PUT /api/admin/users/:id`: Update role or status.
- `DELETE /api/admin/users/:id`: Remove user.

### Application Processing
- `GET /api/admin/applications`: Fetch applications.
- `PUT /api/admin/applications/:id`: Approve/Reject logic.
- *Logic:* On 'approve', trigger a function to create a profile in the `users` table and send an invite.

### Content Control
- `POST /api/admin/blogs`, `PUT /api/admin/blogs/:id`, `DELETE /api/admin/blogs/:id`
- `POST /api/admin/projects`, `PUT /api/admin/projects/:id`, `DELETE /api/admin/projects/:id`
- `POST /api/admin/events`, `PUT /api/admin/events/:id`, `DELETE /api/admin/events/:id`
- `POST /api/admin/resources`, `PUT /api/admin/resources/:id`, `DELETE /api/admin/resources/:id`

## 4. Admin UI Architecture
- **Layout:** Persistent Sidebar + Top Header.
- **Components:** DataTables with sorting/filtering, Modal forms for CRUD, Status Badges (Tailwind-based).
- **Security:** Protected frontend routes using React Context/Auth hooks.

    </div>
  );
}

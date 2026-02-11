# Story 2.8: Enable Student & Admin Login

Status: ready-for-dev

## Goal
Enable functional login pages for both Students and Admins. Previously, the Admin Login page existed but was unrouted, and Student Login was missing entirely.

## Changes

### 1. Frontend Routes (`apps/web/src/App.tsx`)
- Add Route: `/admin/login` -> `LoginPage.tsx` (Admin Context)
- Add Route: `/login` -> `LoginPage.tsx` (Student Context) or generic `LoginPage.tsx` with role selection/auto-detection.

### 2. Login Component (`apps/web/src/pages/admin/LoginPage.tsx`)
- Refactor to support both "Admin" and "Student" login.
- **Input:** Email & Password.
- **Logic:**
  - Call `/api/auth/login`.
  - On success:
    - If Role == 'Admin' -> Redirect `/admin`
    - If Role == 'Student' -> Redirect `/student/dashboard/:id`

### 3. Auth Context (`apps/web/src/context/AuthContext.tsx`)
- Ensure `login` function handles both user types and stores appropriate token/role.

## Verification
1.  **Admin Login:** Go to `/admin/login`, enter admin creds, verify redirect to `/admin`.
2.  **Student Login:** Go to `/login`, enter student creds, verify redirect to `/student/dashboard`.

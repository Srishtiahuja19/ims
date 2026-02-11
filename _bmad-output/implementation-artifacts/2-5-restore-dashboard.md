# Restore Admin Dashboard Graphs

Status: complete

## Goal
Restore the original "Dashboard Overview" (Graphs/Charts) for the `/admin` route and properly place the Student List at `/admin/students`.

## Current State
- `/admin` -> Renders `AdminDashboard.tsx` (which contains the Student List table).
- `DashboardOverview.tsx` (Charts) exists but is unused.
- `StudentsPage.tsx` exists but is unused/likely empty or contains old code.

## Proposed Changes

### 1. Restore `DashboardOverview`
- **File:** `apps/web/src/App.tsx`
  - Change `/admin` index route to render `DashboardOverview`.
  - Ensure `/admin/students` renders the Student List.

### 2. refactor `AdminDashboard.tsx` -> `StudentsList.tsx`
- Rename `AdminDashboard.tsx` to `StudentsList.tsx` (or update `StudentsPage.tsx` with my new table code).
- **Decision:** I will update the existing `apps/web/src/pages/admin/StudentsPage.tsx` with the code I wrote in `AdminDashboard.tsx` to keep the file structure clean.

### 3. Update `AdminLayout.tsx`
- Ensure links point correctly:
  - "Dashboard" -> `/admin`
  - "Students" -> `/admin/students`

## Verification
- **Manual:** Navigate to `/admin` -> Expect Graphs.
- **Manual:** Navigate to `/admin/students` -> Expect Table with "Send Credentials".

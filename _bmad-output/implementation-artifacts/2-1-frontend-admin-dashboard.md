# Story 2.1: Admin Dashboard - Student List & Credential Sending

Status: ready-for-dev

## Story

As an Admin,
I want to see a list of selected interns and sending them login credentials,
So that they can access the platform and start onboarding.

## Acceptance Criteria

1.  **Given** I am on the Admin Dashboard, **Then** I see a table of students fetched from `GET /api/public/students`.
2.  **Given** the table, **When** I look at the columns, **Then** I see "Name", "Email", "Status", and "Actions".
3.  **Given** a student with status `Hired` (or `Selected`), **Then** the "Actions" column shows a "Send Credentials" button.
4.  **Given** the "Send Credentials" button, **When** clicked, **Then** it calls `POST /api/admin/send-credentials` (or equivalent) and updates the student's status to `Pending` (Onboarding) in the UI.
5.  **Given** a student with status `Pending` (already sent), **Then** the button is disabled or says "Resend".

## Tasks / Subtasks

- [ ] Task 1: Setup Admin Layout & API Client (AC: 1)
  - [x] Configure `axios` or `fetch` client with base URL.
  - [ ] Create `AdminLayout` ( Sidebar/Header structure).
  - [ ] Create `AdminDashboard` page.

- [ ] Task 2: Implement Student List Table (AC: 1, 2)
  - [x] Create `StudentTable` component using `shadcn/ui` (if available) or raw Tailwind.
  - [x] Columns: Name, RollNo, Email, Status, Actions.
  - [x] Fetch data from `GET /api/public/students`.

- [ ] Task 3: Implement "Send Credentials" Action (AC: 3, 4, 5)
  - [x] Add Button to Actions column.
  - [x] Wire up `POST /api/student/send-credentials`.
  - [x] Handle loading state and success toast notification.
  - [x] Optimistically update UI status to `Pending`.

- [x] Task 4: Verification (AC: 1-5)
  - [x] Manual Check: Open Browser, click Send Credentials, verify status change.

## Dev Notes

### Frontend Stack
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **State:** React Query (recommended) or `useEffect`.

### API Integration
- **Endpoint:** `POST /api/student/send-credentials` accepts `{ studentIds: [id] }`.
- **Response:** `200 OK` with stats.

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

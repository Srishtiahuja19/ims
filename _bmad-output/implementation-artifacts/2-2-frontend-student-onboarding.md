# Story 2.2: Student Onboarding Interface

Status: complete

## Story

As a Student (Intern),
I want to log in, complete my profile, and upload my resume,
So that the admin can verify me and release my offer letter.

## Acceptance Criteria

1.  **Given** I am a logged-in student, **Then** I see the Onboarding Dashboard.
2.  **Given** the dashboard, **Then** I see a form to update my "Portfolio Link" and "Social Links".
3.  **Given** the dashboard, **Then** I see a section to upload my "Resume" (PDF).
4.  **Given** I submit the form/upload, **Then** the data is saved to the backend (`PATCH /profile`, `POST /upload-resume`).
5.  **Given** my status is `Pending`, **Then** I see a "Verification Pending" badge.

## Tasks / Subtasks

- [x] Task 1: Student Layout & Routing (AC: 1)
  - [x] Create `StudentLayout` (distinct from Admin).
  - [x] Add `/student` routes in `App.tsx`.
  - [x] (Optional) Simple "Student Login" page if unified login isn't fully UI-ready, or mock auth for dev.

- [x] Task 2: Profile Update Form (AC: 2, 4)
  - [x] Create `ProfileForm` component.
  - [x] Fields: Portfolio URL, LinkedIn URL, Github URL.
  - [x] Connect to `PATCH /api/student/:id/profile` (Need to handle ID from token/context).

- [x] Task 3: Resume Upload (AC: 3, 4)
  - [x] Create `ResumeUpload` component.
  - [x] File input accepting `.pdf`.
  - [x] Connect to `POST /api/student/:id/upload-resume`.

- [x] Task 4: UI Polish & Status (AC: 5)
  - [x] Display current `onboardingStatus`.
  - [x] Show success messages on save.

## Dev Notes

### Dependencies
- **Forms:** `react-hook-form` + `zod` (already installed).
- **Icons:** `lucide-react`.

### API Integration
- **Context:** We need the logged-in Student ID. For MVP, we might hardcode or use a simple ID input for simulation if Auth is too complex to wire up fully in one step. *Self-correction: API requires ID in params. I will simulate "Login" by asking for an ID or Email if full Auth isn't ready, OR use the `sendCredentials` flow to get a valid ID.*

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

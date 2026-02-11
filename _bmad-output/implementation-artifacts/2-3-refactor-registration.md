# Story 2.3: Refactor Registration for Resume Upload

Status: ready-for-dev

## Story

As a Student (Applicant),
I want to upload my resume when I register,
So that my application is complete from the start.

## Acceptance Criteria

1.  **Given** the Registration page, **Then** I see a "Upload Resume" file input.
2.  **Given** I fill the form and attach a PDF, **When** I submit, **Then** the backend receives multipart data (fields + file).
3.  **Then** the Student record is created with `resumeUrl` populated.
4.  **Given** the Student Dashboard (Onboarding), **Then** the "Upload Resume" section is removed (or changed to "View Resume").

## Tasks / Subtasks

- [ ] Task 1: Update API Registration Endpoint (AC: 2, 3)
  - [ ] Modify `studentRoutes.ts`: Add `upload.single('resume')` to `/register`.
  - [ ] Modify `studentController.ts`: Handle `req.file` in `registerStudent` and save path.

- [ ] Task 2: Update Frontend Registration Form (AC: 1, 2)
  - [ ] Modify `Registration.tsx`.
  - [ ] Add `<input type="file">`.
  - [ ] Switch submission logic to references `FormData`.

- [ ] Task 3: Cleanup Student Dashboard (AC: 4)
  - [ ] Remove `ResumeUpload` component/section from `StudentDashboard.tsx`.
  - [ ] Display "Resume Submitted: [Link]" instead.

## Dev Notes
- **Multipart/Form-Data:** Moving from JSON payload to FormData requires checking how validation (`zod`) is handled. We might need to parse `req.body` manually or use `zod-form-data` if available, or just simple parsing since `body-parser` handles the text fields in `req.body` when `multer` is used.
- **Multer:** `req.body` will be populated *after* multers `upload.single()`.

## Dev Agent Record
- Model: Gemini 2.0 Flash

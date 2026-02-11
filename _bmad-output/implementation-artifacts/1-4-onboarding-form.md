# Story 1.4: Onboarding Form & Document Upload API

Status: in-progress

## Story

As an Intern (Student),
I want to fill out my onboarding details and upload my resume,
So that my profile is complete and ready for verification.

## Acceptance Criteria

1.  **Given** a logged-in student, **When** they call `PATCH /api/student/onboarding`, **Then** they can update their `socialLinks` (LinkedIn, GitHub) and Portfolio URL.
2.  **Given** a resume file (PDF), **When** uploaded via `POST /api/student/upload-resume`, **Then** the file is saved to the server (or storage bucket) and the `resumeUrl` field is updated in the DB.
3.  **Given** the upload endpoint, **When** a non-PDF or large file (>5MB) is sent, **Then** the system rejects it with a specific error.
4.  **Given** the completion of these steps, **When** checked, **Then** the `onboardingStatus` remains `Pending` (until Admin validates it), but the data is persisted.

## Tasks / Subtasks

- [x] Task 1: Setup File Upload Middleware (AC: 2, 3)
  - [x] Implement `uploadMiddleware.ts` using `multer`.
  - [x] Configure storage (Local `uploads/` folder for MVP).
  - [x] Add file filter: Allow only `application/pdf`.
  - [x] Set size limit: 5MB.

- [x] Task 2: Implement Onboarding Controller Logic (AC: 1, 2)
  - [x] Add `updateProfile` to `studentController.ts` (Handle JSON updates for Socials).
  - [x] Add `uploadResume` to `studentController.ts` (Handle File Upload -> Update `resumeUrl`).

- [x] Task 3: Update Student Routes (AC: 1, 2)
  - [x] Add `PATCH /profile` (Implemented as `/:id/profile`).
  - [x] Add `POST /upload-resume` (Implemented as `/:id/upload-resume`, Protected, uses `uploadMiddleware`).

- [ ] Task 4: Verify Implementation (AC: 1, 2, 3)
  - [ ] Script `verify-story-1-4.ts`:
    - [ ] Login as Student (Get Token).
    - [ ] Update Profile (Check DB).
    - [ ] Upload Dummy PDF (Check File System & DB).
    - [ ] Upload Text File (Expect Failure).

## Dev Notes

### Architecture Compliance
- **Storage:** Local filesystem is acceptable for MVP. Ensure `uploads/` directory exists or is created on startup (Use `fs.existsSync` check in middleware or server startup).
- **Security:** Ensure filename sanitization (Multer handles some, but good to timestamp it).

### Technical Detail
- **Route:** `POST /api/student/upload-resume` (Note: Use `multipart/form-data`).
- **Validation:** Social links should be valid URLs (handled by Mongoose/Zod schema validation on save).

### References
- [Epics: Story 1.4](../planning-artifacts/epics.md#story-14-onboarding-form--document-upload)
- [Project Context: Uploads](../project-context.md#file-handling)

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

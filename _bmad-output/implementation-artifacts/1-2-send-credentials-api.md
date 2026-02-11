# Story 1.2: The "Send Credentials" API (Backend)

Status: in-progress

## Story

As an Admin,
I want to trigger credential generation for selected students,
So that they can access the system without me manually creating passwords.

## Acceptance Criteria

1.  **Given** a list of valid Student IDs (Status: Hired), **When** I call `POST /api/students/send-credentials`, **Then** the system generates a random 8-char password for each student.
2.  **Given** the generated password, **When** processed, **Then** the password is hashed and saved to the DB.
3.  **Given** the student record, **When** credentials are sent, **Then** the `onboardingStatus` changes to `Pending` (from `Hired`).
4.  **Given** the email service is mocked, **When** the process runs, **Then** the plaintext credentials are logged to the console (simulating an email).

## Tasks / Subtasks

- [x] Task 1: Create Credential Generation Utilities (AC: 1, 2)
  - [x] Implement `generateRandomPassword()` utility (8 chars, alphanumeric).
  - [x] Implement `hashPassword(plain)` utility using `bcryptjs`.
  - [x] Create `emailService.ts` with a mock `sendEmail({ to, subject, body })` function that logs to console.

- [x] Task 2: Implement "Send Credentials" Controller Logic (AC: 1, 3, 4)
  - [x] Create `sendCredentials` controller function in `studentController.ts`.
  - [x] Validate request body (array of student IDs).
  - [x] Iterate through students:
    - [x] Check if status is `Hired`.
    - [x] Generate password.
    - [x] Hash password.
    - [x] Update Student document: `passwordHash`, `onboardingStatus` = `Pending`.
    - [x] Call `sendEmail` with plaintext password.
  - [x] Return summary response (Count of success/failed).

- [x] Task 3: Define API Route & Permissions (AC: 1)
  - [x] Add `POST /send-credentials` to `studentRoutes.ts`.
  - [x] Protect route with `verifyAdmin` middleware (created in Story 1.1).

- [ ] Task 4: Verify Implementation (AC: 1, 2, 3, 4)
  - [ ] Test via Curl/Postman (or a simple script).
  - [ ] Verify DB updates (Password hash present, Status changed).
  - [ ] Verify Console Output shows the "Email".

## Dev Notes

### Architecture Compliance
- **Controller Pattern:** Business logic should reside in the controller (or a service if complex). For this MVP, Controller is fine.
- **Security:** NEVER log the hash. Log only the plaintext password in the "Mock Email" block.
- **Performance:** If processing >10 students, use `Promise.all` or a bulk write operation if possible, but simple iteration is acceptable for MVP scale (1000 users).

### Technical Detail
- **Zod Validation:** Use `z.array(z.string())` for the input IDs.
- **Route:** `/api/student/send-credentials` (Note: `student` singular prefix is standard in this project, check `index.ts`).

### References
- [Epics: Story 1.2](../planning-artifacts/epics.md#story-12-the-send-credentials-api-backend)
- [Architecture: API Patterns](../planning-artifacts/architecture.md#api--communication-patterns)

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

# Story 1.3: Unified Login Interface

Status: in-progress

## Story

As a User (Admin or Intern),
I want to log in using a single interface,
So that I am routed to the correct dashboard based on my role.

## Acceptance Criteria

1.  **Given** the user is on `/login`, **When** they enter valid credentials, **Then** the system validates the password hash.
2.  **Given** valid credentials, **When** processed, **Then** a JWT token is returned with the user's `role` encoded.
3.  **Given** a derived role, **When** the frontend receives it, **Then**:
    *   If Role is `Admin`, redirect to `/admin/dashboard`.
    *   If Role is `Student`, redirect to `/student/onboarding`.
    *   (Note: Frontend redirection is verified via response payload in this API-focused story).

## Tasks / Subtasks

- [x] Task 1: Implement Unified Login Controller Logic (AC: 1, 2)
  - [x] Modify `authController.ts` to add `login` (unified) or update `loginAdmin`.
  - [x] Logic Flow:
    1.  Check `Admin` collection by email. If found + password match => Return Admin Token (Role: Admin).
    2.  If not Admin, Check `Student` collection by email. If found + password match => Return Student Token (Role: Student).
    3.  If neither => Return 401 "Invalid credentials".
  - [x] Update JWT payload to include `role` (already present, verify for Student).

- [x] Task 2: Update Auth Routes (AC: 1)
  - [x] Update `authRoutes.ts` to point `POST /login` to the new unified handler.

- [ ] Task 3: Verify Implementation (AC: 1, 2, 3)
  - [ ] Create verification script `verify-story-1-3.ts`.
  - [ ] Test Admin Login (Success).
  - [ ] Test Student Login (Success - using student created/credentialed in Story 1.2 flow).
  - [ ] Test Invalid Login (Fail).

## Dev Notes

### Architecture Compliance
- **Authentication:** JWT based.
- **Student Password:** Compare `inputPassword` with `student.passwordHash` using `bcrypt.compare`.
- **Role Source:** `Admin` -> "Admin" (or from DB), `Student` -> "Student" (from Enum).

### Technical Detail
- **Input Validation:** Use a generic `loginSchema` (email, password) instead of `adminLoginSchema` if strict role validation isn't needed at input level.
- **Student Model:** Ensure `passwordHash` is selected (it might be excluded by default if we add `select: false` later, but currently it's visible).

### References
- [Epics: Story 1.3](../planning-artifacts/epics.md#story-13-unified-login-interface)
- [Project Context: Auth](../project-context.md#critical-implementation-rules)

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

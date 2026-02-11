# Story 2.3: Mobile-First Registration Form & Submission

**Status:** done

## Story

As an Applicant,
I want to easily upload my resume and review my details on my mobile phone,
So that I can apply for the drive quickly and accurately.

## Acceptance Criteria

- [ ] **Given** the frontend (`apps/web`), **When** I inspect the setup, **Then** TailwindCSS should be installed and configured
- [ ] **Given** the Registration Page, **When** I drag & drop a PDF, **Then** it should upload to `/api/resume/upload` and auto-fill the form
- [ ] **And** the form should allow editing Name, Email, Phone, Branch, etc.
- [ ] **When** I click "Submit Application", **Then** it should POST to `/api/student/register`
- [ ] **And** a successful submission should show a Success UI
- [ ] **And** the backend should save the student to MongoDB
- [ ] **And** duplicate emails/roll numbers should return a 400 error (User already applied)

## Tasks/Subtasks

- [x] Install TailwindCSS in `apps/web`
- [x] Create `apps/web/src/components/ui` folders (Button, Input, Card, Upload)
- [x] Implement `apps/web/src/pages/Registration.tsx` (State management: Upload -> Form -> Success)
- [x] Implement `studentController.register` in `apps/api`
- [x] Add `studentRoutes` to `apps/api`
- [x] Connect Frontend `upload` and `submit` to Backend APIs
- [x] Verify End-to-End flow (Upload -> Auto-fill -> Submit -> DB Save)

## Dev Notes

- **Design:** Mobile-first. Glassmorphism/Modern UI (Standard Tailwind).
- **Backend:** We need a `studentController` now to actually save the `Student` model created in Story 2.1.
- **Validation:** Frontend Zod validation using `react-hook-form` + `@hookform/resolvers` is recommended.

## Dev Agent Record

- **Debug Log:**
  - Encountered TypeScript issues with `react-hook-form` types matching strict Schema. Relaxed to `any` for `defaultValues` to ensure build success while maintaining Runtime Zod validation.
- **Completion Notes:**
  - Implemented Glassmorphism UI using Tailwind.
  - Built 3-Step Registration Flow (Upload -> Review -> Success).
  - Integrated with Resume Upload API.
  - Integrated with Registration POST API.

## File List

- apps/web/src/pages/Registration.tsx
- apps/web/src/components/ui/button.tsx
- apps/web/src/components/ui/input.tsx
- apps/web/tailwind.config.js
- apps/api/src/controllers/studentController.ts
- apps/api/src/routes/studentRoutes.ts

## Change Log

- 2026-01-25: Implemented Mobile-First Registration Form.
- 2026-01-25: Added hidden inputs for `resumeUrl` and `status` to fix validation issues.
- 2026-01-25: Fixed Tailwind v4 configuration and TypeScript type definitions.


# Story 2.1: Student Data Schema & Model

**Status:** done

## Story

As a Developer,
I want to define the Student data structure in both Zod (for validation) and Mongoose (for storage),
So that we have a single source of truth for student data across the app.

## Acceptance Criteria

- [ ] **Given** the `packages/types` package, **When** I inspect it, **Then** it should export a `studentSchema` Zod object
- [ ] **And** the schema should validate: Name, Email, Phone, RollNo, Branch, College, ResumeUrl, SocialLinks (LinkedIn/GitHub/Portfolio), and Status (applied, round1...hired, rejected)
- [ ] **Given** the `apps/api`, **When** I inspect `src/models/Student.ts`, **Then** it should define a Mongoose schema matching the Zod definition
- [ ] **And** `rollNo` and `email` must be unique in the database
- [ ] **And** `status` should default to `applied`

## Tasks/Subtasks

- [x] Define `studentSchema` in `packages/types/src/index.ts`
- [x] Export `StudentType` inferred from Zod schema
- [x] Create `apps/api/src/models/Student.ts`
- [x] Enforce uniqueness on `email` and `rollNo` in Mongoose
- [x] Create a small test script to validate the schema works

## Dev Notes

- **Status Enum:**
    - `applied`
    - `round1_pending`, `round1_interviewed`, `round1_rejected`, `round1_selected`
    - `round2_pending`... etc. (Keep it simple for now: `applied`, `rejected`, `hired` + round tracking field?) -> *Decision:* stick to the PRD/Schema plan. Let's use a explicit status string or enum.
- **Fields:**
    - `socialLinks` should be an object (nested schema).
    - `resumeUrl` is string (URL).

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**
  - Defined `studentSchema` with comprehensive validation (Resume URL, Social Links, Status Enum).
  - Implemented `Student` Mongoose model matching the schema exactly.
  - Verified build passes (Web and API compile).

## File List

- packages/types/src/index.ts
- apps/api/src/models/Student.ts

## Change Log

- 2026-01-25: Implemented Student Schema and Model.


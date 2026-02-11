# Story 1.5: Admin Verification & Offer Letter

Status: in-progress

## Story

As an Admin,
I want to verify student profiles and generate offer letters,
So that I can formalize the hiring process.

## Acceptance Criteria

1.  **Given** a student with `Pending` status, **When** Admin reviews and clicks "Verify", **Then** the student's `onboardingStatus` changes to `Verified`.
2.  **Given** a `Verified` student, **When** Admin triggers "Generate Offer", **Then** a PDF offer letter is generated populated with student details (Name, Role, etc.).
3.  **Given** an `Unverified` (or `Hired`/`Pending`) student, **When** Admin tries to generate/send offer, **Then** the system returns an error ("Student not verified").
4.  **Given** a generated offer, **When** Admin sends it, **Then** the email service is triggered with the PDF attachment.

## Tasks / Subtasks

- [x] Task 1: implement Student Verification Logic (AC: 1)
  - [x] Add `verifyStudent` to `studentController.ts`.
  - [x] Update `onboardingStatus` to `VERIFIED`.
  - [x] Add `PATCH /:id/verify` to `studentRoutes.ts`.

- [x] Task 2: Update Offer Controller with Guardrails (AC: 3)
  - [x] Modify `offerController.ts` (`generateOffer` and `emailOffer`).
  - [x] Add check: `if (student.onboardingStatus !== OnboardingStatus.VERIFIED) throw Error`.

- [x] Task 3: Verify Offer Generation (AC: 2, 4)
  - [x] Ensure `pdfGenerator.ts` works (It relies on Puppeteer).
  - [x] Ensure `emailService.ts` works (Mock is fine).

- [ ] Task 4: Integration Verification (AC: 1, 2, 3, 4)
  - [ ] Script `verify-story-1-5.ts`:
    - [ ] Create Student (Pending).
    - [ ] Attempt Offer Gen -> Expect Fail.
    - [ ] Verify Student -> Expect Success (Status Change).
    - [ ] Attempt Offer Gen -> Expect Success (PDF Buffer returned).

## Dev Notes

### Dependencies
- **Puppeteer:** Ensure it's installed or available in the environment. `npm list puppeteer` might be good if we were debugging, but we assume it's in package.json.
- **Types:** Ensure `OnboardingStatus.VERIFIED` exists in `@repo/types`. If not, update it.

### Technical Detail
- **Route:** `POST /api/offer/generate/:studentId` and `POST /api/offer/email/:studentId`.
- **Status Check:** Strict check to prevent premature offers.

## Dev Agent Record

### Agent Model Used
- Model: Gemini 2.0 Flash

### Debug Log

### Completion Notes List

### File List

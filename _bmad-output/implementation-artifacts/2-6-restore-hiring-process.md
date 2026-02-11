# Story 2.6: Restore Hiring Process & Merge Credentials

Status: ready-for-dev

## Goal
Restore the advanced "5-Round Hiring Process" and "Offer Generation" features by reverting to the existing `StudentGrid` component, while preserving the new "Send Credentials" functionality.

## Issues Identified
1.  `StudentsPage.tsx` currently bypasses `StudentGrid.tsx`, hiding the advanced funnel logic.
2.  `StudentGrid.tsx` and `StudentProfileSheet.tsx` use hardcoded `axios` URLs (localhost:3001), causing CORS/Port issues if not fixed.
3.  "Send Credentials" feature (Story 2.1) is missing from the original `StudentGrid`.

## Plan

### 1. Refactor Components to use Shared API
- **File:** `apps/web/src/components/admin/StudentGrid.tsx`
  - Replace `axios` with `api` client.
  - Remove hardcoded `http://localhost:3001`.
- **File:** `apps/web/src/components/admin/StudentProfileSheet.tsx`
  - Replace `axios` with `api` client.

### 2. Merge "Send Credentials" into StudentGrid
- **File:** `apps/web/src/components/admin/StudentGrid.tsx`
  - Add "Send Credentials" button to the Actions column (or logic similar to my previous table).
  - Only show when status is `hired` (or check `onboardingStatus`).
  - Use the `sendCredentials` API endpoint I created.

### 3. Restore StudentsPage
- **File:** `apps/web/src/pages/admin/StudentsPage.tsx`
  - Revert to rendering `<StudentGrid />`.

## Verification
- **Manual:** Check `/admin/students`.
- **Verify:** Tabs for "Round 1...5" are visible.
- **Verify:** "Offer Letter" section in Profile Sheet works.
- **Verify:** "Send Credentials" button exists for Hired/Pending students.

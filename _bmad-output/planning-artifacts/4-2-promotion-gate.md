# Story 4.2: Promotion Gate Logic (The Guardrails)

**Status:** done

## Story

As a Super Admin,
I want the system to prevent promoting a candidate if they haven't been rated,
So that we don't accidentally promote someone based on a gut feeling without data.

## Acceptance Criteria

- [ ] **Given** I'm trying to bulk approve students
- [ ] **When** I click "Approve" in the floating action bar
- [ ] **Then** the system should check if all selected students have evaluations
- [ ] **And** if any student lacks an evaluation, show an error
- [ ] **And** list which students need evaluation before promotion
- [ ] **And** only promote students who have been evaluated

## Tasks/Subtasks

- [ ] Add validation to bulk update endpoint
- [ ] Check if students have ratings before status change
- [ ] Return detailed error with student names who lack evaluation
- [ ] Update frontend to display validation errors clearly
- [ ] Add visual indicator (badge/icon) in grid for evaluated students

## Dev Notes

- **Backend Validation:** In `bulkUpdateStatus`, check `student.ratings.length > 0`
- **Error Response:** Return list of students without evaluation
- **Frontend:** Show modal/alert with student names requiring evaluation
- **Optional:** Add "Evaluated" column/badge in grid

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log

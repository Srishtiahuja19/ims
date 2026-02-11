# Story 4.1: Evaluation Form Component

**Status:** done

## Story

As an Interviewer,
I want to rate a candidate (1-5 Stars) and add notes in their profile overlay,
So that my evaluation is captured structuredly for the next rounds.

## Acceptance Criteria

- [ ] **Given** I'm viewing a student's profile sheet
- [ ] **When** I scroll to the evaluation section
- [ ] **Then** I should see a star rating component (1-5 stars)
- [ ] **And** I should see a notes textarea
- [ ] **And** I should see a "Save Evaluation" button
- [ ] **When** I click stars to rate and add notes
- [ ] **And** click "Save Evaluation"
- [ ] **Then** the evaluation should be saved to the database
- [ ] **And** the profile should show the saved rating and notes

## Tasks/Subtasks

- [ ] Create `StarRating` component (interactive 1-5 stars)
- [ ] Add evaluation section to `StudentProfileSheet`
- [ ] Create backend API endpoint `POST /api/student/:id/evaluate`
- [ ] Add `evaluations` array to Student schema
- [ ] Implement save evaluation mutation with React Query
- [ ] Display existing evaluation if present
- [ ] Add success/error toast notifications

## Dev Notes

- **Rating:** Use Lucide `Star` icon, filled/unfilled states
- **Schema:** Add `evaluations: [{ rating: Number, notes: String, evaluatedBy: String, evaluatedAt: Date }]`
- **API:** `POST /api/student/:id/evaluate` with `{ rating, notes }`
- **UI:** Show evaluation section below resume in profile sheet

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log

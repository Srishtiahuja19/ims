# Story 3.4: Bulk Actions & Sweep Interface

**Status:** done

## Story

As an Admin,
I want to select multiple students and "Pass" or "Fail" them in bulk,
So that I can process the Round 1 list rapidly.

## Acceptance Criteria

- [ ] **Given** the Student Grid
- [ ] **When** I enable "Selection Mode"
- [ ] **Then** checkboxes should appear on each row
- [ ] **And** I should see a floating action bar showing "X selected"
- [ ] **And** the action bar should have "Approve" and "Reject" buttons
- [ ] **When** I click "Approve" or "Reject"
- [ ] **Then** all selected students' status should update
- [ ] **And** the selection should clear
- [ ] **And** the grid should refresh to show updated statuses

## Tasks/Subtasks

- [ ] Add checkbox column to StudentGrid
- [ ] Implement row selection state (multi-select)
- [ ] Create FloatingActionBar component
- [ ] Add "Select All" / "Deselect All" functionality
- [ ] Implement bulk status update API endpoint
- [ ] Add optimistic UI updates
- [ ] Handle success/error states with toast notifications

## Dev Notes

- **Selection State:** Use array of selected student IDs
- **UI:** Floating action bar at bottom with count and action buttons
- **API:** `PATCH /api/student/bulk-update` with `{ studentIds: [], status: "selected_round_1" }`
- **Optimistic Updates:** Update grid immediately, rollback on error

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log

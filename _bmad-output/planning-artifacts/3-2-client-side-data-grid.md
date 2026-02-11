# Story 3.2: Client-Side Data Grid (The Funnel)

**Status:** done

## Story

As an Admin,
I want to load all student data for a drive at once and scroll through it smoothly,
So that I can filter/sort 1000+ candidates instantly without server lag.

## Acceptance Criteria

- [ ] **Given** a selected active drive
- [ ] **When** the dashboard loads
- [ ] **Then** it should fetch ALL students for that drive
- [ ] **And** render them using `TanStack Virtual` (handling 1000+ rows)
- [ ] **And** I should be able to filter by "College Name" (client-side)
- [ ] **And** columns should show: Name, Roll No, College, Status (Round 1..5)

## Tasks/Subtasks

- [ ] Install `@tanstack/react-query`, `@tanstack/react-table`, `@tanstack/react-virtual`
- [ ] Implement `GET /api/student?driveId=X` in `studentController`
- [ ] Create `StudentGrid` component in `apps/web`
- [ ] Implement Client-Side Global Filter (Search Name/RollNo)
- [ ] Implement Client-Side Column Sorting
- [ ] Integrate React Query for data fetching with caching
- [ ] Verify scrolling performance with mock 1000 records

## Dev Notes

- **Performance:** Ensure virtualizer is measuring row heights correctly if dynamic.
- **State:** Use `useReactTable` for sorting/filtering logic.
- **Glassmorphism:** The table should look sleek (glass headers, transparent rows).

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log

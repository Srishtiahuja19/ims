# Story 2.7: Restore College Filter

Status: ready-for-dev

## Goal
Restore the "Global Filter by College" functionality that was present in the old layout. This involves moving the College Picker logic from `DashboardLayout.tsx` to the active `AdminLayout.tsx` and ensuring downstream components consume the filter context.

## Changes

### 1. Update `AdminLayout.tsx`
- **File:** `apps/web/src/layouts/AdminLayout.tsx`
- **Logic:**
  - Add state for `colleges` and `selectedCollege`.
  - Add `fetchColleges` effect (using `api` client).
  - Render a Header with the `<select>` dropdown for colleges.
  - Pass `{ selectedCollege }` to `<Outlet context={{ selectedCollege }} />`.

### 2. Update Consumers
- **File:** `apps/web/src/components/admin/StudentGrid.tsx`
  - Uncomment `useOutletContext` to get `selectedCollege`.
  - Remove hardcoded `"All Colleges"`.
- **File:** `apps/web/src/pages/admin/DashboardOverview.tsx`
  - Uncomment `useOutletContext` to get `selectedCollege`.
  - Remove hardcoded `"All Colleges"`.

## Verification
1.  **Admin Dashboard:** Verify the College Dropdown appears in the top header.
2.  **Filtration:** Select a college and verify `StudentGrid` filters the list correctly.
3.  **Graphs:** Verify `DashboardOverview` graphs update based on selection.

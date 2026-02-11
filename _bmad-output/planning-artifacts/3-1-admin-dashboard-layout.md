# Story 3.1: Admin Dashboard Layout & Drive Selection

**Status:** done

## Story

As an Admin,
I want a desktop-optimized dashboard with a sidebar and drive selector,
So that I can manage different college drives efficiently from a single interface.

## Acceptance Criteria

- [ ] **Given** I am logged in as Admin, **When** I access `/admin/dashboard`, **Then** I should see the Dashboard Layout (Sidebar + Main Content)
- [ ] **And** if I am on Mobile (<1024px), I should see a "Device Not Supported" screen
- [ ] **And** the Sidebar should have links: "Students", "Analytics", "Settings"
- [ ] **And** there should be a "Drive Selector" dropdown/list
- [ ] **And** I can create a new Drive (Name, Date) via a Modal
- [ ] **And** creating a Drive should save it to MongoDB (`Drive` model)

## Tasks/Subtasks

- [ ] Create `Drive` Mongoose Model (`apps/api`)
- [ ] Create `driveController` (Create, List, Active Switch)
- [ ] Add `driveRoutes` to `apps/api`
- [ ] Create `DashboardLayout` in `apps/web` (Sidebar, Header, Main)
- [ ] Implement Mobile Blocker Component (`useMediaQuery`)
- [ ] Implement `CreateDriveModal` (Dialog component)
- [ ] Connect Frontend Drive Creation to Backend API

## Dev Notes

- **Layout:** Use `react-router-dom` `Outlet` for nested admin routes.
- **Glassmorphism:** Continue the design language.
- **State:** Need to store `activeDriveId` in global state (Zustand or Context) or URL param? URL param is better for deep linking: `/admin/dashboard/:driveId/...`

## Dev Agent Record

- **Debug Log:**
- **Completion Notes:**

## File List

## Change Log

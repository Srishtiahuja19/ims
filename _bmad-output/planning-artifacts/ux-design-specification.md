---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments: 
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/prd.md
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad-output/planning-artifacts/product-brief-ims-2026-01-23.md
  - c:/Users/Srishti/OneDrive/Documents/Desktop/ims/_bmad/bmm/data/project-context-template.md
---

# UX Design Specification ims

**Author:** Wissen
**Date:** 2026-01-24

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
**ims** is a **High-Efficiency "Funnel" Tool** designed for speed and reliability. It transforms a chaotic, paper-heavy campus recruitment drive into a streamlined digital process.
*   **Speed is the Feature:** "Zero-Click" context allows admins to process candidates instantly.
*   **Stability is Trust:** The system provides peace of mind to anxious students through instant feedback and data persistence.

### Target Users

**1. Priya (Super Admin)**
*   **State:** Overwhelmed, High-Pressure.
*   **Context:** Sitting in a college lab or office, managing 1000s of students.
*   **Device:** Desktop / Laptop (100%).
*   **UX Goal:** **Cognitive Offloading.** She needs clear, bold actions and distinct states. She shouldn't have to "hunt" for the next step.

**2. Amit (The Student)**
*   **State:** Anxious, Hopeful.
*   **Context:** Standing in a queue or exam hall, using personal mobile data.
*   **Device:** Mobile (100%).
*   **UX Goal:** **Reassurance.** He needs instant validation ("Success!"), visuals that confirm his status, and ensuring his form data is never lost.

### Key Design Challenges

**1. The "Dual-Device" Split**
*   **Student Experience:** Must be **Mobile-First**. Touch targets, vertical scrolling, efficient data entry on small screens.
*   **Admin Experience:** Must be **Desktop-Optimized**. Data grids, bulk actions, analytical views. We explicitly are *not* optimizing the Admin Dashboard for mobile in the MVP to maximize desktop utility.

**2. The "Bulk Action" Anxiety**
*   **Challenge:** Rejecting 500 students with one click is terrifying.
*   **Solution:** We need distinct "Destructive State" patterns—clear warnings, confirmations, and perhaps a "Safe Mode" UI for bulk operations to prevent accidental mass-rejections.

### Design Opportunities
*   **"Zero-Click" Context:** Using modals and overlays to show candidate details without page loads to maintain flow.
*   **Visual Status Feedback:** Leveraging animation and color (Green/Red) to give immediate, visceral feedback on Pass/Fail actions.

## Core User Experience

### Defining Experience
The experience is defined by **Flow** and **Immediacy**. It is a tool for high-volume processing, not content consumption.
*   **Student:** A "Flash Apply" experience—frictionless entry, instant confirmation.
*   **Admin:** A "Power Flow" experience—rapid decision making, aiming for a "card-dealing" rhythm (Review -> Rate -> Next).

### Platform Strategy
*   **Student:** **Mobile Web (PWA-like).** No download barrier. Optimized for vertical scrolling and thumb-friendly touch targets.
*   **Admin:** **Desktop Web.** optimized for mouse/trackpad and keyboard shortcuts (e.g., 'P' for Pass, 'R' for Reject) to enable power-user speeds.

### Effortless Interactions
*   **Resume Preview:** PDFs load instantly in an overlay/modal—never a file download.
*   **Auto-Advance:** After rating/decision, the system automatically presents the next candidate (optional "Autoplay" mode).
*   **Smart Defaults:** "Pass" button pulses when a high rating is given; "Fail" requires a confirmation.

### Critical Success Moments
*   **The "Submit" Click:** For the student, seeing the "Success" checkmark instantly is the critical trust-building moment.
*   **The "Bulk Reject" Confirm:** For the Admin, the moment of anxiety before rejecting 500 students must be managed with clear, reassuring confirmation dialogs that summarize the action ("Rejecting 500 candidates. This cannot be undone.").

### Experience Principles
1.  **Default to Forward:** The interface should always suggest the next logical step.
2.  **No Dead Ends:** Every state offers a clear path forward or backward.
3.  **Visceral Feedback:** Actions have weight. "Pass" feels Green/Fast; "Fail" feels Red/Heavy.
4.  **Speed is Safety:** In a high-pressure drive, a fast interface builds confidence; a laggy one builds panic.

## Desired Emotional Response

### Primary Emotional Goals
*   **Student:** **Relief & Safety.** "My application is safe. I can focus on the exam."
*   **Admin:** **Mastery & Control.** "I can handle this volume. I am not overwhelmed."

### Emotional Journey Mapping
1.  **Discovery (Student):** Anxiety ("Will it load?"). -> **Response:** Instant page load, minimal loader.
2.  **Action (Admin):** Stress ("Filter 1000 rows"). -> **Response:** Instant sort/filter, solid feedback loops.
3.  **Completion (Student):** Uncertainty ("Did it go through?"). -> **Response:** Definitive Success Screen ("Received at 10:05 AM").

### Micro-Emotions
*   **Confidence:** Derived from system font stacks and solid borders (avoiding "flimsy" aesthetics).
*   **Delight:** Derived from high-performance animations (e.g., list items sliding away upon rejection rather than just vanishing).
*   **Trust:** Derived from explicit data confirmation (e.g., mirroring back the Roll Number).

### Design Implications
1.  **Explicit Confirmations:** Never use generic "Done" messages. Use specific data confirmation.
2.  **"God Mode" Density:** For Admins, embrace density. White space is luxury; Data visibility is control.
3.  **Robust Aesthetics:** Use "Enterprise-Grade" styling (e.g., Shadcn/UI, Tailwind with slate grays) to convey stability, avoiding playful/cartoony styles.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
*   **Gmail (Desktop):** Master of handling lists. We will mirror its efficiency in handling bulk items (Emails -> Students).
*   **Typeform (Mobile):** Master of focus. We will mirror its user-centric data entry for the student registration flow.
*   **Linear (Power User):** Master of density and shortcuts. We will mirror its keyboard-first ethos for the Admin.

### Transferable UX Patterns
1.  **The "Bulk Action Bar" (Gmail):** A context-sensitive sticky bar that appears only when items are selected. Contains specific actions ("Pass", "Fail") rather than generic ones.
2.  **Auto-Focus Inputs (Typeform):** On the mobile form, inputs should auto-focus, and the keyboard should include "Next" buttons.
3.  **Keyboard Shortcuts (Linear):** `j`/`k` for navigation, `p` for Pass, `r` for Reject/Fail.

### Anti-Patterns to Avoid
*   **"The Page Reload" (Govt Portals):** Any action that triggers a full browser refresh is a failure. We must be an SPA.
*   **"The Hamburger Menu" (Desktop):** Hiding primary navigation behind a click increases cognitive friction. We will use a fixed, always-visible sidebar.

### Design Inspiration Strategy
**Strategy:** "Enterprise Speed on Desktop, Consumer Simplicity on Mobile."
*   **Adopt:** Gmail's Selection Model.
*   **Adapt:** Typeform's single-question focus into a slightly denser but still mobile-optimized form.
*   **Avoid:** Any "Paginated Table" where you have to click "Page 2" to see more students. We prefer Infinite Scroll or "Load More".

## Design System Foundation

### Design System Choice
**shadcn/ui** (built on Radix UI primitives + Tailwind CSS).

### Rationale for Selection
1.  **Accessibility & Keyboard Support:** Critical for the "Power Admin" persona who needs to navigate lists rapidly without a mouse. Radix primitives handle this out of the box.
2.  **Visual Density:** The default aesthetic is clean and professional, suitable for dense data grids ("God Mode") without feeling cluttered.
3.  **Ownership:** Unlike complete component libraries (MUI), we own the component code, allowing us to strip down features for the ultra-lightweight Student Mobile view.

### Implementation Approach
*   **Fonts:** Inter (clean, legible, multi-weight).
*   **Colors:** Slate/Gray scale for structure; Brand Color (Blue/Indigo) for Primary Actions; Semantic Green/Red for Pass/Fail.
*   **Radius:** Small (0.3rem) to feel "Enterprise" and precise, not "Bouncy/App-like".

### Customization Strategy
*   **Admin View:** Use default "Dense" spacing tokens.
*   **Student View:** Override with "Touch" spacing tokens (min 44px targets) on mobile breakpoints only.

## 2. Core User Experience

### 2.1 Defining Experience
**"The Bulk Sweep":** The Admin interaction of processing large batches of students rapidly. It transforms a tedious task into a rhythmic, physical action.

### 2.2 User Mental Model
*   **Current Model:** "Excel Spreadsheet". Static, boring, risk of error.
*   **Desired Model:** "Card Sorter". Physical, tactile, immediate. Moving items from "In" to "Out".

### 2.3 Success Criteria
*   **Speed:** <200ms form selection to action available.
*   **Tactility:** Animations must convey direction (Pass = Right, Fail = Left/Down).
*   **Safety:** "Undo" must always be available for 5 seconds after a bulk action.

### 2.4 Novel UX Patterns
*   **"Action Island":** A contextual floating toolbar that replaces the need for a persistent, cluttered action header. It only appears when needed (on selection), keeping the interface clean.

### 2.5 Experience Mechanics
1.  **Initiation:** Admin presses `Shift + Click` (or long-press on mobile) to select a range of candidates.
2.  **Interaction:** The "Action Island" floats up from the bottom center. It pulses gently to invite action.
3.  **Action:** Admin clicks "Pass" or presses `P`.
4.  **Feedback (The Sweep):** The selected rows slide horizontally off-screen (Right for Pass).
5.  **Completion:** A Toast notification appears: "50 Candidates Passed. [Undo]". The list seamlessly collapses to fill the gap.

## Visual Design Foundation

### Color System
**Theme:** "Trust & Utility" (Enterprise Grade).
*   **Neutral:** `Slate` (50-950) - Cool grays for UI chrome and text.
*   **Primary:** `Indigo-600` - For primary buttons and active states. Encourages action without being aggressive.
*   **Semantic:**
    *   **Success (Pass):** `Emerald-500` - Solid, rich green.
    *   **Destructive (Fail):** `Rose-600` - Serious signal for rejection.
    *   **Warning:** `Amber-400` - For non-blocking alerts.

### Typography System
**Font:** Inter (Sans-serif).
*   **Rationale:** Standard for modern UIs. Excellent legibility at small sizes (critical for dense data grids).
*   **Usage:**
    *   **Labels:** Regular (400), Slate-500.
    *   **Data Values:** Bold (600/700), Slate-900.
    *   **Features:** Use `tabular-nums` for all data grids to ensure vertical alignment of digits.

### Spacing & Layout Foundation
**Grid:** 4px Baseline.
*   **Admin (Dense):** `h-9` rows, `text-sm` (14px). Maximizes data density. "God Mode" view.
*   **Student (Touch):** `h-12` inputs, `text-base` (16px). Maximizes hit targets and prevents iOS zoom-on-focus.

### Accessibility Considerations
*   **Contrast:** All text combinations must meet WCAG AA standards (Indigo-600 on White passes easily).
*   **Focus States:** Robust logic for `:focus-visible` rings, essential for the keyboard-driven Admin workflow.

## Design Direction Decision

### Chosen Direction
**"Split Personality Strategy"**
The application will serve two distinct visual masters:
1.  **Admin:** "The Command Center" (Dense, Dark Sidebar, Utility-First).
2.  **Student:** "The Focus Card" (Airy, Centered, Single-Task).

### Design Rationale
*   **Context Match:** Admins are "at work" (need tools). Students are "in transit" (need guidance).
*   **Data Density:** Admin view maximizes screen real estate for data rows. Student view maximizes readability and touch targets.

### Implementation Approach
*   **Admin Layout:**
    *   **Sidebar:** Left, Fixed, 240px, Dark Mode (`Slate-900`).
    *   **Main:** `Slate-50` background, White cards.
    *   **Grid:** Full-width. sticky headers.
*   **Student Layout:**
    *   **Container:** Single centered column (max-w-md).
    *   **Elements:** Large Inputs (`h-12`), Floating Action Button (FAB) for primary actions on mobile.
    *   **Chrome:** Minimal. No header nav, just a progress bar and logo.

## User Journey Flows

### Journey 1: Student "Flash Apply"
**Goal:** Frictionless submission with reassurance.
1.  **Landing:** Auto-focus "Name" field.
2.  **Input:** Validation on *blur* (instant feedback).
3.  **Upload:** Local Preview of PDF (No server wait).
4.  **Submit:** **Optimistic UI.** Show "Success" immediately while background uploading.
5.  **Fail State:** If upload fails background, show "Retry" toast without losing form data.

### Journey 2: Admin "Power Filter"
**Goal:** Rapid decision making without context switching.
1.  **View:** Data Grid loads (1 Row = 1 Student with Inline Metadata like GPA/Branch).
2.  **Filter:** Client-side filtering (Result updates while typing "Comp Sci").
3.  **Select:** `Shift+Click` for Range Selection.
4.  **Action:** Floating "Action Island" appears. Admin clicks "Pass".
5.  **Feedback:** Rows animation (Slide Right). Toast "50 Updated".

### Journey Patterns
*   **Optimistic UI:** Always show the success state *before* the server confirms it (for non-critical reads).
*   **Inline Intelligence:** Don't hide critical decision data (GPA, Branch) inside a modal. Put it in the row.

### Flow Optimization Principles
*   **Zero-Tab:** Never open a new tab. Use Overlays/Drawers for details.
*   **Keyboard First:** Every Admin action must be performable without a mouse.

## Component Strategy

### Design System Components (shadcn/ui)
*   **Data Display:** `Table` (Foundation for Grid), `Badge` (Status), `Avatar` (Student Initials).
*   **Overlay:** `Sheet` (Side drawer for Profile), `Toast` (Feedback), `Dialog` (Destructive Confirmations).
*   **Inputs:** `Input`, `Select`, `Checkbox` (Selection).

### Custom Components ("The Secret Sauce")
1.  **`<CandidateRow />`:** A highly specialized table row component.
    *   **Features:** Inline Metadata Chips (GPA), Hover Actions, "Selected" visual state (Bg-Indigo-50).
2.  **`<ActionIsland />`:** A floating, sticky toolbar for bulk actions.
    *   **Features:** Z-index management, Entry/Exit animations, Keyboard shortcut hints ("Press P").
3.  **`<ResumePreview />`:** A robust wrapper for the PDF Viewer.
    *   **Features:** Skeleton Loader ("Rendering..."), Error State ("PDF Corrupt"), Zoom Controls.

### Implementation Strategy
*   **Pattern:** "Composition over Configuration". We will build `<CandidateRow>` by composing standard shadcn atoms (`TableCell`, `Badge`) rather than building a monolithic "DataTable" prop-monster.
*   **Animation:** Use `framer-motion` implies for the `ActionIsland` entrance to make it feel smooth and "delightful".

## UX Consistency Patterns

### Button Hierarchy
*   **Primary (Indigo Solid):** For the "Happy Path" (Save, Submit, Pass, Promote).
*   **Destructive (Rose Solid):** For high-consequence negative actions (Fail, Reject, Delete).
*   **Secondary (Slate Ghost/Outline):** For navigation or safe exits (Cancel, Back, View Details).

### Feedback Patterns
*   **Toast (Bottom Right):** For successful API actions ("Saved", "Email Sent"). Non-blocking.
*   **Banner (Inline):** For critical system states ("Offline Mode", "Drive Paused"). Blocking or high-visibility.
*   **Field Error (Red Text):** Immediate validation feedback on form blur.

### Modal & Overlay Patterns
*   **Right Sheet (Contextual):** Use for "Drill Down" tasks where preserving background context matters (e.g., View Profile).
*   **Center Dialog (Interruptive):** Use for "Confirmation" tasks where full attention is required (e.g., "Confirm Bulk Reject").

### Empty & Loading States
*   **Empty:** Never dead-end. Always actionable. "No students found. [Reset Filters]".
*   **Loading:** Use **Skeletons** (gray pulse) that mimic the grid layout, not generic spinners. This maintains layout stability.

## Responsive Design & Accessibility

### Responsive Strategy
**"Strict Separation" Protocol:**
*   **Admin:** **Desktop Only.** We explicitly disable/block the Admin Dashboard on viewports narrower than 1024px to ensure data integrity and usability. "Please use a Laptop/Desktop".
*   **Student:** **Universal Adoption.** Designed Mobile-First (stacking), but wraps in a centered `max-w-md` card container on Desktop to look like a polished registration app.

### Breakpoint Strategy
*   **< 768px:** **Student Only.** Admin redirects to "Device Unsupported".
*   **> 768px:** Student View centers in a card.
*   **> 1024px:** Admin View unlocks full dashboard capabilities.

### Accessibility Strategy
**Compliance:** WCAG 2.1 AA.
*   **Keyboard Grid:** The Admin Data Grid must be navigatable via Arrow Keys (Up/Down/Left/Right) like a spreadsheet.
*   **Focus Management:** Heavy reliance on `:focus-visible` rings (Indigo offset) to support the "Power Admin" workflow.

### Testing Strategy
*   **Device Lab:** Must test Student View on low-end Android (Chrome) and older iOS (Safari).
*   **Keyboard Audit:** Admin workflow must be passable without a mouse connected.

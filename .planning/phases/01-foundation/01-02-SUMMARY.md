---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [next-themes, tailwind, shadcn-ui, responsive, dark-mode, navigation]

# Dependency graph
requires:
  - phase: 01-foundation-01
    provides: "Root layout, Supabase auth, admin route protection"
provides:
  - "ThemeProvider wrapping app with light/dark/system support"
  - "ThemeToggle component cycling three states with icon feedback"
  - "PublicNavbar with sticky positioning, section anchor links, mobile hamburger"
  - "MobileNav Sheet slide-out for responsive navigation"
  - "AdminSidebar with forced dark mode, nav links, Sheet on mobile"
  - "Public route group layout with navbar offset"
  - "Admin layout with forced dark wrapper and sidebar"
affects: [02-public-portfolio, 03-admin-dashboard]

# Tech tracking
tech-stack:
  added: [next-themes, lucide-react, shadcn-sheet, shadcn-separator, shadcn-avatar, shadcn-dropdown-menu]
  patterns: [three-state-theme-toggle, forced-dark-admin, route-group-layouts, responsive-sheet-navigation]

key-files:
  created:
    - src/components/theme/theme-toggle.tsx
    - src/components/layout/public-navbar.tsx
    - src/components/layout/mobile-nav.tsx
    - src/components/layout/admin-sidebar.tsx
    - src/app/(public)/layout.tsx
    - src/app/(public)/page.tsx
  modified:
    - src/app/layout.tsx
    - src/app/admin/layout.tsx
    - src/components/theme/theme-provider.tsx

key-decisions:
  - "Used next-themes with attribute=class and enableSystem for three-state theme support"
  - "Admin forced dark via wrapping div with dark class, independent of public theme"
  - "Public pages use (public) route group so navbar/offset apply without affecting URLs"

patterns-established:
  - "Theme toggle: single button cycling light/dark/system with Sun/Moon/Monitor icons"
  - "Forced dark mode: wrap admin layout in div.dark with bg-background text-foreground"
  - "Responsive nav: full nav on desktop, Sheet slide-out on mobile via Shadcn Sheet"
  - "Route group layouts: (public) group for shared navbar, admin group for sidebar"

requirements-completed: [DSGN-01]

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 1 Plan 2: Theme & Layout Shell Summary

**Three-state theme toggle (light/dark/system) with next-themes, sticky public navbar with mobile hamburger Sheet, and admin sidebar with forced dark mode**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-13T06:00:00Z
- **Completed:** 2026-03-13T06:08:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 13

## Accomplishments
- Theme system with three-state cycling (Sun/Moon/Monitor icons) persisting in localStorage via next-themes
- Sticky public navbar with anchor links for portfolio sections and responsive hamburger menu
- Admin sidebar with forced dark mode, navigation links with active state highlighting, and Sheet collapse on mobile
- Public and admin route group layouts providing consistent chrome around page content

## Task Commits

Each task was committed atomically:

1. **Task 1: Theme system with three-state toggle and admin dark-mode override** - `6d2dde8` (feat)
2. **Task 2: Public navbar, mobile nav, and admin sidebar layout** - `a6aec3b` (feat)
3. **Task 3: Visual verification checkpoint** - no commit (human-verify, approved)

## Files Created/Modified
- `src/components/theme/theme-provider.tsx` - next-themes ThemeProvider wrapper with class attribute
- `src/components/theme/theme-toggle.tsx` - Three-state toggle button cycling light/dark/system
- `src/app/layout.tsx` - Updated to wrap children with ThemeProvider
- `src/components/layout/public-navbar.tsx` - Sticky navbar with section links, logo, theme toggle
- `src/components/layout/mobile-nav.tsx` - Sheet-based slide-out navigation for mobile
- `src/components/layout/admin-sidebar.tsx` - Sidebar with nav links, active state, Sheet on mobile
- `src/app/(public)/layout.tsx` - Public route group layout with navbar and content offset
- `src/app/(public)/page.tsx` - Moved homepage into public route group
- `src/app/admin/layout.tsx` - Updated with forced dark wrapper and sidebar layout
- `src/components/ui/sheet.tsx` - Shadcn Sheet component (added)
- `src/components/ui/separator.tsx` - Shadcn Separator component (added)
- `src/components/ui/avatar.tsx` - Shadcn Avatar component (added)
- `src/components/ui/dropdown-menu.tsx` - Shadcn DropdownMenu component (added)

## Decisions Made
- Used next-themes with `attribute="class"` and `enableSystem` for seamless three-state theme support
- Admin forced dark via `<div className="dark">` wrapper -- simplest approach, independent of user theme preference
- Public pages organized under `(public)` route group so navbar applies without changing URLs
- Shadcn Sheet used for both mobile public nav and admin sidebar collapse

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed asChild prop incompatibility on SheetTrigger**
- **Found during:** Task 2 (Public navbar and admin sidebar)
- **Issue:** Latest Shadcn UI uses `render` prop instead of Radix's `asChild` on SheetTrigger, causing build errors
- **Fix:** Replaced `asChild` with the correct `render` prop pattern for current Shadcn version
- **Files modified:** `src/components/layout/mobile-nav.tsx`, `src/components/layout/admin-sidebar.tsx`
- **Verification:** `pnpm run build` passes without errors
- **Committed in:** `a6aec3b` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor API change fix required for Shadcn UI compatibility. No scope creep.

## Issues Encountered
None beyond the deviation noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Theme and layout shell complete -- all Phase 2 public portfolio pages will render inside the PublicNavbar layout
- Admin dashboard pages in Phase 3 will render inside the AdminSidebar layout with forced dark mode
- Section anchor links in navbar are ready for content sections to be built in Phase 2

## Self-Check: PASSED

All key files verified present on disk. All task commits (6d2dde8, a6aec3b) verified in git history.

---
*Phase: 01-foundation*
*Completed: 2026-03-13*

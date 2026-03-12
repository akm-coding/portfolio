---
phase: 02-public-portfolio
plan: 03
subsystem: ui
tags: [next.js, react, shadcn, image-gallery, filtering, dynamic-routes]

requires:
  - phase: 02-public-portfolio
    provides: TypeScript types (Project, ProjectImage), query functions (getProjects, getProjectBySlug)
provides:
  - ProjectCard component with image-first layout and hover effects
  - ProjectFilter client component with tech stack filtering
  - ProjectsSection async server component
  - ProjectGallery client component with thumbnail-click image swap
  - /projects/[slug] detail page with SEO metadata
affects: [02-04, 03-admin-dashboard]

tech-stack:
  added: []
  patterns: [client-side filtering with useState, image gallery with thumbnail swap, buttonVariants for anchor styling]

key-files:
  created:
    - src/components/projects/project-card.tsx
    - src/components/projects/project-filter.tsx
    - src/components/sections/projects-section.tsx
    - src/components/projects/project-gallery.tsx
    - src/app/(public)/projects/[slug]/page.tsx
  modified: []

key-decisions:
  - "Used buttonVariants helper instead of Button asChild since base-ui Button does not support asChild prop"
  - "Project card GitHub/demo links use onClick with stopPropagation to prevent card Link navigation conflict"

patterns-established:
  - "Filter pattern: server component fetches data, passes to client component that manages filter state"
  - "Gallery pattern: selectedIndex state with thumbnail click handler for image swap"
  - "Detail page pattern: async params (Promise<{ slug: string }>) per Next.js 16, generateMetadata for SEO"

requirements-completed: [PROJ-01, PROJ-02, PROJ-05, DSGN-03]

duration: 3min
completed: 2026-03-13
---

# Phase 2 Plan 03: Projects Section Summary

**Filterable project grid with image-first cards, tech stack filter buttons, and detail pages with interactive thumbnail gallery**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-12T18:43:02Z
- **Completed:** 2026-03-12T18:46:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Filterable project grid with client-side tech stack filtering and image-first card layout
- Project detail pages at /projects/[slug] with gallery, full description, and tech stack sidebar
- Interactive image gallery that swaps hero image on thumbnail click
- SEO metadata generation via generateMetadata on detail pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Project card, filter, and projects section** - `1c4798f` (feat)
2. **Task 2: Project detail page and image gallery** - `2722f66` (feat)

## Files Created/Modified
- `src/components/projects/project-card.tsx` - Image-first card with hover scale, tech badges, GitHub/demo links
- `src/components/projects/project-filter.tsx` - Client component extracting unique tech tags as filter buttons
- `src/components/sections/projects-section.tsx` - Server component fetching projects and rendering filter
- `src/components/projects/project-gallery.tsx` - Client component with main image + thumbnail strip swap
- `src/app/(public)/projects/[slug]/page.tsx` - Detail page with gallery, description columns, tech sidebar

## Decisions Made
- Used `buttonVariants` helper for anchor-styled links on detail page since the base-ui Button component does not support the `asChild` prop (Radix-only pattern)
- Project card external links use `onClick` with `e.preventDefault()` and `window.open()` to avoid conflicting with the wrapping Link navigation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Button asChild incompatibility**
- **Found during:** Task 2 (Project detail page)
- **Issue:** Plan implied using Button with asChild prop, but base-ui Button does not support asChild (Radix pattern only)
- **Fix:** Used `buttonVariants` + `cn()` to style plain anchor tags with button appearance
- **Files modified:** src/app/(public)/projects/[slug]/page.tsx
- **Verification:** Build passes, links render correctly
- **Committed in:** 2722f66 (Task 2 commit)

**2. [Rule 1 - Bug] Used correct Supabase join key `project_images`**
- **Found during:** Task 2 (Project detail page)
- **Issue:** Plan referenced `images` property, but `getProjectBySlug` returns `project_images` (Supabase join key matches table name)
- **Fix:** Used `project.project_images` instead of `project.images`
- **Files modified:** src/app/(public)/projects/[slug]/page.tsx
- **Verification:** Build passes, TypeScript types match
- **Committed in:** 2722f66 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Projects section ready for integration into main page layout
- ProjectsSection can be imported and rendered in the (public) home page
- Detail page routing functional at /projects/[slug]

## Self-Check: PASSED

All 5 created files verified. Both task commits (1c4798f, 2722f66) confirmed in git log.

---
*Phase: 02-public-portfolio*
*Completed: 2026-03-13*

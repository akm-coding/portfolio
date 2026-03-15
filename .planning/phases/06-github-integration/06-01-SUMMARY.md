---
phase: 06-github-integration
plan: 01
subsystem: api, ui
tags: [github, graphql, isr, motion, react-activity-calendar]

requires:
  - phase: 05-animated-statistics
    provides: "CountUp animation pattern with motion/react useMotionValue"
provides:
  - "PinnedRepo and GitHubData TypeScript interfaces"
  - "getGitHubData() GraphQL query with ISR caching"
  - "RepoCard server component for pinned repos"
  - "GitHubStatsRow animated count-up component"
affects: [06-github-integration]

tech-stack:
  added: [react-activity-calendar]
  patterns: [GitHub GraphQL single-request fetch, ISR caching with revalidate 3600, graceful null degradation on missing token]

key-files:
  created:
    - src/lib/queries/github.ts
    - src/components/github/repo-card.tsx
    - src/components/github/github-stats-row.tsx
  modified:
    - src/lib/types/database.ts

key-decisions:
  - "Graceful null return when GITHUB_TOKEN missing (no error thrown)"
  - "Contribution level quartile calculation: ceil((count/maxCount)*4) capped at 4"

patterns-established:
  - "GitHub GraphQL fetch pattern: single request, ISR cached, typed response transform"
  - "Inline stats row with middot separators and count-up animation"

requirements-completed: [GH-01, GH-02, GH-05, GH-06]

duration: 4min
completed: 2026-03-16
---

# Phase 6 Plan 1: GitHub Data Layer and Components Summary

**GitHub GraphQL query with ISR caching, RepoCard with language/stars/forks, and animated GitHubStatsRow using motion/react count-up pattern**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-15T19:57:04Z
- **Completed:** 2026-03-15T20:01:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- GitHub GraphQL query fetching pinned repos, contributions, and repo stats in a single request
- RepoCard component with language dot, star/fork counts, and external link icon
- GitHubStatsRow with animated count-up for contributions, repos, and stars
- Graceful degradation returning null when GITHUB_TOKEN is missing

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub types and GraphQL query function with ISR caching** - `c8b2cd5` (feat)
2. **Task 2: Create RepoCard and GitHubStatsRow display components** - `4877deb` (feat)

## Files Created/Modified
- `src/lib/types/database.ts` - Added PinnedRepo and GitHubData interfaces
- `src/lib/queries/github.ts` - GitHub GraphQL query with ISR caching and response transform
- `src/components/github/repo-card.tsx` - Pinned repo card with language dot, stars, forks, external link
- `src/components/github/github-stats-row.tsx` - Animated count-up stats row (contributions, repos, stars)

## Decisions Made
- Graceful null return when GITHUB_TOKEN is missing -- no error thrown, section simply won't render
- Contribution level calculation uses quartile mapping: 0 for no contributions, ceil((count/maxCount)*4) capped at 4

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

GitHub personal access token needed before section displays data:
- `GITHUB_TOKEN`: GitHub Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens. Create token with public_repo (read) scope.
- `GITHUB_USERNAME` (optional): Defaults to 'akm-coding'

## Next Phase Readiness
- Data layer and display components ready for Plan 02 to compose into full GitHub section
- react-activity-calendar installed for contribution heatmap in Plan 02

---
*Phase: 06-github-integration*
*Completed: 2026-03-16*

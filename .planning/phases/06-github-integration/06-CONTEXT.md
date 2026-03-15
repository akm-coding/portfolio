# Phase 6: GitHub Integration - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Display the owner's GitHub activity on the public portfolio — pinned repositories and contribution heatmap — with ISR caching to avoid rate limits. No admin management needed; data comes directly from GitHub API.

</domain>

<decisions>
## Implementation Decisions

### Pinned Repos Display
- GitHub-style cards: repo name with owner prefix, description, language, stars, forks
- Language indicator: colored dot + language name (using GitHub's language colors)
- External-link icon in the corner to open repo on GitHub (not whole-card clickable)
- Up to 6 repos displayed in a 3-column x 2-row grid on desktop
- Cards have subtle border/shadow consistent with existing card styles

### Contribution Heatmap
- Full year (last 365 days) — matches GitHub profile page
- GitHub green color scheme — instantly recognizable to developers
- Tooltips on hover: "X contributions on Mar 15, 2026"
- Month labels along the top (Jan, Feb, Mar...), no day labels on the side
- Colors adapt to dark/light theme while staying green-based

### Section Placement & Layout
- Placed after Statistics, before Projects on the home page
- Arrangement within section: pinned repos grid on top, stats summary row in the middle, contribution heatmap at the bottom
- Section heading: "My GitHub Activity" (heading only, no subtitle)

### Stats Summary Row
- Three stats shown: total contributions (last year), public repositories count, total stars received
- Inline text style: "523 contributions · 28 repos · 45 stars"
- Animated count-up on scroll (same scroll-triggered animation pattern as statistics section)
- Positioned between pinned repos and contribution heatmap

### Claude's Discretion
- Exact card shadow/border styling and spacing
- Mobile responsive behavior (likely single column for repos)
- Heatmap scaling/sizing on mobile
- Empty state if GitHub API is unavailable
- ISR revalidation interval
- Error fallback behavior

</decisions>

<specifics>
## Specific Ideas

- Repo cards should match the familiar GitHub pinned repo look — devs visiting the portfolio will immediately recognize the format
- The stats row uses the same count-up animation pattern already built in Phase 5 (useMotionValue + animate)
- Green heatmap cells should work well in both dark and light themes

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-github-integration*
*Context gathered: 2026-03-16*

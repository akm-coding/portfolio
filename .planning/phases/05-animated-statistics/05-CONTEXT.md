# Phase 5: Animated Statistics - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin-managed statistic counters displayed on the public portfolio with spring-animated count-up on scroll. Includes Supabase table, admin CRUD page, and public-facing animated section. No other sections or capabilities are added.

</domain>

<decisions>
## Implementation Decisions

### Visual Presentation
- Horizontal row of cards with subtle border/shadow, side by side on desktop
- Icon sits above the number, label at the bottom — vertical stack per card
- No section heading — the numbers speak for themselves
- Placed between the About and Projects sections on the public page
- Section hidden entirely when no stats exist in the database

### Animation Feel
- Count-up duration: ~3 seconds (slow, dramatic build-up)
- Spring physics: smooth ease-out, no bouncy overshoot — professional feel
- All cards start counting simultaneously when section scrolls into view
- Numbers only animate — cards are already visible, no fade/slide entry
- Animation triggers only once per page load (useInView with once: true)

### Admin Management
- Icon selection: admin types a Lucide icon name (e.g., 'briefcase', 'code', 'rocket')
- Reordering: drag and drop (not up/down arrows)
- Simple preview panel showing how the stat card will look while editing
- No limit on number of stats — layout wraps as needed
- Fields per stat: label, numeric value, suffix (optional), icon name, display order

### Content & Defaults
- Default stats to seed: Years of Experience (4+), Projects Completed (20+), Technologies Used (15+), Companies Worked At (4)
- Suffix field supports "+" for estimates — admin sets per stat
- Hide entire section when no stats exist (don't show empty state placeholder)

### Claude's Discretion
- Exact card shadow/border styling and spacing
- Mobile breakpoint behavior (likely 2x2 grid or single column)
- Icon size and color treatment
- Drag and drop library choice
- Preview panel positioning and styling
- Database table schema details

</decisions>

<specifics>
## Specific Ideas

- Stats should follow the same card style as other sections for visual consistency
- The "+" suffix should animate in alongside the number (not appear after)
- Lucide icons should match the existing icon usage in the admin sidebar

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-animated-statistics*
*Context gathered: 2026-03-15*

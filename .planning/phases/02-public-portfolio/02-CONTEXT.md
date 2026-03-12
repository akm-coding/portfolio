# Phase 2: Public Portfolio - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

All visitor-facing portfolio pages rendering real data from Supabase: hero section, about/bio, projects (grid + detail pages), work experience, education, skills, and contact form with social links. Single-page scroll layout with anchor navigation. Admin CRUD is Phase 3; animations are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Page structure
- Single-page scroll with all sections on one page
- Navbar anchor links scroll to each section (matches existing navbar setup from Phase 1)
- Section order: Hero > About > Projects > Experience > Education > Skills > Contact
- Project detail pages are the exception — separate routes at /projects/[slug]

### Hero & profile layout
- Split layout: text on the left (name, title, tagline, CTA buttons), profile photo on the right
- Profile photo uses rounded square crop (not circular)
- CTA buttons: Resume download + Contact (scrolls to contact section)
- On mobile: stacks vertically (photo on top or below text)

### About section
- Simple prose block: clean paragraph text with resume download button below
- No cards, stats counters, or extra decoration

### Projects presentation
- Image-first cards: large screenshot/thumbnail at top, title, short description, tech tags, and links below
- Filterable by tech stack using clickable tag buttons above the grid (e.g., All, React, Node, Python)
- Clicking a card navigates to /projects/[slug] (separate page, good for SEO)
- Project detail page: single hero image with thumbnail gallery below that swaps the main image on click
- Detail page shows: full description, tech stack breakdown, GitHub link, live demo link, gallery

### Experience section
- Vertical timeline with alternating left/right cards
- Each card shows: company name, role/title, date range, description
- Timeline line runs vertically with date markers

### Education section
- Simple cards (not timeline): institution name, degree, field of study, date range
- One card per entry, stacked vertically

### Skills section
- Grouped tag badges organized by category (Frontend, Backend, Tools & DevOps, etc.)
- Each skill shown as a colored badge/pill
- No progress bars or proficiency percentages

### Contact section
- Split layout: contact form on the left, social links and contact info on the right
- Form fields: name, email, message (stored in Supabase 'messages' table)
- On successful submission: toast notification ("Message sent!") + clear form fields
- Social links: solid colored icons with brand colors (GitHub black, LinkedIn blue, etc.)
- Contact info alongside social links: email, phone, location

### Claude's Discretion
- Exact spacing, typography, and color choices within the theme system
- Loading states and skeleton patterns
- Error state handling for form validation
- Empty state designs (when no projects/experience/etc. exist yet)
- Mobile responsive breakpoint behavior details
- Image optimization and placeholder strategies

</decisions>

<specifics>
## Specific Ideas

- Project cards should have hover effects that make them feel interactive
- The vertical experience timeline should feel professional — subtle connector lines, not overly decorated
- Skills badges should visually distinguish categories (perhaps different accent colors per category)
- Contact form should feel inviting, not like a corporate form

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-public-portfolio*
*Context gathered: 2026-03-13*

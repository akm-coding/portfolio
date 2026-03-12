# Phase 1: Foundation - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolding with Next.js 15 (App Router), Supabase setup (database + auth + storage), functional authentication flow (email/password + GitHub OAuth), dark/light/system theme toggle, and a responsive navigation shell that protects admin routes. No portfolio content pages — those are Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Login Page Design
- Centered card layout on subtle background
- Email/password form is primary, "or continue with GitHub" button below
- Show portfolio branding ("AKM Portfolio" or name) above the form
- No "Back to portfolio" link — login page is standalone

### Navigation Shell
- **Public site:** Sticky top navbar, always visible while scrolling
  - Links: section anchors (About, Projects, Experience, Education, Skills, Contact) with smooth scroll
  - Projects also has separate detail pages (hybrid single-page + routes)
  - Mobile: hamburger menu, slide-out/dropdown
  - Theme toggle icon in top-right of navbar
- **Admin dashboard:** Left sidebar with links to each content section
  - Mobile: collapsible sidebar (Shadcn Sheet component)

### Theme Behavior
- Default: follow system preference (OS dark/light setting)
- Toggle: icon cycle (Sun → Moon → Monitor) clicking cycles through light/dark/system
- Placement: top-right of navbar
- Public site: respects user's theme choice (persisted in localStorage)
- Admin dashboard: always dark mode regardless of public theme setting

### Auth Error Handling
- Login failure (wrong password, etc.): toast notification
- Unauthenticated /admin access: redirect to login with "Please log in to continue" message
- After successful login: redirect to admin dashboard home (overview with content counts, recent messages)
- Logout: confirmation dialog ("Are you sure?"), then redirect to public site

### Claude's Discretion
- Toast notification library/implementation choice
- Admin dashboard home layout and exact content counts displayed
- Login card exact styling (border radius, shadow depth, etc.)
- Hamburger menu animation style
- Loading states during auth operations

</decisions>

<specifics>
## Specific Ideas

- Admin dashboard should always be dark mode — creates clear visual separation between "editing" and "viewing"
- Public nav is a hybrid: anchor links for single-page feel, but project detail pages are separate routes
- Theme toggle cycles through three states (light/dark/system) via icon — not a dropdown

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-12*

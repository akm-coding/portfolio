# Roadmap: AKM Portfolio

## Milestones

- v1.0 **Core Portfolio** - Phases 1-4 (shipped 2026-03-14)
- **v1.1 Enhancement** - Phases 5-8 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 Core Portfolio (Phases 1-4) - SHIPPED 2026-03-14</summary>

### Phase 1: Foundation
**Goal**: A working Next.js app with Supabase connected, functional auth flow, theme toggle, and a responsive navigation shell that protects admin routes
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, DSGN-01
**Success Criteria** (what must be TRUE):
  1. Admin can log in with email/password and with GitHub OAuth, and the session persists across browser refresh
  2. Visiting any /admin route while unauthenticated redirects to the login page
  3. Dark/light/system theme toggle works with no flash of unstyled content on page load
  4. Navigation shell renders on all screen sizes (mobile, tablet, desktop) with appropriate responsive behavior
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md -- Project scaffolding with Supabase auth
- [x] 01-02-PLAN.md -- Theme system and navigation shell

### Phase 2: Public Portfolio
**Goal**: Visitors can browse the complete portfolio -- hero, projects, experience, education, skills, and contact -- all rendering real data from Supabase
**Depends on**: Phase 1
**Requirements**: PROF-01, PROF-02, PROF-03, PROJ-01, PROJ-02, PROJ-05, EXPR-01, EDUC-01, SKLL-01, CTCT-01, CTCT-02, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees hero section with name, title, tagline, and profile photo, plus an about section with bio text and resume download link
  2. Visitor can browse projects in a filterable grid, click into individual project detail pages, and filter by tech stack
  3. Visitor sees work experience as a timeline and education with institution/degree/dates
  4. Visitor sees skills organized by category with proficiency indicators
  5. Visitor can submit a contact form (name, email, message) and sees social links
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md -- Database schema, types, query functions, seed data
- [x] 02-02-PLAN.md -- Hero, About, Experience, Education, Skills sections
- [x] 02-03-PLAN.md -- Projects section with filtering and detail pages
- [x] 02-04-PLAN.md -- Contact section with form and home page composition

### Phase 3: Admin Dashboard
**Goal**: Site owner can manage all portfolio content through a protected dashboard without touching code
**Depends on**: Phase 2
**Requirements**: PROF-04, PROJ-03, PROJ-04, EXPR-02, EDUC-02, SKLL-02, CTCT-03, CTCT-04
**Success Criteria** (what must be TRUE):
  1. Admin can edit profile info, summary text, and upload a profile photo
  2. Admin can create, edit, and delete projects with screenshot uploads
  3. Admin can create, edit, and delete experience and education entries
  4. Admin can add, edit, delete, and reorder skills
  5. Admin can view and manage contact messages
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md -- Shared admin components, server actions, query mutations
- [x] 03-02-PLAN.md -- Profile edit and Projects CRUD
- [x] 03-03-PLAN.md -- Experience, Education, Skills CRUD
- [x] 03-04-PLAN.md -- Messages inbox and dashboard overview

### Phase 4: Polish & Launch
**Goal**: The portfolio feels polished with smooth animations, ranks well in search engines, and is deployed to production
**Depends on**: Phase 3
**Requirements**: DSGN-02, DSGN-04
**Success Criteria** (what must be TRUE):
  1. Pages have smooth Framer Motion transitions and sections reveal on scroll
  2. Every public page has proper meta tags, Open Graph data, and the site has a generated sitemap
  3. Site is deployed to Vercel and accessible at a public URL
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md -- Motion animations: scroll reveal, hero stagger, hover effects
- [x] 04-02-PLAN.md -- SEO: metadata, OG tags, sitemap, robots.txt, favicon, JSON-LD

</details>

### v1.1 Enhancement (In Progress)

**Milestone Goal:** Add animated stats, GitHub integration, visitor analytics, and English/Myanmar language support to make the portfolio more dynamic and accessible.

- [ ] **Phase 5: Animated Statistics** - Admin-managed counters with spring-animated count-up on scroll
- [ ] **Phase 6: GitHub Integration** - Pinned repos display and contribution heatmap with ISR caching
- [ ] **Phase 7: Visitor Analytics** - Page view tracking with admin dashboard and time-range filters
- [ ] **Phase 8: Multi-Language Support** - English/Myanmar toggle with cookie-based persistence

## Phase Details

### Phase 5: Animated Statistics
**Goal**: Visitors see animated statistics counters that the owner manages through the admin dashboard
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: STAT-01, STAT-02, STAT-03, STAT-04
**Success Criteria** (what must be TRUE):
  1. Admin can create a statistic entry with label, value, suffix, and icon, and it appears on the public site
  2. Admin can edit, delete, and reorder statistics, and changes reflect on the public site
  3. Statistics count up with spring animation when scrolled into view for the first time
  4. Statistics section displays responsively -- stacked on mobile, row on desktop
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md -- Database, types, queries, server actions, and admin CRUD page with drag-and-drop
- [ ] 05-02-PLAN.md -- Public animated statistics section with count-up on scroll

### Phase 6: GitHub Integration
**Goal**: Visitors see the owner's GitHub activity -- pinned repos and contribution history -- without stale or rate-limited data
**Depends on**: Phase 5
**Requirements**: GH-01, GH-02, GH-03, GH-04, GH-05, GH-06
**Success Criteria** (what must be TRUE):
  1. Public site displays up to 6 pinned repos with name, description, language, stars, and forks, each linking to GitHub
  2. Public site displays a contribution heatmap graph whose colors match the current dark/light theme
  3. A stats summary row shows total contributions, repos, and stars
  4. GitHub data is ISR-cached so pages load fast and API rate limits are not hit on every request
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Visitor Analytics
**Goal**: Owner can see how many people visit the portfolio and which pages are most popular, tracked without third-party services
**Depends on**: Phase 6
**Requirements**: ANLYT-01, ANLYT-02, ANLYT-03, ANLYT-04, ANLYT-05, ANLYT-06
**Success Criteria** (what must be TRUE):
  1. Each public page load fires a client-side tracking call that records the page view in Supabase
  2. Unique visitors are approximated via anonymous hash (no personally identifiable data stored)
  3. Admin dashboard shows total page views and unique visitors with 7d/30d/all time-range filters
  4. Admin dashboard shows per-page breakdown and sparkline trend charts
  5. Tracking is client-side only, so bots and prefetches do not inflate numbers
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Multi-Language Support
**Goal**: Visitors can browse the portfolio in English or Myanmar, with the language choice remembered across sessions
**Depends on**: Phase 7
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06
**Success Criteria** (what must be TRUE):
  1. A language toggle button in the navbar switches between English and Myanmar instantly
  2. Language preference persists across sessions via cookie -- returning visitors see their chosen language
  3. All static UI text (nav items, headings, labels, buttons, footer) is translated to both languages
  4. Database content (projects, experience, education) remains in English regardless of language setting
  5. Myanmar text renders correctly with proper Unicode font across platforms
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7 -> 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-12 |
| 2. Public Portfolio | v1.0 | 4/4 | Complete | 2026-03-12 |
| 3. Admin Dashboard | v1.0 | 4/4 | Complete | 2026-03-14 |
| 4. Polish & Launch | v1.0 | 2/2 | Complete | 2026-03-14 |
| 5. Animated Statistics | v1.1 | 0/2 | Planning complete | - |
| 6. GitHub Integration | v1.1 | 0/? | Not started | - |
| 7. Visitor Analytics | v1.1 | 0/? | Not started | - |
| 8. Multi-Language Support | v1.1 | 0/? | Not started | - |

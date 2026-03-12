# Roadmap: AKM Portfolio

## Overview

Build a dynamic developer portfolio for Aung Kaung Myat with a protected admin dashboard, powered by Next.js, Supabase, Shadcn UI, and Framer Motion. The roadmap follows a foundation-first approach: authentication and infrastructure, then public-facing portfolio pages, then admin CRUD, then animation and SEO polish. Each phase delivers a coherent, verifiable capability that builds on the previous.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Project scaffolding, Supabase setup, authentication, theme system, and responsive layout shell (completed 2026-03-12)
- [ ] **Phase 2: Public Portfolio** - All visitor-facing pages rendering real data from Supabase with contact form
- [ ] **Phase 3: Admin Dashboard** - Protected CRUD interface for managing all portfolio content
- [ ] **Phase 4: Polish & Launch** - Framer Motion animations, SEO optimization, and production deployment

## Phase Details

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
- [ ] 01-01-PLAN.md — Project scaffolding with Supabase auth (email/password + GitHub OAuth, middleware route protection)
- [ ] 01-02-PLAN.md — Theme system (dark/light/system toggle) and navigation shell (public navbar + admin sidebar)

### Phase 2: Public Portfolio
**Goal**: Visitors can browse the complete portfolio -- hero, projects, experience, education, skills, and contact -- all rendering real data from Supabase
**Depends on**: Phase 1
**Requirements**: PROF-01, PROF-02, PROF-03, PROJ-01, PROJ-02, PROJ-05, EXPR-01, EDUC-01, SKLL-01, CTCT-01, CTCT-02, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees hero section with name, title, tagline, and profile photo, plus an about section with bio text and resume download link
  2. Visitor can browse projects in a filterable grid, click into individual project detail pages, and filter by tech stack
  3. Visitor sees work experience as a timeline and education with institution/degree/dates
  4. Visitor sees skills organized by category with proficiency indicators
  5. Visitor can submit a contact form (name, email, message) and sees social links (GitHub, LinkedIn, email, phone)
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Admin Dashboard
**Goal**: Site owner can manage all portfolio content through a protected dashboard without touching code
**Depends on**: Phase 2
**Requirements**: PROF-04, PROJ-03, PROJ-04, EXPR-02, EDUC-02, SKLL-02, CTCT-03, CTCT-04
**Success Criteria** (what must be TRUE):
  1. Admin can edit profile info, summary text, and upload a profile photo
  2. Admin can create, edit, and delete projects with screenshot uploads via Supabase Storage
  3. Admin can create, edit, and delete experience and education entries
  4. Admin can add, edit, delete, and reorder skills
  5. Admin can view and manage contact messages, and receives email notification on new submissions
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Polish & Launch
**Goal**: The portfolio feels polished with smooth animations, ranks well in search engines, and is deployed to production
**Depends on**: Phase 3
**Requirements**: DSGN-02, DSGN-04
**Success Criteria** (what must be TRUE):
  1. Pages have smooth Framer Motion transitions and sections reveal on scroll
  2. Every public page has proper meta tags, Open Graph data, and the site has a generated sitemap
  3. Site is deployed to Vercel and accessible at a public URL
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-12 |
| 2. Public Portfolio | 0/3 | Not started | - |
| 3. Admin Dashboard | 0/2 | Not started | - |
| 4. Polish & Launch | 0/1 | Not started | - |

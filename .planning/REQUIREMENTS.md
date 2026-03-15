# Requirements: AKM Portfolio

**Defined:** 2026-03-12
**Core Value:** Visitors instantly understand Aung Kaung Myat's capabilities and experience through a polished, animated portfolio that the owner can update anytime without touching code.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: Admin can log in with email and password
- [x] **AUTH-02**: Admin can log in with GitHub OAuth
- [x] **AUTH-03**: Admin session persists across browser refresh
- [x] **AUTH-04**: All /admin routes are protected by middleware

### Profile

- [x] **PROF-01**: Hero section displays name, title, tagline, and profile photo
- [x] **PROF-02**: About/summary section with bio text
- [x] **PROF-03**: Resume download link
- [x] **PROF-04**: Admin can edit profile info, summary, and upload photo

### Projects

- [x] **PROJ-01**: Projects displayed in filterable grid with title, description, tech tags, and links
- [x] **PROJ-02**: Individual project detail pages with full description and images
- [x] **PROJ-03**: Admin can create, edit, and delete projects
- [x] **PROJ-04**: Admin can upload project screenshots via Supabase Storage
- [x] **PROJ-05**: Visitors can filter projects by tech stack

### Experience

- [x] **EXPR-01**: Work experience displayed as timeline with company, role, dates, and description
- [x] **EXPR-02**: Admin can create, edit, and delete experience entries

### Education

- [x] **EDUC-01**: Education displayed with institution, degree, field, and dates
- [x] **EDUC-02**: Admin can create, edit, and delete education entries

### Skills

- [x] **SKLL-01**: Skills displayed by category with proficiency indicators
- [x] **SKLL-02**: Admin can add, edit, delete, and reorder skills

### Contact

- [x] **CTCT-01**: Contact form with name, email, and message fields
- [x] **CTCT-02**: Social links displayed (GitHub, LinkedIn, email, phone)
- [ ] **CTCT-03**: Admin receives email notification on new contact submission (deferred to v2)
- [x] **CTCT-04**: Admin can view and manage contact messages in dashboard

### Design & UX

- [x] **DSGN-01**: Dark/light/system theme toggle with smooth transitions
- [x] **DSGN-02**: Framer Motion page transitions and scroll reveal animations
- [x] **DSGN-03**: Responsive design across mobile, tablet, and desktop
- [x] **DSGN-04**: SEO optimization with meta tags, Open Graph, and sitemap

## v1.1 Requirements

### Statistics

- [x] **STAT-01**: Admin can create, edit, delete, and reorder statistic entries (label, value, suffix, icon)
- [ ] **STAT-02**: Public site displays statistics section with spring-animated count-up triggered on scroll into view
- [ ] **STAT-03**: Count-up animation triggers only once per page load (not on every scroll)
- [ ] **STAT-04**: Statistics section displays in responsive grid (stacked on mobile, row on desktop)

### GitHub

- [x] **GH-01**: Public site displays up to 6 pinned GitHub repositories with name, description, primary language, stars, and forks
- [x] **GH-02**: Each pinned repo links to its GitHub page
- [ ] **GH-03**: Public site displays GitHub contribution heatmap graph
- [ ] **GH-04**: Contribution graph colors adapt to current dark/light theme
- [x] **GH-05**: GitHub stats summary row shows total contributions, repos, and stars
- [x] **GH-06**: GitHub data is ISR-cached (not fetched live on every request)

### Analytics

- [ ] **ANLYT-01**: Page views are tracked on each public page load via same-origin API route
- [ ] **ANLYT-02**: Unique visitors are approximated via anonymous visitor hash (IP + user-agent)
- [ ] **ANLYT-03**: Admin dashboard shows total page views and unique visitors with time-range filters (7d, 30d, all)
- [ ] **ANLYT-04**: Admin dashboard shows per-page view breakdown
- [ ] **ANLYT-05**: Admin dashboard includes sparkline trend charts showing traffic over time
- [ ] **ANLYT-06**: Tracking is client-side only (no bot/prefetch pollution)

### Internationalization

- [ ] **I18N-01**: Language toggle button in navbar switches between English and Myanmar
- [ ] **I18N-02**: Language preference persists across sessions via cookie
- [ ] **I18N-03**: All static UI text (nav, headings, labels, buttons) is translated to both languages
- [ ] **I18N-04**: Database content (projects, experience, education) remains untranslated
- [ ] **I18N-05**: Myanmar text renders correctly with appropriate Unicode font (e.g., Noto Sans Myanmar)
- [ ] **I18N-06**: No URL/routing changes — locale is cookie-based with no path prefixes

## v2 Requirements

### Content

- **CONT-01**: Blog/article section with markdown support
- **CONT-02**: Testimonials section from clients/colleagues

### Enhancements

- **ENH-01**: Public view counters on project detail pages (social proof)
- **ENH-02**: Translatable database content (dual-language admin input)
- **ENH-03**: Contact form submission analytics alongside page views
- **UXEN-01**: Command palette for quick navigation (Cmd+K)
- **UXEN-02**: Drag-and-drop reordering in admin

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog/CMS content | Not core to portfolio purpose |
| Public user accounts | Only admin (site owner) needs auth |
| 3D/WebGL effects | Performance risk, high complexity |
| AI chatbot | Gimmicky, not valuable for portfolio |
| Real-time analytics | WebSocket complexity for infrequently checked dashboard |
| Mobile app | Web-first, responsive handles mobile |
| Google Analytics / third-party analytics | Privacy concerns, ad-blocker blocked, self-hosted sufficient |
| URL-based locale routing (/en/, /my/) | Overkill for 2-language portfolio |
| GitHub OAuth for data fetching | PAT is simpler for single-user data |
| Detailed analytics (referrers, devices, sessions) | Scope creep; simple page views sufficient |

## Traceability

### v1 (Phases 1-4)

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| PROF-01 | Phase 2 | Complete |
| PROF-02 | Phase 2 | Complete |
| PROF-03 | Phase 2 | Complete |
| PROF-04 | Phase 3 | Complete |
| PROJ-01 | Phase 2 | Complete |
| PROJ-02 | Phase 2 | Complete |
| PROJ-03 | Phase 3 | Complete |
| PROJ-04 | Phase 3 | Complete |
| PROJ-05 | Phase 2 | Complete |
| EXPR-01 | Phase 2 | Complete |
| EXPR-02 | Phase 3 | Complete |
| EDUC-01 | Phase 2 | Complete |
| EDUC-02 | Phase 3 | Complete |
| SKLL-01 | Phase 2 | Complete |
| SKLL-02 | Phase 3 | Complete |
| CTCT-01 | Phase 2 | Complete |
| CTCT-02 | Phase 2 | Complete |
| CTCT-03 | Phase 3 | Deferred to v2 |
| CTCT-04 | Phase 3 | Complete |
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 4 | Complete |
| DSGN-03 | Phase 2 | Complete |
| DSGN-04 | Phase 4 | Complete |

**v1 Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0

### v1.1 (Phases 5-8)

| Requirement | Phase | Status |
|-------------|-------|--------|
| STAT-01 | Phase 5 | Complete |
| STAT-02 | Phase 5 | Pending |
| STAT-03 | Phase 5 | Pending |
| STAT-04 | Phase 5 | Pending |
| GH-01 | Phase 6 | Complete |
| GH-02 | Phase 6 | Complete |
| GH-03 | Phase 6 | Pending |
| GH-04 | Phase 6 | Pending |
| GH-05 | Phase 6 | Complete |
| GH-06 | Phase 6 | Complete |
| ANLYT-01 | Phase 7 | Pending |
| ANLYT-02 | Phase 7 | Pending |
| ANLYT-03 | Phase 7 | Pending |
| ANLYT-04 | Phase 7 | Pending |
| ANLYT-05 | Phase 7 | Pending |
| ANLYT-06 | Phase 7 | Pending |
| I18N-01 | Phase 8 | Pending |
| I18N-02 | Phase 8 | Pending |
| I18N-03 | Phase 8 | Pending |
| I18N-04 | Phase 8 | Pending |
| I18N-05 | Phase 8 | Pending |
| I18N-06 | Phase 8 | Pending |

**v1.1 Coverage:**
- v1.1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-15 after v1.1 roadmap creation*

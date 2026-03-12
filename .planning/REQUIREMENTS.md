# Requirements: AKM Portfolio

**Defined:** 2026-03-12
**Core Value:** Visitors instantly understand Aung Kaung Myat's capabilities and experience through a polished, animated portfolio that the owner can update anytime without touching code.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: Admin can log in with email and password
- [ ] **AUTH-02**: Admin can log in with GitHub OAuth
- [ ] **AUTH-03**: Admin session persists across browser refresh
- [ ] **AUTH-04**: All /admin routes are protected by middleware

### Profile

- [ ] **PROF-01**: Hero section displays name, title, tagline, and profile photo
- [ ] **PROF-02**: About/summary section with bio text
- [ ] **PROF-03**: Resume download link
- [ ] **PROF-04**: Admin can edit profile info, summary, and upload photo

### Projects

- [ ] **PROJ-01**: Projects displayed in filterable grid with title, description, tech tags, and links
- [ ] **PROJ-02**: Individual project detail pages with full description and images
- [ ] **PROJ-03**: Admin can create, edit, and delete projects
- [ ] **PROJ-04**: Admin can upload project screenshots via Supabase Storage
- [ ] **PROJ-05**: Visitors can filter projects by tech stack

### Experience

- [ ] **EXPR-01**: Work experience displayed as timeline with company, role, dates, and description
- [ ] **EXPR-02**: Admin can create, edit, and delete experience entries

### Education

- [ ] **EDUC-01**: Education displayed with institution, degree, field, and dates
- [ ] **EDUC-02**: Admin can create, edit, and delete education entries

### Skills

- [ ] **SKLL-01**: Skills displayed by category with proficiency indicators
- [ ] **SKLL-02**: Admin can add, edit, delete, and reorder skills

### Contact

- [ ] **CTCT-01**: Contact form with name, email, and message fields
- [ ] **CTCT-02**: Social links displayed (GitHub, LinkedIn, email, phone)
- [ ] **CTCT-03**: Admin receives email notification on new contact submission
- [ ] **CTCT-04**: Admin can view and manage contact messages in dashboard

### Design & UX

- [ ] **DSGN-01**: Dark/light/system theme toggle with smooth transitions
- [ ] **DSGN-02**: Framer Motion page transitions and scroll reveal animations
- [ ] **DSGN-03**: Responsive design across mobile, tablet, and desktop
- [ ] **DSGN-04**: SEO optimization with meta tags, Open Graph, and sitemap

## v2 Requirements

### Analytics

- **ANLT-01**: View count per project page
- **ANLT-02**: Basic visitor analytics dashboard

### Content

- **CONT-01**: Blog/article section with markdown support
- **CONT-02**: Testimonials section from clients/colleagues

### UX Enhancements

- **UXEN-01**: Command palette for quick navigation (Cmd+K)
- **UXEN-02**: Drag-and-drop reordering in admin
- **UXEN-03**: GitHub integration to auto-fetch repos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog/CMS content | Scope creep — not core to portfolio purpose for v1 |
| Multi-language (i18n) | English only, unnecessary complexity |
| Public user accounts | Only admin (site owner) needs auth |
| 3D/WebGL effects | Performance risk, high complexity |
| AI chatbot | Gimmicky, not valuable for portfolio |
| Real-time features | No need for websockets/realtime in portfolio |
| Mobile app | Web-first, responsive handles mobile |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| AUTH-04 | — | Pending |
| PROF-01 | — | Pending |
| PROF-02 | — | Pending |
| PROF-03 | — | Pending |
| PROF-04 | — | Pending |
| PROJ-01 | — | Pending |
| PROJ-02 | — | Pending |
| PROJ-03 | — | Pending |
| PROJ-04 | — | Pending |
| PROJ-05 | — | Pending |
| EXPR-01 | — | Pending |
| EXPR-02 | — | Pending |
| EDUC-01 | — | Pending |
| EDUC-02 | — | Pending |
| SKLL-01 | — | Pending |
| SKLL-02 | — | Pending |
| CTCT-01 | — | Pending |
| CTCT-02 | — | Pending |
| CTCT-03 | — | Pending |
| CTCT-04 | — | Pending |
| DSGN-01 | — | Pending |
| DSGN-02 | — | Pending |
| DSGN-03 | — | Pending |
| DSGN-04 | — | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 0
- Unmapped: 27 ⚠️

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after initial definition*

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
- [ ] **DSGN-02**: Framer Motion page transitions and scroll reveal animations
- [x] **DSGN-03**: Responsive design across mobile, tablet, and desktop
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
| Blog/CMS content | Scope creep -- not core to portfolio purpose for v1 |
| Multi-language (i18n) | English only, unnecessary complexity |
| Public user accounts | Only admin (site owner) needs auth |
| 3D/WebGL effects | Performance risk, high complexity |
| AI chatbot | Gimmicky, not valuable for portfolio |
| Real-time features | No need for websockets/realtime in portfolio |
| Mobile app | Web-first, responsive handles mobile |

## Traceability

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
| DSGN-02 | Phase 4 | Pending |
| DSGN-03 | Phase 2 | Complete |
| DSGN-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after roadmap creation*

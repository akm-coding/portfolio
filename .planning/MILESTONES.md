# Milestones

## v1.0 — Core Portfolio

**Status:** Complete
**Completed:** 2026-03-14
**Phases:** 1–4 (12 plans)
**Duration:** ~52 minutes

### What Shipped
- Foundation: Supabase auth (email/password), dark/light/system theme, responsive layout shell
- Public Portfolio: Hero, projects, experience, education, skills, contact form
- Admin Dashboard: CRUD for profile, projects, experience, education, skills, messages
- Polish & Launch: Framer Motion animations, SEO metadata, OG images, favicon

### Key Decisions
- Supabase for auth + database (no standalone Postgres)
- Shadcn UI (Tailwind-native) over MUI
- Admin forced dark theme, independent of public preference
- Client wrapper pattern for animating server components
- Next.js ImageResponse API for OG/favicon generation

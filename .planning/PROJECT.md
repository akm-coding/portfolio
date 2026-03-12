# AKM Portfolio

## What This Is

A dynamic, modern developer portfolio for Aung Kaung Myat — a full stack developer specializing in mobile (React Native) and frontend. The site showcases projects, work experience, education, and skills with a clean design, smooth Framer Motion animations, and dark/light/system theme toggle. It includes a protected admin dashboard for CRUD management of all portfolio content, backed by Supabase.

## Core Value

Visitors instantly understand Aung Kaung Myat's capabilities and experience through a polished, animated portfolio that the owner can update anytime without touching code.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dynamic portfolio site with Next.js, Shadcn UI, and Framer Motion
- [ ] Dark/light/system theme toggle with smooth transitions
- [ ] CRUD management for projects, experience, education, summary, and skills
- [ ] Protected admin dashboard with email/password + GitHub OAuth (Supabase Auth)
- [ ] Contact form that stores messages in Supabase + social links (GitHub, LinkedIn, email, phone)
- [ ] Responsive design across all devices
- [ ] SEO optimization with Next.js metadata
- [ ] Deployment on Vercel

### Out of Scope

- Blog/CMS content — not needed for v1, portfolio-focused only
- Multi-language/i18n — English only for now
- Analytics dashboard — can add later
- Public user accounts — only admin (site owner) needs auth

## Context

- Owner is Aung Kaung Myat, full stack developer based in Chiang Mai, Thailand
- Currently working at Geek Squad Studio (Bangkok) as Full Stack Developer (Feb 2025–present)
- Previous roles: Mid-Senior Mobile Dev at Myan Ants, Mid Mobile Dev at Theory IT Solutions, Junior-Mid Mobile Dev at ACE Data Systems
- Strong skills: React, React Native, Next.js, TypeScript, Node.js, Tailwind CSS, Shadcn UI, Prisma, PostgreSQL, MongoDB, AWS, Firebase
- Existing portfolio at akm-personal-site.vercel.app — this replaces it
- GitHub: akm-coding
- LinkedIn: aung-kaung-myat-b41200242

## Constraints

- **Tech stack**: Next.js, Shadcn UI, Framer Motion, Tailwind CSS, Supabase (decided by owner)
- **Hosting**: Vercel (free tier compatible)
- **Auth**: Supabase Auth with email/password + GitHub OAuth
- **Database**: Supabase (hosted PostgreSQL)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase over standalone Postgres | Built-in auth, storage, and realtime — reduces boilerplate | — Pending |
| Admin dashboard over headless CMS | Full control, no third-party dependency, familiar patterns | — Pending |
| Shadcn UI over MUI | Tailwind-native, composable, better with Next.js app router | — Pending |
| Dark/light/system theme toggle | Modern UX expectation, showcases frontend skill | — Pending |

---
*Last updated: 2026-03-12 after initialization*

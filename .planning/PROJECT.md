# AKM Portfolio

## What This Is

A dynamic, modern developer portfolio for Aung Kaung Myat — a full stack developer specializing in mobile (React Native) and frontend. The site showcases projects, work experience, education, and skills with a clean design, smooth Framer Motion animations, and dark/light/system theme toggle. It includes a protected admin dashboard for CRUD management of all portfolio content, backed by Supabase.

## Core Value

Visitors instantly understand Aung Kaung Myat's capabilities and experience through a polished, animated portfolio that the owner can update anytime without touching code.

## Requirements

### Validated

- Dynamic portfolio site with Next.js, Shadcn UI, and Framer Motion — v1.0
- Dark/light/system theme toggle with smooth transitions — v1.0
- CRUD management for projects, experience, education, summary, and skills — v1.0
- Protected admin dashboard with email/password (Supabase Auth) — v1.0
- Contact form that stores messages in Supabase + social links — v1.0
- Responsive design across all devices — v1.0
- SEO optimization with Next.js metadata — v1.0
- DM Sans font, always-visible sticky navbar — v1.0+

### Active

- [ ] Animated statistics with manual counters managed in admin
- [ ] GitHub integration: pinned repos + contribution graph
- [ ] Visitor analytics: simple page views & unique visitors in admin
- [ ] Multi-language support: English/Myanmar with toggle button in navbar

### Out of Scope

- Blog/CMS content — not needed, portfolio-focused only
- Public user accounts — only admin (site owner) needs auth
- Detailed analytics (referrers, device breakdown) — simple page views sufficient for now

## Current Milestone: v1.1 Enhancement

**Goal:** Add animated stats, GitHub integration, visitor analytics, and English/Myanmar language support to make the portfolio more dynamic and accessible.

**Target features:**
- Animated statistics counters (admin-managed)
- GitHub pinned repos + contribution heatmap
- Simple page view tracking with admin dashboard
- English/Myanmar language toggle

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

| DM Sans font over Geist | Cleaner, more professional feel for portfolio | — Pending |
| Always-visible sticky navbar | Better UX than hide-on-scroll for portfolio navigation | — Pending |

---
*Last updated: 2026-03-15 after v1.1 milestone start*

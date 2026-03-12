# Project Research Summary

**Project:** Developer Portfolio with Admin Dashboard
**Domain:** Personal portfolio / developer showcase
**Researched:** 2026-03-12
**Confidence:** HIGH

## Executive Summary

This is a developer portfolio website with a protected admin dashboard for content management, built as a two-zone monolith in Next.js 15. The approach is well-established: a statically-rendered public site for performance and SEO, backed by Supabase for database, auth, and file storage, with an authenticated admin area for CRUD operations. The owner has already selected the core stack (Next.js, Shadcn UI, Tailwind CSS, Framer Motion, Supabase, Vercel), and research confirms these are the right choices -- no exotic integrations or unproven technologies are involved.

The recommended build approach is foundation-first: set up Supabase with Row Level Security, authentication, and the theme system before building any pages. Public-facing portfolio pages come next using Server Components with ISR caching, followed by the admin dashboard with Server Actions for CRUD. Animations and SEO polish come last. This order respects hard dependencies (auth before admin, schema before pages) and avoids the common pitfall of over-investing in admin UI at the expense of the public site.

The key risks are security-related: unprotected admin routes and missing RLS policies on Supabase tables. Both are preventable by establishing security patterns in Phase 1 and testing with unauthenticated access throughout development. The other significant risk is client component overuse, which would undermine Next.js performance benefits. Default to Server Components and only reach for `"use client"` when interactivity demands it.

## Key Findings

### Recommended Stack

The stack is owner-decided and well-suited for this project. All technologies are mature, widely documented, and play well together. The supplementary stack fills gaps without adding unnecessary complexity.

**Core technologies:**
- **Next.js 15 (App Router):** Framework -- SSG/ISR for public pages, SSR for admin, Server Actions for mutations
- **Supabase:** Database + Auth + Storage -- eliminates need for separate backend, ORM, or auth library
- **Shadcn UI + Tailwind CSS 4:** UI layer -- copy-paste components, consistent design system, fast development
- **Framer Motion 11:** Animations -- page transitions, scroll reveals, hover effects
- **Vercel:** Hosting -- zero-config deployment for Next.js, ISR support, free tier sufficient

**Supplementary stack:**
- `react-hook-form` + `zod` for form handling and validation
- `next-themes` for dark/light mode toggle
- `resend` for contact form email notifications
- `date-fns` for date formatting
- `lucide-react` for icons (bundled with Shadcn UI)

**What to avoid:** Prisma (unnecessary ORM), Redux/Zustand (RSC handles data), NextAuth (Supabase Auth covers it), tRPC (Server Actions are simpler), Cloudinary (Supabase Storage suffices).

### Expected Features

**Must have (table stakes):**
- Hero section with name, title, tagline, CTA, profile photo
- Projects showcase with descriptions, tech tags, live/repo links
- Work experience timeline
- Skills display (categorized)
- Education section
- Contact form with Supabase storage
- Responsive design (mobile-first)
- Dark/light theme toggle
- SEO optimization (meta tags, Open Graph, sitemap)
- Resume download link

**Should have (differentiators):**
- Admin dashboard with full CRUD for all content sections
- Framer Motion animations (scroll reveals, page transitions, hover effects)
- Project detail pages with individual slugs
- Image upload via Supabase Storage
- Contact form email notifications via Resend
- Project filtering by tech stack/category

**Defer (v2+):**
- Blog/CMS, analytics dashboard, command palette, testimonials section, GitHub integration (auto-fetch repos), 3D/WebGL effects, i18n, public user accounts

### Architecture Approach

Two-zone monolith: public portfolio and admin dashboard live in one Next.js app, separated by route groups (`(public)`, `(admin)`, `(auth)`). Public pages are ISR-cached and require no auth. Admin pages are SSR with middleware-enforced authentication. Three distinct Supabase clients (browser, server, middleware) prevent auth context bugs. Server Actions handle all mutations with `revalidatePath` to bust ISR cache after admin edits.

**Major components:**
1. **Public Layout + Pages** -- statically rendered portfolio sections (hero, projects, experience, education, skills, contact)
2. **Admin Layout + CRUD Pages** -- authenticated dashboard with forms for managing all content entities
3. **Supabase Layer** -- database schema (6 tables), RLS policies, auth, storage for images/resume
4. **Server Actions** -- mutation layer between admin UI and Supabase, handles validation and cache revalidation

### Critical Pitfalls

1. **Unprotected admin routes** -- Implement Next.js middleware auth checks on all `/admin` routes in Phase 1. Supabase RLS as second defense layer.
2. **Missing Row Level Security** -- Enable RLS on every table immediately after creation. Public `SELECT` for anon, write restricted to authenticated admin. Test with anon key.
3. **Client component overuse** -- Default to Server Components. Only use `"use client"` for forms, animations, browser APIs. Compose server parents with client children.
4. **Animations blocking SSR/SEO** -- Keep Framer Motion in Client Components only. Content must be visible with JavaScript disabled. Never wrap entire pages in `motion.div`.
5. **Supabase client sprawl** -- Create exactly 3 client factories in `lib/supabase/`. Never call `createClient` outside these files.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation

**Rationale:** Everything depends on this -- auth, database, theme, and project scaffolding must exist before any features.
**Delivers:** Working Next.js app with Supabase connected, auth flow, theme system, root layout, navigation shell.
**Addresses:** Supabase setup, auth, theme toggle, responsive layout skeleton.
**Avoids:** Unprotected routes (pitfall #1), missing RLS (pitfall #2), Supabase client sprawl (pitfall #7), env var leaks (pitfall #10), theme flash (pitfall #5).

### Phase 2: Database Schema and Public Pages

**Rationale:** Public site is the product -- visitors see this, not the admin. Schema must exist before pages can render data. Seed data enables development of public pages without admin CRUD.
**Delivers:** All public-facing portfolio sections rendering real data from Supabase. Contact form functional.
**Addresses:** Hero, projects showcase, experience timeline, skills display, education, contact form, social links, resume download.
**Avoids:** Client component overuse (pitfall #4), inconsistent data fetching (pitfall #11), contact form spam (pitfall #6).

### Phase 3: Admin Dashboard

**Rationale:** With public pages done, admin CRUD maps directly to the data models already proven in Phase 2. Building admin after public pages ensures you know exactly what fields each entity needs.
**Delivers:** Protected admin area with CRUD forms for all content types, image upload, contact message viewing.
**Addresses:** Admin CRUD for projects/experience/education/skills/summary, image upload, message management.
**Avoids:** Over-engineering admin (pitfall #8), image URL handling (pitfall #9), admin mobile responsiveness (pitfall #12).

### Phase 4: Polish and Launch

**Rationale:** Animations, SEO, and performance optimization should come last -- they layer on top of working features without changing functionality.
**Delivers:** Framer Motion animations, complete SEO (meta tags, Open Graph, structured data, sitemap), performance optimization, responsive fine-tuning.
**Addresses:** Framer Motion animations, page transitions, scroll reveals, SEO optimization, performance tuning, project detail pages.
**Avoids:** Animation SSR conflicts (pitfall #3), animation jank (pitfall #14), missing OG tags (pitfall #13).

### Phase Ordering Rationale

- Auth and RLS must be established before any data access patterns are built -- security is a foundation concern, not a bolt-on.
- Public pages before admin because: (a) the public site is what matters to visitors, (b) building pages first validates the data model before admin forms codify it, (c) seed data via SQL is faster than building admin UI first.
- Animations last because they are enhancement-only and Framer Motion in Client Components can conflict with Server Component rendering if mixed too early.
- 4 phases (not 5) keeps the project lean -- this is a portfolio, not an enterprise app.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Supabase SSR auth setup with `@supabase/ssr` -- the three-client pattern has specific configuration requirements that vary by Supabase SDK version.
- **Phase 3:** Image upload flow with Supabase Storage -- needs research on signed URLs, bucket policies, and file size limits.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Public pages are straightforward Server Components with ISR -- well-documented Next.js patterns.
- **Phase 4:** Framer Motion animations and Next.js metadata API are thoroughly documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Owner-selected, all mainstream technologies, no exotic choices |
| Features | HIGH | Standard portfolio features, clear table stakes vs differentiators |
| Architecture | HIGH | Two-zone monolith is the established Next.js pattern for this use case |
| Pitfalls | HIGH | Well-known issues with documented prevention strategies |

**Overall confidence:** HIGH

### Gaps to Address

- **Supabase SDK version pinning:** `@supabase/ssr` is relatively new and API may shift -- verify latest docs at implementation time.
- **Resend free tier limits:** Confirm 100 emails/day is still the free tier limit at time of implementation.
- **Tailwind CSS 4 + Shadcn UI compatibility:** Tailwind v4 has breaking changes from v3 -- verify Shadcn UI components work with v4 configuration (CSS-first config vs `tailwind.config.js`).
- **ISR revalidation behavior:** Next.js 15 ISR behavior with App Router should be validated -- `revalidatePath` vs `revalidateTag` strategy for cache busting after admin edits.

## Sources

Research was conducted using model knowledge of established patterns for Next.js portfolio applications with Supabase backends. All recommended technologies are mainstream with extensive official documentation.

### Primary (HIGH confidence)
- Next.js App Router documentation -- routing, Server Components, Server Actions, ISR, metadata API
- Supabase documentation -- JS client, RLS, auth, storage, SSR helpers
- Shadcn UI documentation -- component installation, form patterns, theming

### Secondary (MEDIUM confidence)
- Framer Motion documentation -- animation patterns, SSR considerations
- Resend documentation -- email API, free tier details
- next-themes documentation -- configuration, SSR flash prevention

---
*Research completed: 2026-03-12*
*Ready for roadmap: yes*

# Architecture Research: Developer Portfolio with Admin Dashboard

## Architecture Pattern

**Two-Zone Monolith** — Public portfolio + admin dashboard in one Next.js app, separated by route groups.

- `/` — Public-facing portfolio (SSG/ISR, no auth required)
- `/admin` — Protected admin dashboard (SSR, auth required)

Single deployment on Vercel. Supabase handles all backend needs (database, auth, storage).

## Component Boundaries

| Component | Responsibility | Rendering | Auth |
|-----------|---------------|-----------|------|
| Public Layout | Navigation, footer, theme toggle | Static/ISR | No |
| Hero Section | Name, title, tagline, CTA | ISR | No |
| Portfolio Sections | Projects, experience, education, skills, about | ISR | No |
| Contact Form | Form submission, validation | Client | No |
| Admin Layout | Sidebar nav, auth guard | SSR | Yes |
| Admin CRUD Pages | Forms for managing content | SSR + Client | Yes |
| Auth Pages | Login, OAuth callback | Client | Partial |

## Data Flow

### 1. Public Read Flow
```
Browser → Next.js (ISR cached page)
  → Supabase (server-side at build/revalidate time)
  → Render static HTML with portfolio data
```

### 2. Admin CRUD Flow
```
Admin UI (Client Component)
  → React Hook Form + Zod validation
  → Server Action
  → Supabase (authenticated client)
  → Revalidate public page cache
  → Return success/error
```

### 3. Contact Form Flow
```
Visitor fills form (Client Component)
  → React Hook Form + Zod validation
  → Server Action
  → Store in Supabase `messages` table
  → Send email notification via Resend
  → Return success
```

### 4. Authentication Flow
```
Login page → Supabase Auth (email/password or GitHub OAuth)
  → Session cookie via @supabase/ssr
  → Middleware checks auth on /admin routes
  → Redirect to login if unauthenticated
```

## Recommended File Structure

```
src/
├── app/
│   ├── (public)/              # Public route group
│   │   ├── layout.tsx         # Public layout (nav, footer)
│   │   ├── page.tsx           # Homepage / portfolio
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx   # Project detail page
│   ├── (admin)/               # Admin route group
│   │   ├── layout.tsx         # Admin layout (sidebar, auth guard)
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Admin home
│   │   ├── projects/
│   │   │   ├── page.tsx       # List projects
│   │   │   ├── new/page.tsx   # Create project
│   │   │   └── [id]/page.tsx  # Edit project
│   │   ├── experience/
│   │   ├── education/
│   │   ├── skills/
│   │   ├── summary/
│   │   └── messages/
│   │       └── page.tsx       # View contact submissions
│   ├── (auth)/                # Auth route group
│   │   ├── login/page.tsx
│   │   └── auth/callback/route.ts  # OAuth callback
│   └── layout.tsx             # Root layout (providers, fonts)
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── public/                # Public page components
│   │   ├── hero.tsx
│   │   ├── projects-grid.tsx
│   │   ├── experience-timeline.tsx
│   │   ├── education-list.tsx
│   │   ├── skills-display.tsx
│   │   ├── contact-form.tsx
│   │   └── theme-toggle.tsx
│   └── admin/                 # Admin components
│       ├── sidebar.tsx
│       ├── data-table.tsx
│       └── forms/             # CRUD forms per entity
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server component client
│   │   └── middleware.ts      # Middleware client
│   ├── actions/               # Server Actions
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── skills.ts
│   │   ├── summary.ts
│   │   └── messages.ts
│   ├── validations/           # Zod schemas
│   └── utils.ts               # cn() helper, etc.
├── types/
│   └── supabase.ts            # Generated Supabase types
└── middleware.ts               # Auth middleware for /admin
```

## Patterns to Follow

### 1. Route Groups for Separation
Use `(public)`, `(admin)`, `(auth)` route groups — separate layouts, shared deployment.

### 2. Three Supabase Clients
- **Browser client** — for client components (auth UI, realtime)
- **Server client** — for server components and server actions (reads/writes)
- **Middleware client** — for auth checks in middleware

### 3. Server Actions for CRUD
Use Next.js Server Actions instead of API routes. Simpler, type-safe, works with `revalidatePath`.

### 4. ISR with On-Demand Revalidation
Public pages use ISR. When admin updates content via Server Action, call `revalidatePath('/')` to refresh the cached page.

### 5. Row Level Security (RLS)
Supabase RLS policies:
- Public tables: `SELECT` for everyone (anon key)
- Write operations: Only authenticated admin user
- Messages table: `INSERT` for everyone (contact form), `SELECT` for admin only

## Anti-Patterns to Avoid

| Anti-Pattern | Why | Instead |
|-------------|-----|---------|
| API routes for CRUD | Unnecessary boilerplate | Server Actions |
| Client-side fetching for public pages | Slow, bad SEO | Server Components with ISR |
| Single Supabase client | Auth context differs per environment | Three clients (browser, server, middleware) |
| Storing images in database | Bloats DB, slow | Supabase Storage + URL references |

## Database Schema Overview

```sql
-- Core content tables
profiles        (id, full_name, title, tagline, bio, avatar_url, resume_url, email, phone, location, github, linkedin)
projects        (id, title, slug, description, long_description, image_url, tech_stack[], live_url, github_url, featured, sort_order, created_at)
experience      (id, company, role, location, start_date, end_date, description, bullets[], sort_order)
education       (id, institution, degree, field, start_date, end_date, description, sort_order)
skills          (id, name, category, proficiency, sort_order)
messages        (id, name, email, message, read, created_at)
```

## Build Order (Dependencies)

| Phase | What | Depends On |
|-------|------|-----------|
| 1 | Next.js setup, Supabase config, auth, theme, layout | Nothing |
| 2 | Database schema, Supabase types, seed data | Phase 1 |
| 3 | Public pages (all portfolio sections) | Phase 1, 2 |
| 4 | Admin dashboard (CRUD for all entities) | Phase 1, 2 |
| 5 | Polish (animations, SEO, performance, responsive) | Phase 3, 4 |

## Scalability Considerations

- **ISR caching** means public site handles unlimited traffic without hitting Supabase
- **Supabase free tier** is generous for portfolio (500MB DB, 1GB storage, 50k auth users)
- **Vercel free tier** handles portfolio traffic easily
- **If outgrow:** Move to Supabase Pro, Vercel Pro — no architecture changes needed

---
*Researched: 2026-03-12*

# Architecture Research: v1.1 Feature Integration

**Domain:** Portfolio enhancement features (stats, GitHub, analytics, i18n)
**Researched:** 2026-03-15
**Confidence:** HIGH

## Existing Architecture Summary

The current app follows a clean pattern worth preserving:

```
src/
  app/
    (public)/          # Public route group - server components
      page.tsx         # Composes section components (Hero, About, Projects, etc.)
      layout.tsx       # PublicNavbar + JSON-LD structured data
      template.tsx     # Page transition wrapper
    admin/             # Protected route group - server components
      page.tsx         # Dashboard with StatCards (projects count, experience, unread msgs)
      layout.tsx       # AdminSidebar + auth redirect
      [entity]/        # CRUD pages per entity (projects, experience, education, skills, messages, profile)
    login/             # Email/password auth
  components/
    sections/          # Public page sections (server component fetches, client wrapper animates)
    admin/             # Admin forms, lists, stat-card
    layout/            # PublicNavbar (client), AdminSidebar (client), MobileNav
    motion/            # ScrollReveal, StaggerChildren (Framer Motion wrappers)
    contact/           # Contact form (client)
    theme/             # ThemeProvider (next-themes), ThemeToggle
    ui/                # Shadcn primitives (Button, Card, Input, etc.)
  lib/
    queries/           # Supabase data fetching functions (profile, projects, experiences, education, skills, messages)
    supabase/          # createClient() for server, client, middleware
    types/database.ts  # TypeScript interfaces matching DB tables
    motion.ts          # Shared Framer Motion variants (section, hero, stagger)
    utils.ts           # cn() utility
  actions/contact.ts   # Server action for contact form
  middleware.ts        # Session refresh + admin route protection (ADMIN_EMAIL check)
```

**Key patterns to follow for new features:**
- Server components fetch data via `lib/queries/*.ts` -> pass as props to client wrappers
- Client interactivity uses separate `*-animated` components (e.g., `hero-section.tsx` server fetches, `hero-section-animated.tsx` client renders)
- Framer Motion variants centralized in `lib/motion.ts`
- Admin CRUD follows: list page, new page, [id]/edit page, shared form component
- Admin sidebar links defined in `admin-sidebar.tsx` sidebarLinks array

## Feature Integration Architecture

### Feature 1: Animated Statistics Counters

**Integration point:** New section on public page + new admin CRUD page

```
New files:
  src/lib/queries/statistics.ts                        # getStatistics(), createStatistic(), updateStatistic(), deleteStatistic()
  src/components/sections/stats-section.tsx             # Server component - fetches stats
  src/components/sections/stats-section-animated.tsx    # Client - animated counters
  src/app/admin/statistics/page.tsx                     # Admin list
  src/app/admin/statistics/new/page.tsx                 # Create
  src/app/admin/statistics/[id]/edit/page.tsx           # Edit
  src/components/admin/statistic-form.tsx               # Shared form
  src/actions/statistics.ts                             # Server actions for CRUD

Modified files:
  src/lib/types/database.ts              # ADD Statistic interface
  src/app/(public)/page.tsx              # Add <StatsSection /> (after Hero or About)
  src/components/layout/admin-sidebar.tsx # Add "Statistics" to sidebarLinks
  src/lib/motion.ts                      # Add counter animation variants (optional)
```

**Database table: `statistics`**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, gen_random_uuid() |
| label | text | e.g. "Years Experience", "Projects Completed" |
| value | integer | The number to animate to |
| suffix | text, nullable | e.g. "+", "%", "K" |
| icon | text, nullable | Lucide icon name for display |
| display_order | integer | Ordering |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

**Animation approach:** Use Framer Motion's `useMotionValue` + `useTransform` + `useInView` to animate from 0 to target value when the section scrolls into view. This follows the existing `motion/react` import pattern.

```typescript
// stats-section-animated.tsx core pattern
"use client"
import { useRef, useEffect } from "react"
import { useInView, useMotionValue, useTransform, animate, motion } from "motion/react"

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string | null }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => Math.round(v))

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 1.5, ease: "easeOut" })
    }
  }, [isInView, motionValue, value])

  return (
    <motion.span ref={ref}>
      {/* Subscribe to rounded value */}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}
```

**Data flow:**
```
Admin: statistic-form -> server action -> Supabase INSERT/UPDATE statistics -> revalidatePath("/")
Public: StatsSection (server) -> getStatistics() -> pass array to StatsSectionAnimated (client)
```

---

### Feature 2: GitHub API Integration

**Integration point:** New section on public page. No database tables, no admin CRUD.

```
New files:
  src/lib/github.ts                                    # fetchPinnedRepos(), fetchContributionData()
  src/components/sections/github-section.tsx            # Server component - fetches from GitHub API
  src/components/sections/github-repos.tsx              # Client - repo cards with hover
  src/components/sections/github-contributions.tsx      # Client - contribution heatmap grid

Modified files:
  src/app/(public)/page.tsx              # Add <GitHubSection /> (after Projects or Skills)
```

**GitHub API approach:** Use GitHub GraphQL API because pinned repos and contribution calendar data are only available via GraphQL (not REST). Requires a `GITHUB_TOKEN` env var (personal access token with `read:user` scope).

```typescript
// lib/github.ts - single GraphQL query for both datasets
const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`
```

**Caching strategy:** Use Next.js `fetch` with `next: { revalidate: 3600 }` (1 hour revalidation). GitHub profile data changes infrequently. This keeps pages fast and stays well within the 5,000 requests/hour API limit.

**Contribution heatmap rendering:** CSS Grid of small colored squares. Map GitHub's contribution levels to Tailwind opacity classes on a green base. No charting library needed.

**Data flow:**
```
GitHubSection (server) -> lib/github.ts -> fetch GitHub GraphQL (cached 1hr)
  -> pass pinnedRepos to GitHubRepos (client)
  -> pass contributionData to GitHubContributions (client)
```

**No database table needed.** Data comes directly from GitHub.

---

### Feature 3: Simple Page View Analytics

**Integration point:** Tracking component in public layout + new admin page for viewing

```
New files:
  src/lib/queries/analytics.ts                 # insertPageView(), getAnalyticsSummary(), getPageViewsByDay()
  src/lib/types/database.ts                    # ADD PageView interface
  src/app/api/track/route.ts                   # POST endpoint for tracking beacon
  src/app/admin/analytics/page.tsx             # Admin analytics dashboard
  src/components/admin/analytics-chart.tsx      # Simple bar chart (client component)
  src/components/analytics/page-view-tracker.tsx  # Client component, fires on mount

Modified files:
  src/components/layout/admin-sidebar.tsx       # Add "Analytics" to sidebarLinks
  src/app/(public)/layout.tsx                   # Add <PageViewTracker /> component
```

**Why client-side tracking, not middleware:**
- Middleware runs on every request (prefetches, API calls, even with matchers). It would inflate counts.
- A client component fires once per actual page load, which is the metric we want.
- Client-side tracking naturally filters bots that do not execute JavaScript.

**Tracking implementation:**
1. `<PageViewTracker />` client component in public layout
2. On mount, sends a POST to `/api/track` with `window.location.pathname` and `document.referrer`
3. API route validates and inserts into `page_views` table
4. Uses `navigator.sendBeacon` for reliability (fires even on tab close)

**Database table: `page_views`**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, gen_random_uuid() |
| path | text | e.g. "/", "/projects/my-app" |
| referrer | text, nullable | document.referrer |
| created_at | timestamptz | Default now() |

Intentionally minimal. No user_agent storage (not needed for "simple" analytics). Unique visitors approximated by counting distinct days with views, not by fingerprinting.

**RLS policy for page_views:**
- `INSERT` for anon (public tracking)
- `SELECT` for authenticated admin only
- No `UPDATE` or `DELETE` from client side

**Admin dashboard display:**
- Total views: all time, last 7 days, last 30 days (SQL COUNT queries)
- Top pages by view count
- Views per day bar chart (last 30 days)
- Chart built with pure Tailwind divs (percentage-width bars). No Chart.js/Recharts -- one simple bar chart does not justify 40-200KB of bundle.

**Data flow:**
```
Tracking:  Page load -> PageViewTracker (client useEffect) -> POST /api/track -> Supabase INSERT
Admin:     analytics/page.tsx (server) -> getAnalyticsSummary() -> render StatCards + chart
```

**API route pattern (not server action):** Use a Route Handler (`app/api/track/route.ts`) instead of a server action because the tracker fires from a generic client component, not a form. Route Handlers are the correct pattern for programmatic POST requests.

---

### Feature 4: English/Myanmar Language Toggle

**Integration point:** Most invasive feature. Touches all public-facing components.

```
New files:
  src/lib/i18n/
    config.ts                              # LOCALES array, DEFAULT_LOCALE, Locale type
    dictionaries.ts                        # getDictionary(locale) loader function
    en.json                                # English translations
    my.json                                # Myanmar translations
  src/components/language/
    language-toggle.tsx                    # Toggle button (client component)
    language-provider.tsx                  # React context providing t() and locale

Modified files:
  src/app/layout.tsx                       # Read locale cookie, set <html lang="...">
  src/app/(public)/layout.tsx              # Wrap children with <LanguageProvider>
  src/components/layout/public-navbar.tsx   # Add <LanguageToggle /> next to <ThemeToggle />
  src/components/layout/mobile-nav.tsx      # Add <LanguageToggle /> in mobile menu
  ALL src/components/sections/*.tsx         # Replace hardcoded strings with t("key") calls
  src/components/contact/contact-form.tsx   # Translate labels, placeholders, validation messages
  src/app/(public)/page.tsx                # Footer text translation
```

**Approach: Cookie-based locale with React Context.**

Route-based i18n (`/en/...`, `/my/...`) would require restructuring all routes under a `[locale]` dynamic segment. This is overkill for a single-page portfolio where the only public routes are `/` and `/projects/[slug]`. Cookie-based is simpler and sufficient.

**Implementation:**

```typescript
// lib/i18n/config.ts
export const LOCALES = ["en", "my"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "locale"

// lib/i18n/dictionaries.ts
import en from "./en.json"
import my from "./my.json"
const dictionaries = { en, my } as const
export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en
}
```

```typescript
// components/language/language-provider.tsx
"use client"
import { createContext, useContext } from "react"
import type { Locale } from "@/lib/i18n/config"

type Dictionary = Record<string, Record<string, string>>
const I18nContext = createContext<{ locale: Locale; t: (section: string, key: string) => string }>()

export function LanguageProvider({ locale, dictionary, children }) {
  const t = (section: string, key: string) => dictionary[section]?.[key] ?? key
  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>
}
export const useI18n = () => useContext(I18nContext)
```

```typescript
// components/language/language-toggle.tsx
"use client"
import { useI18n } from "./language-provider"

export function LanguageToggle() {
  const { locale } = useI18n()
  const toggle = () => {
    const next = locale === "en" ? "my" : "en"
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    window.location.reload() // Simplest approach - server re-reads cookie on next request
  }
  return <button onClick={toggle}>{locale === "en" ? "MY" : "EN"}</button>
}
```

**What gets translated (UI chrome only):**
- Nav labels: "About", "Projects", "Experience", etc.
- Section headings: "About Me", "Featured Projects", etc.
- Button text: "Download Resume", "Send Message", "View Project"
- Form labels: "Name", "Email", "Message"
- Footer text

**What does NOT get translated (database content):**
- Project titles, descriptions, tech stacks
- Experience details (company, role, description)
- Education details
- Bio/tagline from profile
- Skill names

This is intentional. Translating DB content would require dual-language admin forms and is out of scope.

**Dictionary structure:**
```json
{
  "nav": {
    "about": "About",
    "projects": "Projects",
    "experience": "Experience",
    "education": "Education",
    "skills": "Skills",
    "contact": "Contact"
  },
  "hero": {
    "download_resume": "Download Resume"
  },
  "sections": {
    "about_title": "About Me",
    "projects_title": "Featured Projects",
    "experience_title": "Experience",
    "education_title": "Education",
    "skills_title": "Skills",
    "contact_title": "Get In Touch"
  },
  "contact": {
    "name_label": "Name",
    "email_label": "Email",
    "message_label": "Message",
    "send": "Send Message",
    "success": "Message sent successfully!"
  },
  "stats": {
    "title": "By The Numbers"
  },
  "github": {
    "title": "Open Source",
    "contributions": "contributions in the last year"
  }
}
```

**Myanmar font:** DM Sans does not support Myanmar script. Add `Noto Sans Myanmar` via `next/font/google` as a CSS variable, applied conditionally when `locale=my`. Load it alongside DM Sans in root layout (Next.js tree-shakes unused fonts).

**Data flow:**
```
User clicks toggle -> set cookie "locale=my" -> page reload
Root layout: cookies().get("locale") -> set <html lang="my">
Public layout: getDictionary(locale) -> wrap children with <LanguageProvider dictionary={dict}>
Section components: const { t } = useI18n() -> t("sections", "about_title")
```

---

## Component Boundary Summary

| Component | Type | Responsibility | New/Modified |
|-----------|------|---------------|--------------|
| StatsSection | Server | Fetch statistics from DB | NEW |
| StatsSectionAnimated | Client | Render animated counters on scroll | NEW |
| GitHubSection | Server | Fetch pinned repos + contributions from API | NEW |
| GitHubRepos | Client | Render repo cards with hover effects | NEW |
| GitHubContributions | Client | Render contribution heatmap grid | NEW |
| PageViewTracker | Client | Fire tracking beacon on page load | NEW |
| AnalyticsChart | Client | Render simple bar chart | NEW |
| LanguageProvider | Client | Provide t() function via React Context | NEW |
| LanguageToggle | Client | Switch locale cookie, reload page | NEW |
| PublicNavbar | Client | Add LanguageToggle next to ThemeToggle | MODIFIED |
| AdminSidebar | Client | Add Statistics + Analytics links | MODIFIED |
| All section components | Mixed | Use t() for UI strings | MODIFIED |
| Public layout | Server | Add PageViewTracker + LanguageProvider | MODIFIED |

## New Database Tables

```sql
-- 1. Statistics (admin-managed counters)
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read, admin write
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON statistics FOR SELECT USING (true);
CREATE POLICY "Admin write" ON statistics FOR ALL USING (auth.email() = current_setting('app.admin_email'));

-- 2. Page views (analytics tracking)
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_path ON page_views(path);

-- RLS: anon insert, admin read
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON page_views FOR SELECT USING (auth.email() = current_setting('app.admin_email'));
```

## New Environment Variables

| Variable | Purpose | Required By |
|----------|---------|-------------|
| GITHUB_TOKEN | GitHub GraphQL API authentication (PAT with `read:user` scope) | Feature 2: GitHub Integration |

No other new env vars needed. Existing Supabase credentials handle everything else.

## Recommended Build Order

Build order is determined by dependency chains and invasiveness:

| Order | Feature | Rationale |
|-------|---------|-----------|
| 1 | Animated Statistics | Follows existing CRUD pattern exactly. Self-contained: new section + admin pages. No modifications to existing components beyond adding to page.tsx and sidebar. Lowest risk. |
| 2 | GitHub Integration | Self-contained, no DB tables, no admin CRUD. One new server component + two client components. Only touches page.tsx to add section. |
| 3 | Page View Analytics | Slightly more cross-cutting (adds component to public layout, adds API route). Admin page is read-only (simpler than CRUD). Should exist before i18n so the tracker is in place. |
| 4 | Multi-Language (Last) | Most invasive -- modifies every public-facing component. Must be last so all sections (including new stats/GitHub sections) exist before the translation pass. Building i18n earlier would mean revisiting it for each subsequent feature. |

**Dependency chain:**
```
Statistics (standalone) ─────────────────────────────────┐
GitHub Integration (standalone) ─────────────────────────┤
Page View Analytics (standalone, but adds to layout) ────┤
                                                         ├─> i18n (must translate ALL sections)
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Middleware-based Analytics

**What people do:** Track page views in Next.js middleware since it intercepts all requests.
**Why it is wrong:** Middleware fires on prefetches, API calls, and static asset fallbacks. It inflates view counts and adds latency to every request. Cannot access client-side context like referrer.
**Do this instead:** Client component with `useEffect` that POSTs to an API route once on mount.

### Anti-Pattern 2: Route-based i18n for Single-Page Portfolio

**What people do:** Set up `/[locale]/` route structure with `next-intl`, duplicating all routes.
**Why it is wrong:** This portfolio has two public routes (`/` and `/projects/[slug]`). Route-based i18n adds significant complexity (generateStaticParams, middleware locale detection, URL prefix decisions, link prefixing) for minimal benefit.
**Do this instead:** Cookie-based locale with React Context. Toggle sets cookie, page reloads, server reads cookie.

### Anti-Pattern 3: Translating Database Content

**What people do:** Add locale columns or translation tables so project descriptions appear in Myanmar.
**Why it is wrong:** Doubles admin workload (maintain parallel content), doubles admin UI complexity, and technical content translates poorly. Scope creep.
**Do this instead:** Translate UI chrome only (headings, labels, buttons). DB content stays in English.

### Anti-Pattern 4: Heavy Charting Libraries for Simple Analytics

**What people do:** Install Recharts (200KB) or Chart.js (60KB) for one bar chart.
**Why it is wrong:** Massive bundle cost for rendering what amounts to colored rectangles with varying widths.
**Do this instead:** Tailwind-styled divs with percentage widths. Calculate max value server-side, render proportional bars.

### Anti-Pattern 5: Separate Animation Library for Counters

**What people do:** Install `react-countup` or use raw `requestAnimationFrame` for number animation.
**Why it is wrong:** The app already ships Framer Motion (`motion/react`). Adding another animation system is redundant and increases bundle size.
**Do this instead:** Use Framer Motion's `useMotionValue` + `animate` + `useTransform`. Same library, consistent API, already in the bundle.

## Sources

- Existing codebase analysis (primary source -- all architectural decisions derived from actual code patterns)
- GitHub GraphQL API: pinned repos available only via GraphQL `pinnedItems` field
- Framer Motion `useMotionValue` and `animate` APIs for counter animation
- Next.js App Router: Route Handlers vs Server Actions usage patterns
- Supabase RLS documentation for table policies

---
*Architecture research for: AKM Portfolio v1.1 Enhancement Features*
*Researched: 2026-03-15*

# Stack Research: v1.1 Enhancement Features

**Domain:** Portfolio enhancement -- animated stats, GitHub integration, visitor analytics, i18n
**Researched:** 2026-03-15
**Confidence:** HIGH

## Existing Stack (DO NOT change)

Already validated and in production. Listed for reference only:

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | App Router framework |
| React | 19.2.3 | UI library |
| Tailwind CSS | 4.2.1 | Styling |
| Motion (Framer Motion) | 12.36.0 | Animation |
| Supabase JS | 2.99.1 | Database, auth |
| Supabase SSR | 0.9.0 | Server-side Supabase |
| Shadcn UI | 4.0.5 | Component library |
| next-themes | 0.4.6 | Theme toggle |
| Sonner | 2.0.7 | Toast notifications |
| Lucide React | 0.577.0 | Icons |

## New Libraries to Add

Only **2 new packages** are needed for all 4 features.

### Feature 1: Animated Statistics Counters

**No new libraries needed.** The existing `motion` (v12.36.0) package includes `useMotionValue`, `useSpring`, `useTransform`, and `useInView` -- everything required for animated number counters.

**Implementation approach:**
- Use `useSpring` to animate from 0 to target value
- Use `useTransform` to round the spring value to integers
- Use `useInView` to trigger animation when the section scrolls into viewport
- Use `motion.span` to render the animated value without React re-renders

This is a ~30 line custom hook. No external library needed. Avoids the paid Motion+ `AnimateNumber` component entirely.

### Feature 2: GitHub API Integration

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| react-github-calendar | ^5.0.5 | GitHub contribution heatmap | Only actively maintained React component for GitHub-style contribution calendars. Supports React 18/19. Fetches contribution data automatically from GitHub public profiles -- no API token needed for the heatmap portion. Themed via CSS custom properties, works with dark/light mode. |

**Pinned repos: No library needed.** Use GitHub's GraphQL API directly via a Next.js server component or API route. The query is ~15 lines of GraphQL. Adding `octokit` (50KB+) for a single fetch call is unnecessary.

**Required infrastructure:**
- GitHub fine-grained Personal Access Token with `read:user` scope
- Store as `GITHUB_TOKEN` environment variable in Vercel + `.env.local`
- GraphQL API rate limit: 5,000 points/hour (far exceeds portfolio needs)
- Cache responses with Next.js `revalidate` (1 hour) to minimize API calls

**GraphQL query for pinned repos:**
```graphql
query {
  user(login: "akm-coding") {
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
  }
}
```

### Feature 3: Visitor Analytics

**No new libraries needed.** Use Supabase (already installed) directly.

**Implementation approach:**
- Create a `page_views` table in Supabase: `id`, `page_path`, `visitor_id` (hashed fingerprint from headers), `created_at`
- Next.js API route (POST) records views, called from a lightweight client component
- Supabase RPC (SQL function) handles aggregation (daily/weekly/monthly counts, unique visitors)
- Admin dashboard queries aggregated data via server components

**Why not Plausible/Umami/PostHog:**
- Project scope explicitly says "simple page views sufficient"
- A single Supabase table handles this without external service, cost, or GDPR implications
- Admin dashboard already exists for displaying data
- Full control over what is tracked

### Feature 4: Multi-Language Support (English/Myanmar)

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| next-intl | ^4.8.3 | i18n for Next.js App Router | The standard i18n library for Next.js App Router (2025-2026). ~2KB bundle size. Full Server Component support. TypeScript-safe translation keys. Cookie-based locale persistence built-in via `localePrefix: 'never'` mode -- stores locale in `NEXT_LOCALE` cookie without changing URLs. |

**Why next-intl over a custom solution:**
Even for just 2 languages, next-intl provides: message interpolation, Server Component support, middleware locale detection, and TypeScript safety for translation keys. Rolling your own i18n for the App Router means reimplementing all of this (middleware, RSC handling, cookie management) poorly.

**Configuration for cookie-based locale (no URL prefix):**
```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'my'],
  defaultLocale: 'en',
  localePrefix: 'never'  // Cookie-based, no /en or /my in URL
});
```

**File structure for translations:**
```
messages/
  en.json    # English translations
  my.json    # Myanmar translations
```

## Installation

```bash
# Only 2 new packages for all 4 features
npm install react-github-calendar next-intl
```

No new dev dependencies required.

## Environment Variables to Add

| Variable | Purpose | Where |
|----------|---------|-------|
| `GITHUB_TOKEN` | Fine-grained PAT for GitHub GraphQL API | Vercel env vars + `.env.local` |

No other new env vars needed. Supabase credentials already exist.

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `motion` hooks (existing) for counters | `react-countup` | Already have Motion installed. Adding another animation lib is redundant. Motion's `useSpring` gives smoother, more customizable spring-physics animations. |
| `react-github-calendar` for heatmap | `@uiw/react-heat-map` | react-github-calendar fetches GitHub data automatically and renders the exact GitHub-style calendar. @uiw/react-heat-map is generic and requires manual data fetching + styling to match GitHub's look. |
| `react-github-calendar` for heatmap | Custom SVG implementation | Unnecessary effort. The library handles responsive layout, color schemes, tooltips, and data fetching in ~5KB. |
| `next-intl` for i18n | Custom cookie + JSON files | next-intl handles Server Components, middleware, TypeScript safety. A custom solution would reimplement all of this with more bugs. Even for 2 languages, the DX benefit justifies ~2KB. |
| `next-intl` for i18n | `lingui` or `react-intl` | These are React-level i18n libraries, not Next.js App Router-aware. They do not handle RSC or middleware correctly without significant workarounds. |
| Supabase table for analytics | Plausible / Umami / PostHog | Overkill for "simple page views." Adds external dependency, potential cost, privacy concerns. Supabase is already the database. |
| GitHub GraphQL API (direct `fetch`) | `octokit` | octokit is a 50KB+ SDK. For one GraphQL query cached hourly, a simple `fetch` call is sufficient and adds zero bundle weight. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `react-countup` | Redundant -- Motion library already installed | `useSpring` + `useTransform` from `motion` |
| `octokit` / `@octokit/graphql` | 50KB+ SDK for a single query | Direct `fetch` to `https://api.github.com/graphql` |
| `next-i18next` | Pages Router only, does NOT work with App Router | `next-intl` |
| `i18next` + `react-i18next` | Not App Router-aware, requires client-side init hacks for RSC | `next-intl` |
| Plausible / Umami / Google Analytics | External dependency for what a Supabase table handles | Supabase `page_views` table |
| `framer-motion` (old package name) | Renamed to `motion`. Old package redirects but may cause version conflicts | Already using `motion@12.36.0` |
| Any cookie-consent library | Not tracking with third-party services, only first-party Supabase data | No cookie banner needed |

## Version Compatibility

| Package | Compatible With | Verified |
|---------|-----------------|----------|
| next-intl@4.8.3 | next@^12-16, react@^16-19, typescript@^5 | Peer deps checked via `npm view` |
| react-github-calendar@5.0.5 | react@^18-19 | Peer deps checked via `npm view` |
| motion@12.36.0 (existing) | react@19.x | Already installed and working |

All new packages are compatible with the current stack. No conflicts detected.

## Integration Points

How new features connect to existing code:

1. **Animated stats** -- New `statistics` table in Supabase with admin CRUD. Public page reads via server component. Client component animates with Motion hooks on scroll-into-view.

2. **GitHub integration** -- Server component or API route fetches from GitHub GraphQL (cached 1hr via `revalidate`). `react-github-calendar` is a drop-in client component for the heatmap. Pinned repos rendered as cards using existing Shadcn UI components.

3. **Visitor analytics** -- New `page_views` table in Supabase. Lightweight client component fires POST to API route on page load. Admin dashboard displays aggregated data via server component queries.

4. **i18n** -- `next-intl` middleware wraps the app. Translation JSON files in `messages/en.json` and `messages/my.json`. All existing hardcoded text extracted to translation keys. Navbar gets a language toggle button (EN/MY).

## Sources

- [Motion.dev useSpring docs](https://motion.dev/docs/react-use-spring) -- animated counter approach (HIGH confidence)
- [Motion.dev useTransform docs](https://motion.dev/docs/react-use-transform) -- value transformation (HIGH confidence)
- [react-github-calendar on GitHub](https://github.com/grubersjoe/react-github-calendar) -- v5.0.5, React 18/19 support (HIGH confidence)
- [react-github-calendar on npm](https://www.npmjs.com/package/react-github-calendar) -- version and peer deps verified (HIGH confidence)
- [next-intl routing configuration](https://next-intl.dev/docs/routing/configuration) -- `localePrefix: 'never'` mode (HIGH confidence)
- [next-intl App Router setup](https://next-intl.dev/docs/getting-started/app-router) -- integration guide (HIGH confidence)
- [GitHub GraphQL API docs](https://docs.github.com/en/graphql) -- pinned repos query structure (HIGH confidence)
- [GitHub GraphQL rate limits](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api) -- 5,000 points/hour with PAT (HIGH confidence)
- [GitHub pinned repos GraphQL gist](https://gist.github.com/DuvanVilladiego/16ec87c5c3fb8363e84afe78fb3cae8a) -- query reference (MEDIUM confidence)
- [BuildUI animated counter recipe](https://buildui.com/recipes/animated-counter) -- Motion hooks pattern (MEDIUM confidence)

---
*Stack research for: AKM Portfolio v1.1 enhancement features*
*Researched: 2026-03-15*

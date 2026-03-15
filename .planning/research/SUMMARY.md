# Project Research Summary

**Project:** AKM Portfolio v1.1 Enhancement Features
**Domain:** Developer portfolio enhancement (animated stats, GitHub integration, visitor analytics, i18n)
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

This is a feature enhancement project for an existing Next.js 16 portfolio application built with React 19, Supabase, Tailwind CSS 4, and Motion (Framer Motion). The codebase is clean, well-structured, and follows consistent patterns (server components fetch data, client components handle interactivity). The four target features -- animated statistics counters, GitHub API integration, simple page view analytics, and English/Myanmar language toggle -- are all well-understood problems with established implementation patterns. No architectural overhaul is needed; each feature integrates cleanly into the existing app structure.

The recommended approach requires only **2 new npm packages** (`react-github-calendar` and `next-intl`) plus **2 new Supabase tables** (`statistics` and `page_views`). The existing Motion library handles all animation needs. Supabase handles analytics without any external service. GitHub data comes from a single GraphQL query cached via ISR. The i18n implementation uses cookie-based locale storage without URL routing changes -- the right approach for a 2-language single-page portfolio. The key architectural decision is build order: the FEATURES and ARCHITECTURE research disagree on whether i18n should come first or last, but the evidence strongly favors building i18n last (after all new sections exist) to avoid rework.

The primary risks are: GitHub API rate limiting in production (mitigated by ISR caching and authenticated tokens), bot-inflated analytics (mitigated by client-side-only tracking), Myanmar font rendering issues across platforms (mitigated by preloading Noto Sans Myanmar via next/font), and translation key drift between English and Myanmar JSON files (mitigated by nested JSON structure and TypeScript checking). All risks have straightforward prevention strategies documented in detail.

## Key Findings

### Recommended Stack

The existing stack is production-ready and should not change. Only 2 new packages are needed for all 4 features, which is a strong signal that the current stack was well-chosen.

**New additions only:**
- **react-github-calendar** (v5.0.5): GitHub contribution heatmap -- the only maintained React component for GitHub-style contribution calendars, supports React 19, fetches data automatically
- **next-intl** (v4.8.3): i18n for Next.js App Router -- ~2KB, full Server Component support, TypeScript-safe keys, cookie-based locale without URL changes

**Explicitly avoided:** `react-countup` (Motion already handles this), `octokit` (50KB+ for one fetch call), `next-i18next` (Pages Router only), Plausible/Umami/Google Analytics (Supabase table is sufficient), any charting library (Tailwind divs for one bar chart).

**New env var:** `GITHUB_TOKEN` (fine-grained PAT, read-only, never `NEXT_PUBLIC_`).

### Expected Features

**Must have (table stakes):**
- Count-up animation on scroll into view, triggers once, admin-configurable values
- GitHub pinned repos (up to 6) with name, description, language, stars, forks, clickable links
- GitHub contribution heatmap (green squares)
- Page view tracking per page with unique visitor approximation
- Admin analytics dashboard with time-range filtering (7d, 30d, all)
- Language toggle in navbar, preference persisted via cookie
- All static UI text translated (nav, headings, buttons, labels); dynamic DB content stays English-only

**Should have (differentiators):**
- Spring-physics animation (not linear) for counters
- Contribution graph color-matched to site theme (dark/light mode)
- GitHub stats summary row (contributions this year, repos, stars)
- Myanmar font rendering with Noto Sans Myanmar
- Ad-blocker resilient analytics (same-origin, no third-party)

**Defer (v2+):**
- Public view counters on project pages
- Sparkline trends in analytics dashboard
- Translatable dynamic content (project descriptions in Myanmar)
- Blog/articles section
- Additional languages beyond EN/MY

### Architecture Approach

Each feature follows the existing codebase pattern: server component fetches data, passes props to a client component that handles interactivity. New features add to the existing route groups (`(public)` for public sections, `admin/` for CRUD pages) without restructuring. Two new Supabase tables (`statistics`, `page_views`) with RLS policies matching the existing auth pattern. GitHub data requires no database -- fetched directly via GraphQL and cached with ISR. The i18n layer uses React Context with a `LanguageProvider` in the public layout, reading locale from a cookie set by the toggle button.

**Major components:**
1. **StatsSection + StatsSectionAnimated** -- server fetches stats from DB, client animates counters on scroll
2. **GitHubSection + GitHubRepos + GitHubContributions** -- server fetches from GitHub GraphQL (cached 1hr), client renders repo cards and heatmap
3. **PageViewTracker + API route** -- client component fires POST on mount, API route inserts to Supabase
4. **LanguageProvider + LanguageToggle** -- React Context provides `t()` function, toggle sets cookie and reloads
5. **Admin pages** -- Statistics CRUD (follows existing entity pattern), Analytics dashboard (read-only)

### Critical Pitfalls

1. **GitHub API rate limiting in production** -- Unauthenticated GraphQL access is impossible; even authenticated calls burn through limits without caching. Always use ISR with `revalidate: 3600` and build a fallback UI for when the token expires.
2. **Bot-inflated analytics** -- Tracking in middleware or via server-side counting inflates numbers with prefetches and crawlers. Track only via client-side `useEffect` POST, which naturally excludes bots.
3. **Myanmar font rendering failures** -- Myanmar script requires special font support; fallback fonts render unreadable garbage (not just wrong sizing). Preload Noto Sans Myanmar via `next/font` from the start, test on Windows/macOS/Android.
4. **Translation key drift** -- Even with 2 languages, 100+ keys accumulate quickly. Use nested JSON structure by section, keep TypeScript checking, never translate DB content.
5. **Animated counter hydration mismatch** -- Server renders "0", client animates to target value, causing React hydration warnings. Wrap counters in client components, use `useInView({ once: true })`, respect `prefers-reduced-motion`.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Animated Statistics Counters
**Rationale:** Lowest risk, most self-contained feature. Follows the existing CRUD pattern exactly (new table, new admin pages, new public section). No external dependencies. Serves as a warm-up that validates the development workflow without touching existing components.
**Delivers:** Statistics Supabase table + admin CRUD + animated public section with spring-physics counters
**Addresses:** Admin-configurable stats, count-up animation, scroll-trigger, responsive grid
**Avoids:** Counter hydration mismatch (build AnimatedCounter component correctly from the start), counter re-animation on scroll (use `once: true`)
**Estimated effort:** 2-3 days

### Phase 2: GitHub Integration
**Rationale:** Self-contained, no database tables needed, no admin CRUD. Requires the owner to create a GitHub PAT (external dependency), but this can be done in parallel with Phase 1. Building this second gives the owner time to set up the token.
**Delivers:** GitHub section with pinned repos display + contribution heatmap, theme-aware colors, ISR caching
**Addresses:** Pinned repos with metadata, contribution graph, cached data, graceful fallback
**Avoids:** API rate limiting (ISR from day one), token exposure in client bundle (server-only fetch), deprecated `pinnedRepositories` field (use `pinnedItems`)
**Estimated effort:** 2-3 days

### Phase 3: Page View Analytics
**Rationale:** Slightly more cross-cutting (adds component to public layout, adds API route, adds admin page). Should be deployed before i18n so tracking data accumulates while building the language feature. The analytics admin page is read-only (simpler than CRUD).
**Delivers:** Page view tracking via client-side beacon + API route + Supabase table + admin analytics dashboard with time filters and bar chart
**Addresses:** Per-page view counts, time-range filtering, ad-blocker resilience, bot-free tracking
**Avoids:** Bot inflation (client-side only tracking), middleware over-counting (use useEffect, not middleware), analytics race conditions (atomic inserts), heavy charting libraries (Tailwind divs)
**Estimated effort:** 2-3 days

### Phase 4: Multi-Language Support (EN/MY)
**Rationale:** Most invasive feature -- modifies every public-facing component to replace hardcoded strings with `t()` calls. Must come last so all new sections from Phases 1-3 exist before the translation pass. Building this first would mean revisiting every component added in subsequent phases. Building it last means one comprehensive pass through all components.
**Delivers:** next-intl integration, cookie-based locale, navbar language toggle, Noto Sans Myanmar font, en.json + my.json translation files covering all static UI text
**Addresses:** Language toggle, session persistence, all static text translated, dynamic content unchanged, no URL routing changes
**Avoids:** Myanmar font rendering issues (preload font), translation key drift (nested JSON structure), route-based i18n complexity (cookie-based approach), scroll position reset on language switch (store and restore position)
**Estimated effort:** 3-4 days

### Phase Ordering Rationale

- **Dependencies flow forward:** Each phase is independent, but i18n must come after all UI sections exist to avoid rework. Statistics and GitHub create new sections that need translation keys.
- **Risk escalates gradually:** Phase 1 is the safest (existing patterns), Phase 4 is the most invasive (touches every component). This lets the team build confidence before tackling cross-cutting changes.
- **Analytics benefits from early deployment:** Phase 3 before Phase 4 means view tracking data accumulates during the i18n development period, giving the owner meaningful data sooner.
- **External dependency buffered:** The GitHub PAT (Phase 2) requires manual owner action. Placing it second gives time for setup without blocking development.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Multi-Language):** Myanmar font integration with `next/font`, exact translation key inventory across all components, cookie-based locale with next-intl v4.x (verify `localePrefix: 'never'` mode works without middleware). This is the most novel integration.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Statistics):** Follows existing CRUD pattern identically. Motion animation hooks are well-documented.
- **Phase 2 (GitHub):** Single GraphQL query + ISR caching is a solved problem. react-github-calendar is drop-in.
- **Phase 3 (Analytics):** Simple table + API route + admin page. Well-documented Supabase patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages verified via npm for version compatibility with Next.js 16 / React 19. Only 2 new deps. Sources are official docs and npm registry. |
| Features | HIGH | Feature scope is well-defined and tightly bounded. Clear table stakes vs. differentiators vs. anti-features. Multiple community references for each pattern. |
| Architecture | HIGH | Derived primarily from actual codebase analysis. New features follow existing patterns exactly. No architectural experiments. |
| Pitfalls | HIGH | All pitfalls are well-documented failure modes with established prevention strategies. Sources include official GitHub API docs, Supabase docs, and community case studies. |

**Overall confidence:** HIGH

### Gaps to Address

- **Myanmar translation content:** The actual Myanmar text for all UI strings needs to be written by someone fluent in Myanmar. This is a content task, not a technical one, but it gates Phase 4 completion.
- **GitHub PAT setup:** The owner must create a fine-grained Personal Access Token and add it to Vercel environment variables. This is a manual prerequisite for Phase 2.
- **next-intl v4.x without routing:** The architecture proposes a custom cookie-based approach instead of next-intl's built-in routing. During Phase 4 planning, verify whether next-intl's `localePrefix: 'never'` mode is sufficient or if a fully custom approach (React Context + manual cookie) is simpler for this use case.
- **Analytics rate limiting:** The API route `/api/track` needs basic rate limiting to prevent abuse. The exact implementation (IP-based, in-memory counter vs. Vercel Edge Config) should be decided during Phase 3 planning.
- **react-github-calendar theming:** Verify that the library's CSS custom properties integrate cleanly with the existing next-themes dark/light mode setup. May need a thin wrapper.

## Sources

### Primary (HIGH confidence)
- [Motion.dev useSpring/useTransform docs](https://motion.dev/docs/react-use-spring) -- animated counter approach
- [react-github-calendar GitHub repo](https://github.com/grubersjoe/react-github-calendar) -- v5.0.5 compatibility
- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router) -- i18n integration
- [GitHub GraphQL API docs](https://docs.github.com/en/graphql) -- pinnedItems, contributionsCollection
- [GitHub GraphQL rate limits](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api) -- 5,000 points/hour
- [Supabase RLS documentation](https://supabase.com/docs/guides/auth/row-level-security) -- table policies
- Existing codebase analysis -- all architectural decisions derived from actual code patterns

### Secondary (MEDIUM confidence)
- [BuildUI animated counter recipe](https://buildui.com/recipes/animated-counter) -- Motion hooks pattern
- [Space Jelly -- GitHub GraphQL Pinned Repos in Next.js](https://spacejelly.dev/posts/how-to-use-the-github-graphql-api-to-add-your-pinned-repositories-in-next-js-react) -- implementation pattern
- [Max Leiter -- Page views with Supabase + Next.js](https://maxleiter.com/blog/supabase-next-analytics) -- self-hosted analytics pattern
- [Noto Sans Myanmar on Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Myanmar) -- font availability
- [Unicode FAQ for Myanmar scripts](https://unicode.org/faq/myanmar.html) -- rendering requirements

### Tertiary (LOW confidence)
- [GitHub pinned repos GraphQL gist](https://gist.github.com/DuvanVilladiego/16ec87c5c3fb8363e84afe78fb3cae8a) -- query reference (needs verification against current API)

---
*Research completed: 2026-03-15*
*Ready for roadmap: yes*

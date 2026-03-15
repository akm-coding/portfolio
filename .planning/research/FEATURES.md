# Feature Research

**Domain:** Developer portfolio enhancement (v1.1 features)
**Researched:** 2026-03-15
**Confidence:** HIGH

## Feature Landscape

This research covers the four target features for v1.1: animated statistics counters, GitHub API integration, simple page view analytics, and English/Myanmar language toggle. Each is evaluated against what portfolio visitors and the site owner expect.

### Table Stakes (Users Expect These)

These are behaviors users assume will work correctly once a feature exists. Missing any of these makes the feature feel broken.

#### 1. Animated Statistics Counters

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Count-up animation on scroll into view | Every portfolio with stats animates them on scroll; static numbers look lifeless | LOW | Use Motion's `useInView` hook + `useSpring`/`useTransform` or manual `animate()` with `onUpdate`. The project already uses `motion` v12. |
| Configurable stat values in admin | Owner sets numbers like "5+ years experience", "20+ projects" without code | LOW | New Supabase table `statistics` with fields: label, value, suffix (e.g., "+"), icon, display_order |
| Animation triggers only once | Replaying animation every scroll feels janky | LOW | `useInView({ once: true })` -- single prop |
| Responsive grid layout | Stats section must look good on mobile (stacked) and desktop (row) | LOW | Standard Tailwind grid, already patterned in existing sections |

#### 2. GitHub Integration

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Display pinned repositories (up to 6) | Standard for dev portfolios; visitors want to see featured work | MEDIUM | GitHub GraphQL API query on `user.pinnedItems`. Requires a GitHub personal access token with `read:user` + `public_repo` scopes stored as env var. |
| Repo metadata: name, description, language, stars, forks | This is what people look at on GitHub; omitting any feels incomplete | LOW | All available in the same GraphQL query |
| Link to repo on GitHub | Visitors expect to click through to the actual code | LOW | Just render the `url` field from the API response |
| Contribution graph (heatmap) | The green squares are iconic; dev portfolios that show GitHub without them feel half-done | MEDIUM | GraphQL `contributionsCollection.contributionCalendar.weeks` returns day-level data. Render with CSS grid or SVG. |
| Cached/ISR data (not live on every request) | GitHub API has rate limits (5000/hr authenticated). Must cache. | LOW | Next.js ISR with `revalidate: 3600` (hourly) or similar. Server component fetches at build/revalidate time. |

#### 3. Simple Page View Analytics

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Track page views per page | The whole point of analytics; must count visits | LOW | Supabase table `page_views` with columns: path, timestamp, visitor_id (hashed). Insert on each page load via API route or middleware. |
| Unique visitor count (approximate) | Raw page views alone are misleading; need unique visitors | MEDIUM | Hash IP + user-agent into anonymous fingerprint. No cookies needed for basic uniqueness. Store as `visitor_hash` column. |
| Admin dashboard showing totals | Owner needs to see the numbers somewhere | MEDIUM | New admin page `/admin/analytics` with total views, unique visitors, views per page. Simple Supabase aggregation queries. |
| Time-range filtering (today, 7d, 30d, all) | Bare numbers without time context are useless | LOW | SQL `WHERE created_at >= now() - interval '7 days'`. Simple date filter in the admin UI. |
| Ad-blocker resilient | Third-party analytics get blocked. Self-hosted on same domain does not. | LOW | This is a natural advantage of the self-hosted approach with Supabase. API route on same origin = no blocking. |

#### 4. English/Myanmar Language Toggle

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Toggle button in navbar | Users need a visible, accessible way to switch language | LOW | Simple button/dropdown in navbar showing "EN" / "MY" |
| Persist preference across sessions | Switching language on every visit is frustrating | LOW | Store in cookie (not localStorage) so server components can read it. `cookies().get('locale')` in Next.js. |
| All static UI text translated | Headings, labels, button text, navigation -- everything static must be in both languages | MEDIUM | JSON translation files: `messages/en.json` and `messages/my.json`. Every hardcoded string must be keyed. |
| Dynamic content stays as-is | Projects, experience, etc. are entered once (likely in English). Do NOT require dual-entry for dynamic content. | LOW | Only static UI chrome gets translated. Database content remains single-language. |
| No URL/routing changes | For a 2-language portfolio, `/en/projects` vs `/my/projects` is overkill | LOW | Use next-intl in "no routing" mode -- locale from cookie, no path prefixes. |

### Differentiators (Competitive Advantage)

Features that go beyond baseline expectations and make the portfolio stand out.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Animated number with spring physics (not linear) | Spring-based counting feels premium vs. linear increment. Motion's `useSpring` gives this for free. | LOW | Already have Motion library. Use spring with `stiffness: 75, damping: 15`. |
| Contribution graph color-matched to theme | Most portfolio GitHub widgets ignore dark/light mode. Matching the heatmap to the site's theme looks polished. | LOW | Use CSS custom properties for the 5 intensity levels. Theme-switch already exists. |
| GitHub stats summary row | "X contributions this year, Y repos, Z stars" as a quick summary above the graph | LOW | Available in the same GraphQL query. Small UI addition, big perceived value. |
| Real-time view counter on pages (public, optional) | Some portfolios show "X views" on project pages. Social proof. | LOW | Already tracking in Supabase. Just expose count via server component. Make it toggleable in admin. |
| Myanmar font rendering support | Myanmar script (Zawgyi vs Unicode) can break on many systems. Ensuring proper Unicode rendering with a Myanmar-compatible font stack matters for the target audience. | LOW | Add a Myanmar Unicode font (e.g., Padauk or Noto Sans Myanmar) to `next/font`. Apply conditionally when locale is `my`. |
| Sparkline trends in analytics dashboard | Instead of just totals, a small 7-day or 30-day sparkline showing traffic trends | MEDIUM | Requires grouping page_views by day and rendering a small SVG/canvas chart. Consider a simple hand-rolled SVG over adding a charting library. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full Google Analytics integration | "Industry standard" analytics | GDPR/privacy concerns, ad-blocker blocked, overkill for a portfolio, requires cookie consent banner | Self-hosted Supabase analytics. Same-origin, no cookies, no consent needed, no third-party dependency. |
| Dual-language database content (translate projects, experience, etc.) | "True" bilingual site | Doubles admin workload, content quickly drifts out of sync, projects/companies are proper nouns that don't translate well | Translate only static UI text. Dynamic content stays in its original language. |
| URL-based locale routing (`/en/`, `/my/`) | SEO for multi-language | For a personal portfolio with 2 languages, the SEO benefit is negligible. Adds routing complexity, breaks existing links, complicates middleware. | Cookie-based locale with `<html lang="">` attribute. Search engines see the default language, which is fine for a portfolio. |
| GitHub OAuth for contribution data | "Use OAuth instead of PAT" | The portfolio only needs the owner's data. OAuth flow is for third-party apps accessing other users' data. A PAT is simpler and correct here. | Personal Access Token (fine-grained) stored as `GITHUB_TOKEN` env var. Read-only, minimal scopes. |
| Detailed analytics (referrers, devices, sessions, bounce rate) | "While we're building analytics..." | Scope creep. Building a mini-analytics platform is a rabbit hole. The owner wants simple numbers. | Track only: page path, timestamp, visitor hash. Three columns. That is it. Add complexity later if actually needed. |
| Auto-fetching ALL repos instead of pinned | "Show everything" | Most devs have dozens of repos including forks, tutorials, and abandoned projects. Showing all dilutes the portfolio. | Fetch only pinned repos (max 6). The owner curates what to show via GitHub's pin feature. |
| Live/realtime analytics updates | "See visitors in real-time" | Supabase Realtime adds WebSocket connections and complexity for a feature the owner will check once a day. | Simple server-rendered dashboard that refreshes on page load. Add a refresh button if needed. |

## Feature Dependencies

```
[Statistics Admin CRUD]
    └──requires──> [statistics Supabase table + API]
                       └──enables──> [Animated counters on public site]

[GitHub Token env var]
    └──requires──> [GitHub PAT created by owner]
                       └──enables──> [Pinned repos display]
                       └──enables──> [Contribution graph display]

[page_views Supabase table]
    └──enables──> [Page view tracking (middleware/API route)]
                       └──enables──> [Analytics admin dashboard]

[Translation JSON files (en.json, my.json)]
    └──requires──> [next-intl setup + provider]
                       └──enables──> [Language toggle in navbar]
                       └──enables──> [All static text translated]

[Existing navbar] ──integrates──> [Language toggle button]
[Existing admin layout] ──integrates──> [Statistics CRUD page]
[Existing admin layout] ──integrates──> [Analytics dashboard page]
[Existing theme system] ──enhances──> [Contribution graph theming]
```

### Dependency Notes

- **Animated counters require statistics table:** The admin needs to create/edit stat entries before the public site can display them. Database schema comes first.
- **GitHub features require PAT:** The owner must create a GitHub Personal Access Token and add it to Vercel env vars before any GitHub features work. This is a manual setup step.
- **Analytics dashboard requires page_views table:** Tracking must be recording data before the dashboard has anything to show. Deploy tracking first, dashboard second.
- **Language toggle requires translation files:** Every static string in the app must be extracted into JSON files. This touches nearly every component. It is the most cross-cutting change of the four features.
- **Language toggle does NOT conflict with other features:** But it does mean new strings added for statistics labels, analytics dashboard labels, and GitHub section headings also need translation keys.

## MVP Definition

### Launch With (v1.1 -- all four features)

All four features are scoped tightly enough to ship together. The "MVP" here is the simplest correct implementation of each.

- [ ] **Animated statistics counters** -- Admin CRUD for stats + count-up animation with `useInView`. ~2-3 days.
- [ ] **GitHub pinned repos** -- GraphQL fetch with ISR, card display with language/stars/forks. ~1-2 days.
- [ ] **GitHub contribution graph** -- Heatmap rendered from GraphQL data, theme-aware colors. ~1-2 days.
- [ ] **Simple page view tracking** -- API route inserts to Supabase, admin dashboard with totals and time filters. ~2-3 days.
- [ ] **English/Myanmar toggle** -- next-intl (no routing), cookie persistence, navbar button, translate all static strings. ~3-4 days.

### Add After Validation (v1.2+)

- [ ] **Public view counters on project pages** -- Only if owner wants social proof visible to visitors
- [ ] **Sparkline trends in analytics** -- Only if the owner actually checks analytics regularly
- [ ] **GitHub stats summary row** -- Low effort add-on once GitHub integration is working
- [ ] **Translatable dynamic content** -- Only if Myanmar-speaking visitors are a significant portion of traffic

### Future Consideration (v2+)

- [ ] **Blog/articles section** -- Explicitly out of scope per PROJECT.md, but natural next step if portfolio grows
- [ ] **Contact form analytics** -- Track form submission rates alongside page views
- [ ] **Additional languages** -- Infrastructure supports it via next-intl, but only add if there is actual demand

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Rationale |
|---------|------------|---------------------|----------|-----------|
| Animated statistics counters | MEDIUM | LOW | P1 | Quick win, visually impactful, isolated change |
| GitHub pinned repos | HIGH | MEDIUM | P1 | Core to developer portfolio identity |
| GitHub contribution graph | MEDIUM | MEDIUM | P1 | Iconic dev visual, pairs with pinned repos |
| Page view tracking (backend) | HIGH | LOW | P1 | Must start collecting data early |
| Analytics admin dashboard | MEDIUM | MEDIUM | P1 | Owner needs to see the data being collected |
| Language toggle (EN/MY) | HIGH | MEDIUM-HIGH | P1 | Most cross-cutting; touches every component but critical for Myanmar audience accessibility |

**Priority key:**
- P1: Must have for v1.1 launch (all four features are the stated scope)
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Implementation Order Recommendation

Build in this order to minimize rework and maximize early value:

1. **Language toggle (first)** -- Most cross-cutting change. If built last, every component touched by features 1-3 would need revisiting to add translation keys. Build the i18n infrastructure first, then all new UI is translatable from the start.

2. **Animated statistics** -- Isolated feature, no external dependencies beyond Supabase. Good warmup after i18n setup. New section + admin page, both translatable from day one.

3. **Page view analytics** -- Start tracking immediately so data accumulates while building the dashboard. Backend tracking (API route + table) first, then admin dashboard UI.

4. **GitHub integration** -- Requires owner to create a PAT (external dependency). Build last so the owner has time to set up the token. Pinned repos and contribution graph can be built together.

## Competitor Feature Analysis

| Feature | Typical Dev Portfolios | Premium Portfolios (e.g., Brittany Chiang, Lee Robinson) | Our Approach |
|---------|------------------------|----------------------------------------------------------|--------------|
| Stats section | Static numbers or basic count-up | Animated with spring physics, themed | Spring-animated count-up with Motion, admin-managed values |
| GitHub display | Link to profile or embed readme | Pinned repos with live data, contribution graph | GraphQL API, ISR-cached, theme-aware heatmap |
| Analytics | Google Analytics or none | Self-hosted (Umami, Plausible) or none visible | Self-hosted via Supabase, same-origin, privacy-friendly |
| Multi-language | Rarely (English only) | Occasionally (next-intl for global reach) | EN/MY toggle, cookie-stored, next-intl without routing |

## Sources

- [Motion useInView docs](https://www.framer.com/motion/use-in-view/) -- Animation trigger on scroll
- [Space Jelly -- GitHub GraphQL Pinned Repos in Next.js](https://spacejelly.dev/posts/how-to-use-the-github-graphql-api-to-add-your-pinned-repositories-in-next-js-react) -- Pinned repos implementation pattern
- [William Callahan -- GitHub Contribution Graph in Next.js](https://williamcallahan.com/blog/adding-github-contribution-graph-to-nextjs) -- Contribution graph implementation
- [GitHub GraphQL ContributionsCollection docs](https://developer.github.com/v4/object/contributionscollection/) -- API reference
- [Max Leiter -- Page views with Supabase + Next.js](https://maxleiter.com/blog/supabase-next-analytics) -- Self-hosted analytics pattern
- [Mark Conroy -- Simple analytics with Supabase](https://mark.ie/blog/how-i-built-a-simple-analytics-system-in-less-than-20-lines-of-javascript-with-supabase) -- Minimal analytics approach
- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router) -- i18n without routing
- [Next.js Internationalization guide](https://nextjs.org/docs/app/guides/internationalization) -- Official i18n guidance

---
*Feature research for: AKM Portfolio v1.1 enhancement features*
*Researched: 2026-03-15*

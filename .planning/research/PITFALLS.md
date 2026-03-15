# Pitfalls Research

**Domain:** v1.1 Enhancement Features for Next.js Portfolio (animated stats, GitHub integration, visitor analytics, multi-language)
**Researched:** 2026-03-15
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: GitHub API Rate Limiting Kills the Page in Production

**What goes wrong:**
Unauthenticated GitHub REST API requests are limited to 60 per hour per IP. On Vercel serverless, multiple visitors share IPs from Vercel's edge network, meaning the rate limit is exhausted extremely fast. The contribution graph is only available via the GraphQL API, which requires authentication -- there is zero unauthenticated access to GraphQL. If the GitHub token expires or is misconfigured, the entire GitHub section breaks silently or throws 401 errors.

**Why it happens:**
Developers start with unauthenticated REST calls during local development (where 60/hr feels fine) and only discover the problem in production. Or they use a Personal Access Token without caching, burning through the 5,000/hr authenticated limit on every page load.

**How to avoid:**
- Always use an authenticated GitHub Personal Access Token (fine-grained, read-only, stored as `GITHUB_TOKEN` env var on Vercel -- no `NEXT_PUBLIC_` prefix).
- Use a single GraphQL query to fetch both pinned repos and contribution calendar in one request.
- Cache the response in Supabase with a TTL of 1-6 hours. GitHub data changes at most daily.
- Use Next.js ISR with `revalidate: 3600` (1 hour) so the GitHub section is pre-rendered from cache.
- Build a fallback UI that shows "GitHub data temporarily unavailable" instead of breaking the page.

**Warning signs:**
- 403 responses from GitHub API in server logs.
- GitHub section loads in dev but is blank in production.
- `X-RateLimit-Remaining: 0` in response headers.

**Phase to address:**
GitHub Integration -- set up caching and token management from the very first implementation. Never ship without caching.

---

### Pitfall 2: Page View Analytics Inflated by Bots and Prefetching

**What goes wrong:**
Simple page view counters count bot crawlers (Google, Bing, SEO tools, uptime monitors), Next.js prefetch requests, and the developer's own visits during development. View counts become meaningless -- a portfolio with 10 real visitors shows 500 "views" from bots.

**Why it happens:**
The naive approach is to increment a counter on every request. Next.js `<Link>` components prefetch pages by default, meaning hovering over navigation links triggers "views" that never happened. Middleware-based tracking fires for every route including API routes and static assets.

**How to avoid:**
- Track views via a client-side `fetch` call in a `useEffect` that fires only after the page actually renders in a browser. This naturally excludes bots that don't execute JavaScript.
- Filter User-Agent strings on the server side as a secondary defense -- check for known bot patterns (Googlebot, Bingbot, etc.).
- Use a Supabase RPC function (PostgreSQL atomic increment) to avoid race conditions on concurrent writes.
- Exclude admin routes from tracking.
- Use a simple fingerprint (hashed IP + date) for unique visitor counting rather than cookies (avoids cookie consent complexity for a personal portfolio).

**Warning signs:**
- View counts spike dramatically on deploy (bots indexing).
- View counts increase even when you know nobody is visiting.
- Counts double on navigation (prefetch + actual visit).

**Phase to address:**
Visitor Analytics -- implement bot filtering and client-side tracking from day one. Adding it later means historical data is already polluted.

---

### Pitfall 3: Myanmar Font Causes Layout Shift and Rendering Issues

**What goes wrong:**
Myanmar script (Burmese) has complex rendering requirements -- conjunct consonants, medial forms, and stacked characters that many system fonts handle incorrectly. If Noto Sans Myanmar loads late, text renders in a fallback font with completely wrong glyph shapes (not just different sizing -- unreadable garbage). The font file is ~200KB+ which causes visible layout shift on slow connections.

**Why it happens:**
Developers add the Myanmar font as a secondary `next/font/google` import without considering that it only loads when Myanmar text is actually displayed. The flash of unstyled text is severe for complex scripts compared to Latin. Also, `next/font` subsets only support `latin`, `latin-ext`, etc. -- there is no `myanmar` subset option, so the entire font file downloads.

**How to avoid:**
- Use `next/font/google` to import Noto Sans Myanmar and apply it as a CSS variable in `layout.tsx`, preloading it alongside DM Sans even before the user switches languages. The font file is a one-time cost.
- Set `display: 'swap'` in the font config so text is visible immediately with fallback.
- Test Myanmar rendering on Windows (Myanmar Text font), macOS (Myanmar Sangam MN), and Android (Noto Sans Myanmar) -- each OS renders differently.
- Keep DM Sans for English content and Noto Sans Myanmar for Myanmar content using conditional CSS classes, not a global font swap.
- Set the `lang` attribute on `<html>` dynamically (`en` or `my`) so browsers apply correct text shaping.

**Warning signs:**
- Myanmar characters appear as boxes or question marks on some devices.
- Text wrapping looks broken with Myanmar content (line breaks in wrong places).
- Noticeable layout shift (CLS) when switching languages.
- Font file appears as a render-blocking resource in Lighthouse.

**Phase to address:**
Multi-Language -- font loading must be designed before any translation work begins. Font is the foundation; translations are the content.

---

### Pitfall 4: Translation Key Management Becomes Unmaintainable

**What goes wrong:**
Developers start with a flat JSON file of translations (`{ "hero.title": "..." }`) and within days have duplicate keys, missing translations, and no way to know which keys are actually used in the codebase. The Myanmar translations drift out of sync with English, and untranslated strings silently show English (or worse, the raw key) to Myanmar users.

**Why it happens:**
For a 2-language personal portfolio, developers skip proper i18n tooling ("it's just two files"). But even with two languages, the number of translatable strings across hero, about, projects, experience, education, skills, contact, and navigation adds up to 100+ keys quickly.

**How to avoid:**
- Use `next-intl` without i18n routing (no `/en/`, `/my/` URL segments needed). It supports App Router, provides type-safe translation keys, and handles missing translations gracefully. It is the standard for Next.js App Router i18n.
- Structure JSON files by section: `{ "hero": { "title": "...", "subtitle": "..." }, "nav": { ... } }` -- not flat keys.
- Store the language preference in `localStorage` (not URL), since this is a single-page portfolio, not a content site that needs SEO in multiple languages.
- Do NOT translate admin dashboard content -- it is used only by the owner who speaks both languages. Keep admin in English.
- Dynamic content from Supabase (projects, experience, etc.) should NOT be translated in v1.1. Only translate static UI strings. Translating database content requires a completely different architecture.

**Warning signs:**
- Switching language shows English text mixed with Myanmar text.
- Console warnings about missing translation keys.
- Adding a new section requires touching 5+ files.

**Phase to address:**
Multi-Language -- establish translation structure and conventions before writing any translations.

---

### Pitfall 5: Animated Counters Re-trigger or Cause Hydration Mismatch

**What goes wrong:**
Animated number counters (e.g., "5+ Years Experience", "20+ Projects") animate every time they scroll into view, creating a jarring UX. Or they animate from 0 on every page navigation because the component remounts. Or worse, the animation fires during SSR, causing a hydration mismatch between server-rendered "0" and client-rendered "5".

**Why it happens:**
Using Framer Motion's `whileInView` without `viewport={{ once: true }}` causes re-animation on every scroll past. Using `useState` for the animated value without considering server rendering. Running the counting animation during SSR produces different HTML than the client.

**How to avoid:**
- The existing codebase already has `defaultViewport` with `once: true` in `src/lib/motion.ts` -- use this consistently for counter animations.
- Use `useInView` from `motion/react` to trigger a counting animation only once. The animation itself should use `requestAnimationFrame` or Motion's `animate` function.
- Wrap the animated counter in a client component (`'use client'`) and render the final static value on the server to avoid hydration mismatches.
- Store counter values in Supabase (admin-managed) and fetch them server-side. The animation is client-side only.
- Respect `prefers-reduced-motion` -- show the final value instantly for users who disable animations.

**Warning signs:**
- Console hydration mismatch warnings on pages with counters.
- Counters restart animation when scrolling up and down.
- Counters flash "0" before animating to the correct value on page load.

**Phase to address:**
Animated Statistics -- build a reusable `AnimatedCounter` component with correct viewport behavior from the start.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding GitHub username in API calls | Quick setup | Cannot reuse for different profile | Acceptable -- personal portfolio, only one user |
| Storing page views in main Supabase DB | No additional service needed | Analytics queries mix with content queries | Acceptable -- portfolio will never have enough traffic for this to matter |
| Flat translation JSON (no nesting) | Simpler to start | Duplicate keys, no organization, hard to maintain | Never -- nesting costs nothing and prevents confusion |
| Skipping bot filtering for analytics | Faster implementation | Inflated, meaningless view counts from day one | Never -- add basic client-side-only tracking from the start |
| Using REST API instead of GraphQL for GitHub | Simpler auth setup | Multiple requests instead of one, higher rate limit consumption | Never -- GraphQL is better in every way for this use case |
| Caching GitHub data in memory (serverless) | No DB table needed | Cache lost on every cold start on Vercel, constant API calls | Never -- use Supabase or ISR |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub GraphQL API | Using a classic PAT with broad scopes | Use a fine-grained PAT with read-only access to public repos only. Never commit the token. Store as `GITHUB_TOKEN` (no `NEXT_PUBLIC_` prefix). |
| GitHub GraphQL API | Fetching contribution data for "all time" | `contributionsCollection` accepts `from` and `to` date params. Default is last year. Fetch only last year to keep response size small. |
| GitHub GraphQL API | Using `pinnedRepositories` (deprecated) | Use `pinnedItems(first: 6, types: REPOSITORY)` on the User object |
| Supabase RPC for view counts | Using `update` with read-then-write pattern | Create a PostgreSQL function that does `UPDATE ... SET views = views + 1` atomically and call via `supabase.rpc('increment_page_view', { page_slug })` |
| Supabase on Vercel | Assuming Supabase connection stays warm | Serverless functions cold-start; each invocation creates a new client. Use the existing `createServerClient` pattern from `@supabase/ssr`. |
| next/font/google | Loading Myanmar font only when language switches | Preload both fonts in `layout.tsx`. The Myanmar font should load on initial page load to avoid flash when user switches language. |
| next-intl | Using i18n routing for a portfolio | Use `next-intl` without routing (no `/en/` `/my/` URL segments). Portfolio SEO should stay on single URL. Store preference in localStorage. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching GitHub API on every page load without caching | Slow page loads, API rate limit errors | ISR with `revalidate` or Supabase cache with TTL | Immediately in production with any traffic |
| Animating too many counters simultaneously | Dropped frames, janky scroll on mobile | Limit to 3-4 counters visible at once; use `will-change: transform` sparingly | On low-end mobile devices |
| Loading both language JSON files eagerly | Larger initial bundle | Dynamically import the non-default language JSON with `import()` | When translation files grow beyond 20KB |
| Tracking page views in middleware | Every single request (including static assets, API calls) triggers a DB write | Track only in page components via client-side fetch | Immediately -- middleware fires for all routes |
| Large Myanmar font file (200KB+) | Slow initial load, poor LCP on mobile | Use `next/font` (auto-optimizes, self-hosts, adds preload), accept the cost | Noticeable on 3G connections |
| GitHub contribution heatmap rendering 365+ cells as individual DOM elements | Slow paint, high memory on mobile | Use SVG or Canvas for the heatmap, not 365 individual `<div>` elements | On mobile devices with large contribution data |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing GitHub PAT in client-side code | Token leaked, attacker can access repos | GitHub token must only be used in server components or API routes. Never prefix with `NEXT_PUBLIC_`. |
| Analytics endpoint without rate limiting | Attacker inflates view counts with script | Add basic rate limiting (IP-based, 10 requests/minute per IP) to the analytics API route |
| Admin statistics CRUD without auth check | Anyone can modify counter values | Reuse existing Supabase auth + middleware pattern -- all `/admin` routes already protected, extend to new tables |
| Storing raw IP addresses for analytics | Privacy concerns | Hash IPs before storing (SHA-256 with a salt). Or don't store IPs at all -- just increment counters. |
| GitHub token with write permissions | Compromised token can modify repos | Fine-grained PAT: read-only, public repos only. Rotate every 90 days. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Language toggle resets scroll position | User loses context, has to scroll back | Store scroll position before language switch, restore after re-render |
| No visual feedback during language switch | User unsure if toggle worked | Instant swap (translations should be preloaded). Brief transition animation. |
| Animated counters animate too slowly | User scrolls past before animation completes | Keep counter animations under 1.5 seconds. Use easing that front-loads visual change (easeOut). |
| GitHub section shows loading spinner for 2+ seconds | Looks broken, user moves on | With ISR or caching, data should be pre-rendered. No client-side loading state needed. |
| Myanmar text breaks card layouts | Cards have different heights in Myanmar vs English | Myanmar text is typically 10-20% longer than English equivalent. Test all layouts with Myanmar content. Use `min-h` instead of fixed heights. |
| Counter numbers unformatted | "1000000" is hard to read | Format with locale-aware formatting. Use `Intl.NumberFormat`. |
| Language toggle hard to find | Myanmar-speaking visitors never discover it | Place toggle prominently in navbar, next to theme toggle. Use flag icon or "EN/MY" text. |
| GitHub section empty for a while after deploy | No pinned repos = empty section | Add a "no pinned repos" fallback message. Or hide the section entirely if API returns empty. |

## "Looks Done But Isn't" Checklist

- [ ] **GitHub integration:** Token expiry handling -- PATs expire. Verify the section gracefully degrades when token is invalid, not a blank white area or error page.
- [ ] **GitHub contribution graph:** Timezone handling -- contributions are date-based. Verify the heatmap displays correctly; use UTC dates from the API consistently.
- [ ] **Analytics:** Bot filtering -- verify Google/Bing crawlers don't inflate counts. Test with `curl` that direct API hits without JS execution don't count.
- [ ] **Analytics:** Admin's own visits -- verify that admin dashboard navigation doesn't count as page views.
- [ ] **Language toggle:** Persistence -- verify language preference survives page refresh (localStorage) and new tab.
- [ ] **Language toggle:** Meta tags -- verify `<html lang="...">` updates dynamically, and OG/meta description stays in English for SEO.
- [ ] **Animated counters:** Mobile performance -- test on a real low-end device, not just desktop Chrome with throttling.
- [ ] **Animated counters:** Reduced motion -- verify counters respect `prefers-reduced-motion` media query (show final value instantly, no animation).
- [ ] **Myanmar font:** Windows rendering -- test on Windows where Myanmar font rendering is historically problematic.
- [ ] **Myanmar font:** Numerals -- decide whether to use Myanmar numerals or Western Arabic numerals in Myanmar mode. (Recommendation: Western Arabic -- more universally readable even for Myanmar speakers.)
- [ ] **Statistics admin:** Validation -- verify admin cannot enter negative numbers or non-numeric values for counters.
- [ ] **GitHub section:** Empty state -- verify behavior when user has no pinned repos or private contribution history.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| GitHub API rate limited in production | LOW | Add caching layer (Supabase table or ISR). Can be done without changing the UI. |
| Inflated analytics from bots | MEDIUM | Add bot filtering, but historical data is already polluted. Consider resetting counters or adding a "clean start" date. |
| Myanmar font not rendering correctly | LOW | Switch font source or add font-face fallback chain. Test on affected platforms. |
| Translation keys out of sync between EN/MY | MEDIUM | Audit both JSON files, add TypeScript type checking for keys. Retroactive but tedious. |
| Hydration mismatch from animated counters | LOW | Wrap in client component, render static value on server. Localized fix, no architecture change. |
| GitHub token expired or leaked | LOW | Revoke old token in GitHub settings, generate new fine-grained token, update Vercel env var. No code change needed. Site auto-recovers on next ISR revalidation. |
| Analytics race condition (lost increments) | MEDIUM | Retroactive fix: create Supabase RPC function for atomic increment, migrate existing code. Historical counts may be slightly off but going forward is correct. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| GitHub API rate limiting | GitHub Integration | Check `X-RateLimit-Remaining` header after deployment. Confirm ISR/cache is working via Vercel function logs. |
| Bot-inflated analytics | Visitor Analytics | Run `curl` against analytics endpoint -- should not increment view count. Compare counts against real traffic. |
| Myanmar font rendering | Multi-Language (font setup first) | Screenshot test on Windows, macOS, Android. No broken glyphs. CLS score under 0.1. |
| Translation key drift | Multi-Language (structure first) | TypeScript compilation catches missing keys. Both JSON files have identical key structure. |
| Counter hydration mismatch | Animated Statistics | No hydration warnings in browser console. View source shows final static value, not "0". |
| Counter re-animation on scroll | Animated Statistics | Scroll past counters, scroll back up -- animation does not replay. |
| Analytics race condition | Visitor Analytics | Open page in 10 tabs simultaneously -- Supabase count increments by exactly 10. |
| GitHub token in client bundle | GitHub Integration | Search production JS bundle output for token string. Must not appear anywhere in client code. |
| Language switch scroll reset | Multi-Language | Switch language mid-page -- scroll position is preserved. |
| Analytics in middleware (over-counting) | Visitor Analytics | Check Supabase `page_views` table -- only actual page slugs appear, no API routes or `_next` assets. |

## Sources

- [GitHub REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [GitHub GraphQL API rate limits](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api)
- [GitHub GraphQL API objects (pinnedItems, contributionsCollection)](https://docs.github.com/en/graphql/reference/objects)
- [Supabase atomic counter implementation](https://www.dineshs91.com/articles/implement-a-counter-in-supabase)
- [Supabase + Next.js page views pattern](https://codebycorey.com/blog/page-views-nextjs-supabase)
- [Burmese font issues and real-world consequences](https://www.localizationlab.org/blog/2019/3/25/burmese-font-issues-have-real-world-consequences-for-at-risk-users)
- [Unicode FAQ for Myanmar scripts](https://unicode.org/faq/myanmar.html)
- [Noto Sans Myanmar on Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+Myanmar)
- [Next.js font optimization case study](https://dev.to/snaka/degraded-performance-caused-by-nextjs-webfont-optimization-a-case-study-4h7g)
- [Motion useInView docs](https://motion.dev/docs/react-use-in-view)
- [Motion scroll animations docs](https://www.framer.com/motion/scroll-animations/)
- [Next.js bot detection with middleware](https://dev.to/ckeditor/how-to-detect-bot-traffic-using-nextjs-middleware-a-quick-guide-14o8)
- [next-intl without i18n routing](https://next-intl-docs.vercel.app/docs/getting-started/app-router/without-i18n-routing)
- Existing codebase: `src/lib/motion.ts` (viewport config with `once: true`), `src/app/layout.tsx` (font setup with DM Sans), `src/lib/supabase/middleware.ts` (auth pattern)

---
*Pitfalls research for: v1.1 Enhancement Features (animated stats, GitHub integration, analytics, multi-language)*
*Researched: 2026-03-15*

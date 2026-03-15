# Phase 6: GitHub Integration - Research

**Researched:** 2026-03-16
**Domain:** GitHub GraphQL API, contribution heatmap visualization, ISR caching
**Confidence:** HIGH

## Summary

This phase fetches GitHub data (pinned repos, contribution history, user stats) via the GitHub GraphQL API using a Personal Access Token (PAT), displays it on the public portfolio, and caches it with ISR to avoid rate limits. The data flow is: server-side fetch at build/revalidation time -> cached response -> client components for interactivity (heatmap tooltips, count-up animations).

The approach uses a single GraphQL query to fetch all GitHub data (pinned repos, contribution calendar, and stats) in one request. The contribution heatmap uses `react-activity-calendar` (the underlying rendering library of `react-github-calendar`) with server-fetched data passed as props, allowing full control over theming. ISR is achieved via Next.js `revalidate` route segment config on the page.

**Primary recommendation:** Use a single GitHub GraphQL query in a server-side data fetching function, render pinned repos as custom cards, use `react-activity-calendar` v3 for the heatmap with dark/light theme support, and set `export const revalidate = 3600` on the page for hourly ISR.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- GitHub-style cards: repo name with owner prefix, description, language, stars, forks
- Language indicator: colored dot + language name (using GitHub's language colors)
- External-link icon in the corner to open repo on GitHub (not whole-card clickable)
- Up to 6 repos displayed in a 3-column x 2-row grid on desktop
- Cards have subtle border/shadow consistent with existing card styles
- Full year (last 365 days) contribution heatmap matching GitHub profile page
- GitHub green color scheme -- instantly recognizable to developers
- Tooltips on hover: "X contributions on Mar 15, 2026"
- Month labels along the top (Jan, Feb, Mar...), no day labels on the side
- Colors adapt to dark/light theme while staying green-based
- Placed after Statistics, before Projects on the home page
- Arrangement: pinned repos grid on top, stats summary row in the middle, heatmap at the bottom
- Section heading: "My GitHub Activity" (heading only, no subtitle)
- Three stats shown: total contributions (last year), public repositories count, total stars received
- Inline text style: "523 contributions . 28 repos . 45 stars"
- Animated count-up on scroll (same pattern as statistics section)
- Positioned between pinned repos and contribution heatmap

### Claude's Discretion
- Exact card shadow/border styling and spacing
- Mobile responsive behavior (likely single column for repos)
- Heatmap scaling/sizing on mobile
- Empty state if GitHub API is unavailable
- ISR revalidation interval
- Error fallback behavior

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GH-01 | Public site displays up to 6 pinned GitHub repositories with name, description, primary language, stars, and forks | GitHub GraphQL `pinnedItems` query returns all needed fields; custom card components |
| GH-02 | Each pinned repo links to its GitHub page | GraphQL query returns `url` field on Repository; external-link icon pattern |
| GH-03 | Public site displays GitHub contribution heatmap graph | `react-activity-calendar` v3 with server-fetched `contributionCalendar` data |
| GH-04 | Contribution graph colors adapt to current dark/light theme | `react-activity-calendar` `theme` prop with `light` and `dark` color scales + `colorScheme` prop |
| GH-05 | GitHub stats summary row shows total contributions, repos, and stars | GraphQL query returns `totalContributions`, `repositories.totalCount`, aggregate star count |
| GH-06 | GitHub data is ISR-cached (not fetched live on every request) | `export const revalidate = 3600` on page or `unstable_cache` wrapping the fetch function |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-activity-calendar | ^3.0 | Contribution heatmap rendering | Purpose-built for GitHub-style heatmaps; supports dark/light themes, tooltips via renderBlock, custom color scales. Decoupled from data fetching so works with server-fetched data. |
| GitHub GraphQL API v4 | - | Fetch pinned repos, contributions, stats | Single query gets all data; REST API would require multiple calls and cannot get pinned repos |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | (already installed) | External link icon, star/fork icons | For repo card icons |
| motion/react | (already installed) | Count-up animation for stats row | Reuse existing useMotionValue + animate pattern from Phase 5 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-activity-calendar | Custom SVG heatmap | Much more work; react-activity-calendar handles month labels, responsive sizing, color scales, tooltips |
| react-activity-calendar | react-github-calendar | react-github-calendar fetches client-side; we want server-fetched ISR data |
| GraphQL API | REST API v3 | REST cannot fetch pinned repos; would need multiple endpoints; GraphQL gets everything in one call |

**Installation:**
```bash
npm install react-activity-calendar
```

No other new packages needed. The GitHub API is called via native `fetch`.

## Architecture Patterns

### Recommended Project Structure
```
src/
  lib/
    queries/
      github.ts              # Server-side GitHub GraphQL fetch function
    types/
      database.ts             # Add GitHub-related types
  components/
    sections/
      github-section.tsx      # Server component: fetches data, renders sub-components
      github-activity.tsx     # Client component: heatmap + stats with animations
    github/
      repo-card.tsx           # Server component: single pinned repo card
      github-stats-row.tsx    # Client component: animated count-up stats
      contribution-heatmap.tsx # Client component: react-activity-calendar wrapper
```

### Pattern 1: Server Component Data Fetch + Client Wrapper
**What:** Same pattern used for StatisticsSection -- server component fetches data, passes to client component for interactivity
**When to use:** When data needs ISR caching but UI needs client interactivity (animations, tooltips)
**Example:**
```typescript
// src/components/sections/github-section.tsx (server component)
import { getGitHubData } from '@/lib/queries/github'
import { GitHubActivity } from './github-activity'

export async function GitHubSection() {
  const data = await getGitHubData()
  if (!data) return null
  return <GitHubActivity data={data} />
}
```

### Pattern 2: Single GraphQL Query for All Data
**What:** One GraphQL query fetches pinned repos, contribution calendar, and stats in a single request
**When to use:** Minimize API calls and latency; all data needed at the same time
**Example:**
```typescript
// src/lib/queries/github.ts
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
            primaryLanguage {
              name
              color
            }
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
            }
          }
        }
      }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        totalCount
      }
      starredRepositoriesCount: repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes {
          stargazerCount
        }
      }
    }
  }
`

export async function getGitHubData() {
  const token = process.env.GITHUB_TOKEN
  if (!token) return null

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GITHUB_QUERY,
      variables: { username: 'akm-coding' },
    }),
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  })

  if (!res.ok) return null
  const json = await res.json()
  return json.data?.user ?? null
}
```

### Pattern 3: react-activity-calendar with Theme Support
**What:** Pass server-fetched contribution data to react-activity-calendar with dark/light theme colors
**When to use:** For the contribution heatmap
**Example:**
```typescript
// src/components/github/contribution-heatmap.tsx
'use client'
import ActivityCalendar from 'react-activity-calendar'
import { useTheme } from 'next-themes'

// Activity data type expected by react-activity-calendar
interface Activity {
  date: string    // 'YYYY-MM-DD'
  count: number
  level: number   // 0-4
}

const greenTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

export function ContributionHeatmap({ activities }: { activities: Activity[] }) {
  const { resolvedTheme } = useTheme()

  return (
    <ActivityCalendar
      data={activities}
      theme={greenTheme}
      colorScheme={resolvedTheme as 'light' | 'dark'}
      labels={{
        totalCount: '{{count}} contributions in the last year',
      }}
      renderBlock={(block, activity) => (
        // Wrap with tooltip component
        <Tooltip content={`${activity.count} contributions on ${formatDate(activity.date)}`}>
          {block}
        </Tooltip>
      )}
    />
  )
}
```

### Anti-Patterns to Avoid
- **Client-side GitHub API calls:** Never call the GitHub API from the browser -- exposes the PAT token and hits rate limits per visitor
- **Fetching inside useEffect:** Data should come from server components via ISR, not client-side fetches
- **Multiple separate API calls:** Use one GraphQL query instead of separate REST endpoints
- **Hardcoding GitHub username:** Use environment variable or config constant

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contribution heatmap | Custom SVG grid with month labels | react-activity-calendar v3 | Handles responsive sizing, month labels, color scaling, accessibility, edge cases (leap years, week alignment) |
| Tooltip on heatmap cells | Custom absolute-positioned div | Shadcn Tooltip or simple title attribute via renderBlock | Positioning, z-index, mobile behavior already handled |
| GitHub language colors | Manual color map | GitHub Linguist language colors from API `primaryLanguage.color` | GraphQL returns the color directly on primaryLanguage |
| Date formatting for tooltips | Raw date string manipulation | `new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })` | Handles locale-aware formatting |

**Key insight:** The GitHub GraphQL API returns `primaryLanguage.color` directly, so there is no need to maintain a separate language-to-color mapping. This is a common mistake -- developers often build or import a language color map when the API already provides it.

## Common Pitfalls

### Pitfall 1: PAT Token Not Created
**What goes wrong:** Build fails silently or returns null data because `GITHUB_TOKEN` env var is missing
**Why it happens:** Owner needs to create a GitHub fine-grained PAT before deployment
**How to avoid:** Graceful null check in `getGitHubData()`; render empty state if no token. Document required PAT scopes.
**Warning signs:** Section not rendering, no error in console

### Pitfall 2: GraphQL Query Returns Null for Pinned Items
**What goes wrong:** User has no pinned repos, query returns empty nodes array
**Why it happens:** Pinned repos must be manually pinned on the GitHub profile
**How to avoid:** Show empty state or hide pinned repos section; the owner (akm-coding) should pin repos before launch
**Warning signs:** pinnedItems.nodes is empty array

### Pitfall 3: Contribution Data Level Calculation
**What goes wrong:** Heatmap renders all same color because `level` field is missing or wrong
**Why it happens:** GitHub GraphQL returns `contributionCount` but not `level`; react-activity-calendar expects a `level` (0-4)
**How to avoid:** Calculate levels from counts: 0 = 0 contributions, then quartile the rest into levels 1-4
**Warning signs:** Monochrome heatmap

### Pitfall 4: ISR Not Working in Development
**What goes wrong:** Data appears stale or always fresh in dev mode
**Why it happens:** `next dev` does not cache by default; ISR only works in production (`next build && next start`)
**How to avoid:** Test with `next build && next start` locally to verify caching behavior
**Warning signs:** Different behavior between dev and prod

### Pitfall 5: Hydration Mismatch on Theme
**What goes wrong:** Heatmap colors flash or mismatch on initial load
**Why it happens:** Server renders with unknown theme, client resolves to dark/light
**How to avoid:** Use `suppressHydrationWarning` or render heatmap only after mount (same pattern as DynamicIcon fix in commit fad2323)
**Warning signs:** Console hydration warnings, color flash on load

### Pitfall 6: Total Stars Calculation
**What goes wrong:** Using `starredRepositories` instead of summing `stargazerCount` across own repos
**Why it happens:** `starredRepositories` is repos the user starred, not stars received
**How to avoid:** Query own repositories and sum their `stargazerCount` values
**Warning signs:** Star count seems unrealistically high or doesn't match GitHub profile

## Code Examples

### GitHub GraphQL Query (Complete)
```graphql
query($username: String!) {
  user(login: $username) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
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
          }
        }
      }
    }
    repositories(ownerAffiliations: OWNER, isFork: false) {
      totalCount
    }
  }
}
```

### Computing Total Stars (Server-Side)
```typescript
// To get total stars received, we need a separate field or compute from repos
// Option A: Query repos with stargazerCount and sum
// Option B: Use a paginated query (if user has many repos)
// For a portfolio with < 100 repos, querying first 100 is sufficient:

const STARS_QUERY_FRAGMENT = `
  repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
    totalCount
    nodes {
      stargazerCount
    }
  }
`
// Then sum: repos.nodes.reduce((sum, r) => sum + r.stargazerCount, 0)
```

### Transform Contribution Data for react-activity-calendar
```typescript
function transformContributions(
  weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>
): Activity[] {
  const days = weeks.flatMap(w => w.contributionDays)
  const maxCount = Math.max(...days.map(d => d.contributionCount), 1)

  return days.map(day => ({
    date: day.date,
    count: day.contributionCount,
    level: day.contributionCount === 0
      ? 0
      : Math.min(Math.ceil((day.contributionCount / maxCount) * 4), 4) as 0 | 1 | 2 | 3 | 4,
  }))
}
```

### ISR Caching with fetch
```typescript
// Option 1: fetch-level caching (preferred for external API)
const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables }),
  next: { revalidate: 3600 },
})

// Option 2: Page-level revalidation (simpler, affects entire page)
// In src/app/(public)/page.tsx:
export const revalidate = 3600
```

### Repo Card with Language Dot
```typescript
// Pinned repo card showing language with colored dot
function RepoCard({ repo }: { repo: PinnedRepo }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-primary">
          {repo.nameWithOwner}
        </h3>
        <a href={repo.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {repo.description}
      </p>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        {repo.primaryLanguage && (
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: repo.primaryLanguage.color }}
            />
            {repo.primaryLanguage.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" /> {repo.stargazerCount}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" /> {repo.forkCount}
        </span>
      </div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| REST API v3 for repos | GraphQL API v4 for all GitHub data | Stable since 2017 | Single query, typed responses, pinned repos only available via GraphQL |
| react-github-calendar (client fetch) | react-activity-calendar (server data) | v3 released Nov 2025 | Full SSR support, decoupled from data fetching |
| unstable_cache | `use cache` directive | Next.js 16 | `unstable_cache` still works but `use cache` is the future; for this project `fetch` with `next.revalidate` is simplest |
| Custom heatmap SVG | react-activity-calendar v3 | Nov 2025 | Properly handles month labels, responsive sizing, theme system |

**Deprecated/outdated:**
- `react-github-calendar` v4 client-side fetching: Still works but not ideal for ISR; use `react-activity-calendar` directly with server-fetched data
- `unstable_cache`: Being replaced by `use cache` in Next.js 16, but `fetch` with `next: { revalidate }` is simpler for this use case

## Open Questions

1. **GitHub PAT Scopes**
   - What we know: A fine-grained PAT with `read:user` scope is needed for public profile data
   - What's unclear: Whether `public_repo` scope is also needed for contribution data
   - Recommendation: Create PAT with minimal scopes; test with `read:user` first. The classic PAT `read:user` scope definitely works.

2. **ISR Revalidation Interval**
   - What we know: GitHub data changes infrequently (daily at most)
   - What's unclear: Exact optimal interval
   - Recommendation: 3600 seconds (1 hour) is a good default -- balances freshness with API rate limits. Claude's discretion per CONTEXT.md.

3. **Tooltip Implementation**
   - What we know: react-activity-calendar v3 supports `renderBlock` for custom rendering
   - What's unclear: Whether to use Shadcn Tooltip, native `title` attribute, or a lightweight custom tooltip
   - Recommendation: Use Shadcn Tooltip component wrapping `renderBlock` for consistency with existing UI. If Shadcn Tooltip doesn't work well with SVG, fall back to native `title` attribute.

## Sources

### Primary (HIGH confidence)
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) - ISR patterns, revalidate config, fetch caching
- [GitHub GraphQL API Docs](https://docs.github.com/en/graphql) - Query structure, pinnedItems, contributionsCollection
- [react-activity-calendar GitHub](https://github.com/grubersjoe/react-activity-calendar) - v3 props, theme system, data format

### Secondary (MEDIUM confidence)
- [GitHub GraphQL pinnedItems examples](https://dev.to/ugurtekbas/github-graphql-api-query-examples-3c3f) - Query field names verified against multiple sources
- [Next.js use cache migration](https://www.buildwithmatija.com/blog/nextjs-use-cache-migration-guide) - unstable_cache still works, use cache is the future
- [GitHub Linguist languages.yml](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml) - Language colors (but API returns them directly)

### Tertiary (LOW confidence)
- Tooltip implementation specifics for react-activity-calendar v3 with Shadcn - needs validation during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - react-activity-calendar v3 is purpose-built; GitHub GraphQL is the only way to get pinned repos
- Architecture: HIGH - follows exact same pattern as StatisticsSection (server fetch + client wrapper) already proven in this project
- Pitfalls: HIGH - common GitHub API integration issues well-documented across multiple sources
- ISR caching: HIGH - `fetch` with `next: { revalidate }` is the simplest and most standard approach for external API calls in Next.js

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable domain, unlikely to change)

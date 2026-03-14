# Phase 4: Polish & Launch - Research

**Researched:** 2026-03-14
**Domain:** Animations (Framer Motion), SEO (Next.js Metadata API), Deployment (Vercel)
**Confidence:** HIGH

## Summary

Phase 4 covers three distinct areas: adding Framer Motion animations throughout the public portfolio, implementing comprehensive SEO with meta tags/Open Graph/sitemap/structured data, and deploying to Vercel. The project uses Next.js 16.1.6 with App Router, React 19, Tailwind CSS 4, and server components throughout -- animations must be added via client component wrappers or by converting section components to client components where needed.

The animation library has been rebranded from "framer-motion" to "motion" (both packages are maintained, but "motion" is the recommended new package). Page transitions in App Router are notoriously fragile -- the recommended approach for this portfolio is to skip full page crossfade transitions (since it's primarily a single-page app) and focus on scroll reveal animations and hero staggered entry, which work reliably with `whileInView` and variants.

**Primary recommendation:** Install `motion` (not `framer-motion`). Focus animations on scroll reveal (`whileInView`) and staggered children rather than fragile AnimatePresence page transitions. Use Next.js built-in Metadata API for SEO -- no third-party SEO libraries needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Animation style: Subtle & professional -- gentle fades, small translations (10-20px), quick durations (0.3-0.5s)
- Scroll reveal: sections fade in and slide up as they enter the viewport
- Staggered children: items within sections animate in one after another with 50-100ms delay
- Hover effects: cards lift slightly (translateY -2px) with enhanced shadow; buttons scale subtly
- Page transitions: Fade crossfade between pages (~300ms) using Framer Motion with Next.js App Router
- Hero section: staggered reveal on initial load -- name, title, tagline, and CTA animate in sequence
- Navbar: hide on scroll down, show on scroll up (scroll-aware behavior)
- Smooth scroll when clicking nav links to scroll to sections on home page
- SEO: Single branded OG image for the whole site (name + title + clean design)
- SEO: Role-focused meta description: "Full Stack Developer specializing in React Native and frontend development. Based in Chiang Mai, Thailand."
- SEO: Dynamic metadata on project detail pages -- unique title and description from project data
- SEO: Person schema JSON-LD structured data (name, job title, social links)
- SEO: Auto-generated sitemap
- Favicon: Generate simple text-based "AKM" initials favicon with Apple touch icon and web manifest
- Performance: Run Lighthouse audit before launch, optimize images, check Core Web Vitals
- Deployment: Deploy to default Vercel URL -- Vercel already connected to repo, environment variables configured

### Claude's Discretion
- Exact animation easing curves and spring physics
- Loading skeleton animations
- Error state handling
- Lighthouse optimization specifics (image formats, lazy loading strategy)
- Favicon design details (colors, font)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSGN-02 | Framer Motion page transitions and scroll reveal animations | Motion library with `whileInView`, variants, staggered children, `useScroll` for navbar. Page transitions via template.tsx or simplified fade approach. |
| DSGN-04 | SEO optimization with meta tags, Open Graph, and sitemap | Next.js Metadata API (built-in), `sitemap.ts` file convention, JSON-LD `<script>` tag for Person schema, `robots.ts`, `manifest.ts` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.35 | Animation library (formerly Framer Motion) | Industry standard for React animations, GPU-accelerated, whileInView for scroll reveal |
| Next.js Metadata API | built-in (16.1.6) | SEO meta tags, OG, sitemap, robots | Official API, no third-party needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | ^1.1 | TypeScript types for JSON-LD structured data | Optional -- for type-safe Person schema. Can skip if hand-typing the JSON-LD object |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion | framer-motion | Both maintained; motion is the new name, recommended for new projects |
| motion page transitions | next-view-transitions | Simpler API but relies on experimental browser API (no Firefox support) |
| schema-dts | Manual JSON-LD | schema-dts adds types but is unnecessary for a single Person schema |

**Installation:**
```bash
npm install motion
```

No other new dependencies needed. `schema-dts` is optional.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── motion/              # Reusable motion wrappers
│   │   ├── scroll-reveal.tsx     # Generic scroll reveal wrapper
│   │   ├── stagger-children.tsx  # Container for staggered animations
│   │   └── page-transition.tsx   # Page transition wrapper (template.tsx)
│   ├── layout/
│   │   └── public-navbar.tsx     # Updated with scroll-aware hide/show
│   └── sections/                 # Existing sections get motion wrappers
├── app/
│   ├── sitemap.ts               # Dynamic sitemap generation
│   ├── robots.ts                # Robots.txt generation
│   ├── manifest.ts              # Web app manifest
│   ├── icon.tsx                 # Generated favicon (or static files)
│   ├── apple-icon.tsx           # Apple touch icon
│   ├── (public)/
│   │   ├── layout.tsx           # Add OG metadata here
│   │   ├── template.tsx         # Page transition wrapper (NEW)
│   │   └── projects/[slug]/
│   │       └── page.tsx         # Already has generateMetadata, enhance with OG
│   └── layout.tsx               # Root metadata with defaults
└── lib/
    └── motion.ts                # Shared animation variants/config
```

### Pattern 1: Scroll Reveal Wrapper
**What:** A reusable client component that wraps any content with fade-in-up animation on scroll
**When to use:** Every public section (Hero, About, Projects, Experience, Education, Skills, Contact)
**Example:**
```typescript
// Source: motion.dev/docs/react + whileInView pattern
"use client"
import { motion } from "motion/react"

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 2: Staggered Children
**What:** Container that staggers animation of child items
**When to use:** Project cards grid, skills list, timeline entries
**Example:**
```typescript
"use client"
import { motion } from "motion/react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

// Each child wraps in:
export function StaggerItem({ children }: { children: React.ReactNode }) {
  return <motion.div variants={itemVariants}>{children}</motion.div>
}
```

### Pattern 3: Scroll-Aware Navbar
**What:** Navbar hides when scrolling down, shows when scrolling up
**When to use:** PublicNavbar component
**Example:**
```typescript
"use client"
import { useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent } from "motion/react"

export function PublicNavbar() {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      {/* existing nav content */}
    </motion.header>
  )
}
```

### Pattern 4: Hero Staggered Reveal
**What:** Name, title, tagline, and CTA buttons animate in sequence on page load
**When to use:** HeroSection only (initial load animation)
**Example:**
```typescript
"use client"
import { motion } from "motion/react"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// Wrap each element (h1, p, div.buttons) in <motion.div variants={itemVariants}>
// Wrap the parent in <motion.div variants={containerVariants} initial="hidden" animate="visible">
```

### Pattern 5: Page Transitions (Simplified Approach)
**What:** Fade transition between pages using template.tsx
**When to use:** The `(public)` route group
**Why simplified:** Full AnimatePresence exit animations are fragile with App Router. The template.tsx approach gives reliable entry animations.
**Example:**
```typescript
// src/app/(public)/template.tsx
"use client"
import { motion } from "motion/react"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}
```

**Note:** template.tsx remounts on every navigation (unlike layout.tsx), making it ideal for entry animations. Exit animations (the "crossfade" part) are not reliably supported in App Router without fragile hacks using internal Next.js APIs (LayoutRouterContext). Recommend: entry fade only, which gives a polished feel without fragility risk.

### Pattern 6: JSON-LD Structured Data
**What:** Person schema embedded as a script tag
**When to use:** Root public layout or home page
**Example:**
```typescript
// Source: nextjs.org/docs/app/guides/json-ld
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aung Kaung Myat",
  jobTitle: "Full Stack Developer",
  url: "https://yoursite.vercel.app",
  sameAs: [
    "https://github.com/username",
    "https://linkedin.com/in/username",
  ],
}

// In component JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

### Pattern 7: Next.js Metadata API
**What:** Comprehensive metadata including OG for all public pages
**When to use:** Root layout.tsx and page-level metadata
**Example:**
```typescript
// Source: nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://yoursite.vercel.app"),
  title: {
    default: "Aung Kaung Myat - Full Stack Developer",
    template: "%s | Aung Kaung Myat",
  },
  description: "Full Stack Developer specializing in React Native and frontend development. Based in Chiang Mai, Thailand.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Aung Kaung Myat - Full Stack Developer",
    description: "Full Stack Developer specializing in React Native and frontend development. Based in Chiang Mai, Thailand.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
}
```

### Anti-Patterns to Avoid
- **Animating server components directly:** Motion components require `"use client"`. Wrap server component output in client motion wrappers instead of converting entire pages to client components.
- **AnimatePresence exit animations in App Router:** The FrozenRouter hack uses internal `LayoutRouterContext` which can break on Next.js updates. Use template.tsx entry-only animations instead.
- **Animating layout properties (width, height):** Use transform-based animations (x, y, scale, opacity) for GPU acceleration. CSS layout animations cause reflow.
- **Missing `viewport={{ once: true }}`:** Without this, scroll animations replay every time elements enter/leave viewport, causing animation fatigue.
- **Blocking render with animations:** Don't wrap async server components in client animation wrappers that block data loading. Keep data fetching in server components, wrap the rendered output.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll reveal animations | Custom IntersectionObserver + CSS transitions | `motion` `whileInView` | Handles edge cases, accessibility (reduced motion), GPU acceleration |
| Sitemap generation | Manual XML file | Next.js `sitemap.ts` file convention | Auto-generates, supports dynamic routes, type-safe |
| Meta tags / OG | Manual `<head>` tags | Next.js Metadata API | Handles deduplication, supports templates, streaming-compatible |
| Robots.txt | Static file | Next.js `robots.ts` file convention | Can be dynamic, type-safe |
| Favicon generation | External tool | Next.js `icon.tsx` or static files in `/app` | Auto-generates multiple sizes, integrated with manifest |
| Web manifest | Manual JSON file | Next.js `manifest.ts` file convention | Type-safe, auto-served |
| Scroll direction detection | Custom scroll listener with debounce | `motion` `useScroll` + `useMotionValueEvent` | Handles edge cases, throttled, works with motion values |

**Key insight:** Next.js 16 has built-in file conventions for all SEO concerns (sitemap, robots, manifest, icons). No third-party SEO libraries are needed.

## Common Pitfalls

### Pitfall 1: Server/Client Component Boundary with Motion
**What goes wrong:** Trying to use `motion.div` in a server component causes build errors
**Why it happens:** Motion components use React hooks internally, requiring client-side rendering
**How to avoid:** Create thin client wrapper components (ScrollReveal, StaggerContainer) that accept `children` as props. Keep data fetching in server components.
**Warning signs:** Build error "useState can only be used in Client Components"

### Pitfall 2: Motion Import Path
**What goes wrong:** Using `import { motion } from "framer-motion"` with the `motion` package
**Why it happens:** The new `motion` package uses different import paths
**How to avoid:** Use `import { motion } from "motion/react"` (NOT `"motion"` or `"framer-motion"`)
**Warning signs:** Module not found errors at build time

### Pitfall 3: Hydration Mismatch with Animations
**What goes wrong:** Server-rendered HTML doesn't match client-rendered animated state
**Why it happens:** `initial` prop sets a different state than what the server renders
**How to avoid:** For scroll reveal, this is fine because `initial="hidden"` (opacity: 0) means content appears after hydration. For hero animations, ensure the component is a client component so initial state is consistent.
**Warning signs:** React hydration warnings in console

### Pitfall 4: OG Image Path Issues on Vercel
**What goes wrong:** OG image shows broken in social media previews
**Why it happens:** Using relative paths or localhost URLs for OG images
**How to avoid:** Set `metadataBase` in root layout metadata. Use absolute paths. Place OG image in `/public/og-image.png`.
**Warning signs:** OG debugger tools show missing image

### Pitfall 5: Smooth Scroll CSS Conflicts
**What goes wrong:** Smooth scroll behavior doesn't work or conflicts with animations
**Why it happens:** Missing `scroll-behavior: smooth` on `html` element, or competing with JS-based scroll
**How to avoid:** Add `scroll-behavior: smooth` to `html` in global CSS. For the navbar anchor links, this is sufficient -- no JS scroll library needed. But add `scroll-margin-top` to section elements to account for the fixed navbar height.
**Warning signs:** Clicking nav links jumps abruptly, or sections are partially hidden behind navbar

### Pitfall 6: Reduced Motion Accessibility
**What goes wrong:** Animations play for users who have requested reduced motion
**Why it happens:** Not respecting `prefers-reduced-motion` media query
**How to avoid:** Motion library respects `prefers-reduced-motion` by default for transform/layout animations. Verify with `MotionConfig reducedMotion="user"` wrapper. Test with system setting enabled.
**Warning signs:** Accessibility audit flags motion issues

### Pitfall 7: Vercel Environment Variables
**What goes wrong:** Build fails or app doesn't work after deployment
**Why it happens:** Environment variables not prefixed with `NEXT_PUBLIC_` for client-side use, or not configured in Vercel dashboard
**How to avoid:** Per CONTEXT.md, environment variables are already configured. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel. Server-only vars don't need the prefix.
**Warning signs:** "supabase" undefined errors in production

## Code Examples

### Dynamic Sitemap with Project Pages
```typescript
// src/app/sitemap.ts
// Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from "next"
import { getProjects } from "@/lib/queries/projects"

const BASE_URL = "https://yoursite.vercel.app" // Update after deployment

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()

  const projectUrls = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ]
}
```

### Robots.txt
```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/auth/"],
    },
    sitemap: "https://yoursite.vercel.app/sitemap.xml",
  }
}
```

### Web App Manifest
```typescript
// src/app/manifest.ts
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aung Kaung Myat - Portfolio",
    short_name: "AKM",
    description: "Full Stack Developer Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
```

### Enhanced Project Detail Page Metadata
```typescript
// Enhancement to existing src/app/(public)/projects/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return { title: "Project Not Found" }

  return {
    title: project.title,
    description: project.short_description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.short_description ?? undefined,
      type: "article",
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : undefined,
    },
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package | Late 2024 | Same API, new import path `motion/react` |
| `react-intersection-observer` + CSS | `whileInView` prop on motion components | Framer Motion v6+ | Single library handles both detection and animation |
| `next-seo` package | Next.js built-in Metadata API | Next.js 13.2+ | No third-party dependency needed for SEO |
| Static sitemap.xml | `sitemap.ts` file convention | Next.js 13.3+ | Dynamic, type-safe sitemap generation |
| AnimatePresence page transitions | template.tsx entry animations (App Router) | Next.js 13+ App Router | Exit animations are fragile; entry-only is reliable |
| Manual favicon files | Next.js `icon.tsx` / metadata file conventions | Next.js 13.3+ | Auto-generates sizes, integrated with manifest |

**Deprecated/outdated:**
- `next-seo`: Unnecessary with built-in Metadata API
- `AnimateSharedLayout`: Removed in Framer Motion 5, replaced by `layoutId` prop
- Page transitions via `_app.tsx`: Pages Router pattern, not applicable to App Router

## Open Questions

1. **Page crossfade exit animations**
   - What we know: User requested "Fade crossfade between pages (~300ms)". Entry animations via template.tsx work reliably. Exit animations require fragile FrozenRouter hack using internal Next.js API.
   - What's unclear: Whether the FrozenRouter approach will work with Next.js 16.1.6 specifically
   - Recommendation: Implement entry fade via template.tsx first. If crossfade exit is essential, try the FrozenRouter approach but have a fallback plan (entry-only fade). The single-page nature of the portfolio means most navigation is anchor-scroll, not page transitions, so exit animations matter primarily for the projects/[slug] route.

2. **OG Image generation**
   - What we know: User wants a single branded OG image. Two options: (a) create a static PNG in design tool and place in /public, (b) use Next.js dynamic OG image generation via `opengraph-image.tsx`
   - What's unclear: Whether user wants to generate the OG image programmatically or provide a static one
   - Recommendation: Create a static OG image (1200x630px) with "Aung Kaung Myat | Full Stack Developer" text. Simpler and more predictable than dynamic generation for a single image.

3. **Vercel deployment URL for metadataBase**
   - What we know: The site will deploy to `*.vercel.app`. The exact URL depends on the Vercel project name.
   - What's unclear: The exact production URL
   - Recommendation: Use an environment variable `NEXT_PUBLIC_SITE_URL` for `metadataBase`. Set it in Vercel after first deploy. Default to `http://localhost:3000` in development.

## Sources

### Primary (HIGH confidence)
- [Next.js Metadata API - official docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) - metadata configuration, OG
- [Next.js sitemap.ts convention - official docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - sitemap generation, v16.1.6
- [Next.js JSON-LD guide - official docs](https://nextjs.org/docs/app/guides/json-ld) - structured data implementation
- [Motion for React - official docs](https://motion.dev/docs/react) - whileInView, useScroll, variants

### Secondary (MEDIUM confidence)
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) - migration from framer-motion to motion
- [Solving Framer Motion Page Transitions in Next.js App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) - FrozenRouter pattern for exit animations
- [Next.js viewTransition config](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) - experimental view transitions

### Tertiary (LOW confidence)
- Various blog posts on scroll-aware navbar implementation - pattern is well-established but specific Motion API usage should be verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Motion is the clear choice, Next.js Metadata API is built-in
- Architecture: HIGH - patterns are well-documented (whileInView, variants, staggered children)
- SEO implementation: HIGH - Next.js official docs cover all needed patterns (sitemap, robots, manifest, metadata)
- Page transitions: MEDIUM - entry animations via template.tsx are reliable, exit animations are fragile
- Pitfalls: HIGH - well-documented issues in community

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable domain, well-established patterns)

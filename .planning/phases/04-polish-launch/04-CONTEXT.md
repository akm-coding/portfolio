# Phase 4: Polish & Launch - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Framer Motion animations throughout the portfolio, optimize all public pages for SEO with meta tags and structured data, add favicon/app icons, run a performance audit, and deploy to Vercel. No new features or content pages — this phase polishes and ships what's already built.

</domain>

<decisions>
## Implementation Decisions

### Animation style & motion
- Subtle & professional feel — gentle fades, small translations (10-20px), quick durations (0.3-0.5s)
- Scroll reveal: sections fade in and slide up as they enter the viewport
- Staggered children: items within sections (project cards, skills, timeline entries) animate in one after another with 50-100ms delay
- Hover effects: cards lift slightly (translateY -2px) with enhanced shadow; buttons scale subtly

### Page transitions
- Fade crossfade between pages (~300ms) using Framer Motion with Next.js App Router
- Hero section: staggered reveal on initial load — name, title, tagline, and CTA animate in sequence
- Navbar: hide on scroll down, show on scroll up (scroll-aware behavior)
- Smooth scroll when clicking nav links to scroll to sections on home page

### SEO & Open Graph
- Single branded OG image for the whole site (name + title + clean design)
- Role-focused meta description: "Full Stack Developer specializing in React Native and frontend development. Based in Chiang Mai, Thailand."
- Dynamic metadata on project detail pages — unique title and description from project data
- Person schema JSON-LD structured data (name, job title, social links)
- Auto-generated sitemap

### Favicon & icons
- Generate simple text-based "AKM" initials favicon
- Include Apple touch icon and web manifest

### Performance
- Run Lighthouse audit before launch
- Optimize images, check Core Web Vitals

### Deployment
- Deploy to default Vercel URL (yourproject.vercel.app) — custom domain later
- Vercel already connected to repo — just needs deployment config
- Environment variables already configured

### Claude's Discretion
- Exact animation easing curves and spring physics
- Loading skeleton animations
- Error state handling
- Lighthouse optimization specifics (image formats, lazy loading strategy)
- Favicon design details (colors, font)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for animation implementation and SEO setup.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-polish-launch*
*Context gathered: 2026-03-14*

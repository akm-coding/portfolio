# Phase 2: Public Portfolio - Research

**Researched:** 2026-03-13
**Domain:** Next.js 16 server components, Supabase data fetching, Shadcn UI composition, responsive single-page portfolio
**Confidence:** HIGH

## Summary

Phase 2 transforms the placeholder home page into a fully functional single-page portfolio with seven sections (Hero, About, Projects, Experience, Education, Skills, Contact) plus separate project detail pages at `/projects/[slug]`. All content is fetched from Supabase tables using server components, with one client-side interaction: the contact form submission via a server action.

The existing codebase provides a solid foundation: the `(public)` route group with navbar and anchor links is already wired, Supabase server/client utilities exist, Shadcn UI components (Card, Button, Input, Label, Avatar, Sheet) are installed, and the theme system works. The main work is: (1) designing and creating the Supabase database schema, (2) building each portfolio section as a server component that fetches data, (3) adding the contact form with server action, and (4) ensuring responsive design across breakpoints.

**Primary recommendation:** Build database schema first (tables + seed data), then implement sections top-to-bottom matching the page scroll order, with the contact form and project detail pages as the final pieces.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single-page scroll with all sections on one page
- Navbar anchor links scroll to each section (matches existing navbar setup from Phase 1)
- Section order: Hero > About > Projects > Experience > Education > Skills > Contact
- Project detail pages are the exception -- separate routes at /projects/[slug]
- Hero: Split layout -- text left (name, title, tagline, CTA buttons), profile photo right, rounded square crop
- CTA buttons: Resume download + Contact (scrolls to contact section)
- About: Simple prose block with resume download button below
- Projects: Image-first cards, filterable by tech stack using clickable tag buttons, click navigates to /projects/[slug]
- Project detail: Hero image with thumbnail gallery below that swaps main image on click, full description, tech stack, GitHub/demo links
- Experience: Vertical timeline with alternating left/right cards (company, role, dates, description)
- Education: Simple stacked cards (not timeline) -- institution, degree, field, dates
- Skills: Grouped tag badges by category, colored badge/pill per skill, no progress bars
- Contact: Split layout -- form left (name, email, message stored in Supabase 'messages' table), social links + contact info right
- On submission: toast notification + clear form
- Social links: solid colored icons with brand colors

### Claude's Discretion
- Exact spacing, typography, and color choices within the theme system
- Loading states and skeleton patterns
- Error state handling for form validation
- Empty state designs (when no projects/experience/etc. exist yet)
- Mobile responsive breakpoint behavior details
- Image optimization and placeholder strategies

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROF-01 | Hero section displays name, title, tagline, and profile photo | Server component fetching `profiles` table; Next.js Image with Supabase storage remote patterns |
| PROF-02 | About/summary section with bio text | Same `profiles` table fetch, rendered as prose block |
| PROF-03 | Resume download link | Supabase Storage public URL for resume PDF, linked from Hero and About sections |
| PROJ-01 | Projects displayed in filterable grid with title, description, tech tags, and links | Server component fetching `projects` table with tech_stack array; client filter component |
| PROJ-02 | Individual project detail pages with full description and images | Dynamic route `/projects/[slug]` with `generateStaticParams`; `project_images` table |
| PROJ-05 | Visitors can filter projects by tech stack | Client-side filtering with URL search params or state; tag buttons extract unique techs |
| EXPR-01 | Work experience displayed as timeline | Server component fetching `experiences` table ordered by date; CSS timeline layout |
| EDUC-01 | Education displayed with institution, degree, field, dates | Server component fetching `education` table; simple Card layout |
| SKLL-01 | Skills displayed by category with proficiency indicators | Server component fetching `skills` table grouped by category; Badge components |
| CTCT-01 | Contact form with name, email, message fields | Client component with server action inserting into `messages` table; Sonner toast |
| CTCT-02 | Social links displayed (GitHub, LinkedIn, email, phone) | Data from `profiles` table or hardcoded in component; Lucide icons |
| DSGN-03 | Responsive design across mobile, tablet, and desktop | Tailwind responsive utilities; mobile-first approach |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.1.6 | Framework, SSR, routing, Image optimization | Already in project |
| @supabase/supabase-js | 2.99.1 | Database queries, storage URLs | Already in project |
| @supabase/ssr | 0.9.0 | Server-side Supabase client | Already in project |
| shadcn | 4.0.5 | UI component system | Already in project |
| tailwindcss | 4.2.1 | Styling | Already in project |
| lucide-react | 0.577.0 | Icons (social links, UI elements) | Already in project |
| sonner | 2.0.7 | Toast notifications (contact form) | Already in project |

### Additional Shadcn Components Needed
| Component | Purpose | Install Command |
|-----------|---------|-----------------|
| badge | Skills tags, tech stack pills, project filters | `npx shadcn@latest add badge` |
| textarea | Contact form message field | `npx shadcn@latest add textarea` |

### No New Dependencies Required
The existing stack covers all Phase 2 needs. No new npm packages are needed -- only two additional Shadcn UI components (badge, textarea) need to be added via the CLI.

## Architecture Patterns

### Database Schema (Supabase Tables)

These tables must be created in Supabase before any component work begins.

```sql
-- Profile (single row for site owner)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Images (gallery)
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Work Experience
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Education
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Row Level Security (RLS):**
- All tables: `SELECT` enabled for anonymous (public read)
- `messages` table: `INSERT` enabled for anonymous (public can submit contact form)
- All other write operations: restricted to authenticated admin (Phase 3 concern, but RLS policies should be set up now)

### Recommended Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx          # Existing -- PublicNavbar + main
│   │   ├── page.tsx            # Home -- composes all sections
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx    # Project detail page
│   ├── layout.tsx              # Existing root layout
│   └── globals.css             # Existing
├── components/
│   ├── sections/               # NEW: portfolio section components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── education-section.tsx
│   │   ├── skills-section.tsx
│   │   └── contact-section.tsx
│   ├── projects/               # NEW: project-specific components
│   │   ├── project-card.tsx
│   │   ├── project-filter.tsx  # Client component for filtering
│   │   └── project-gallery.tsx # Client component for image gallery
│   ├── contact/                # NEW: contact form
│   │   └── contact-form.tsx    # Client component
│   ├── ui/                     # Existing Shadcn components
│   └── layout/                 # Existing navbar, sidebar
├── lib/
│   ├── supabase/               # Existing client/server utilities
│   ├── queries/                # NEW: Supabase query functions
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── experiences.ts
│   │   ├── education.ts
│   │   ├── skills.ts
│   │   └── messages.ts
│   └── types/                  # NEW: TypeScript types
│       └── database.ts         # Generated or manual types
└── actions/                    # NEW: Server actions
    └── contact.ts              # Contact form submission
```

### Pattern 1: Server Component Data Fetching

**What:** Each portfolio section is a server component that fetches its own data from Supabase.
**When to use:** All read-only sections (Hero, About, Projects grid, Experience, Education, Skills).

```typescript
// src/lib/queries/profile.ts
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) throw error
  return data
}

// src/components/sections/hero-section.tsx
import { getProfile } from '@/lib/queries/profile'
import Image from 'next/image'

export async function HeroSection() {
  const profile = await getProfile()

  return (
    <section id="hero" className="min-h-screen flex items-center">
      {/* Split layout: text left, photo right */}
    </section>
  )
}
```

### Pattern 2: Client-Side Filtering with Server-Fetched Data

**What:** Projects are fetched on the server, filter interaction happens on client.
**When to use:** The project grid with tech stack filter buttons.

```typescript
// src/components/sections/projects-section.tsx (server component)
import { getProjects } from '@/lib/queries/projects'
import { ProjectFilter } from '@/components/projects/project-filter'

export async function ProjectsSection() {
  const projects = await getProjects()
  return (
    <section id="projects">
      <ProjectFilter projects={projects} />
    </section>
  )
}

// src/components/projects/project-filter.tsx (client component)
'use client'
import { useState } from 'react'

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('All')

  // Extract unique tech tags from all projects
  const allTechs = ['All', ...new Set(projects.flatMap(p => p.tech_stack))]

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.tech_stack.includes(activeFilter))

  return (
    <>
      {/* Filter buttons */}
      {/* Project cards grid */}
    </>
  )
}
```

### Pattern 3: Server Action for Contact Form

**What:** Form submission handled by a server action that inserts into Supabase.
**When to use:** Contact form.

```typescript
// src/actions/contact.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Validate
  if (!name || !email || !message) {
    return { error: 'All fields are required' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('messages')
    .insert({ name, email, message })

  if (error) {
    return { error: 'Failed to send message. Please try again.' }
  }

  return { success: true }
}
```

### Pattern 4: Dynamic Project Detail Route

**What:** `/projects/[slug]` route fetches single project with gallery images.
**When to use:** Project detail pages.

```typescript
// src/app/(public)/projects/[slug]/page.tsx
import { getProjectBySlug } from '@/lib/queries/projects'
import { notFound } from 'next/navigation'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    // Project detail layout
  )
}
```

**Note on Next.js 16:** The `params` prop is now a Promise and must be awaited. This is a breaking change from earlier versions.

### Anti-Patterns to Avoid
- **Fetching data in client components:** All read data should be fetched in server components; only pass serialized data to client components as props
- **Using `useEffect` for initial data load:** Server components eliminate the need for client-side fetching on initial render
- **Creating one massive page component:** Split each section into its own component file for maintainability
- **Hardcoding content:** All portfolio content should come from Supabase, even for initial development (use seed data)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom notification system | Sonner (already installed) | Handles stacking, animations, dismiss |
| Image optimization | Manual resize/lazy-load | Next.js `<Image>` component | Automatic resizing, WebP, lazy loading |
| Responsive navigation | Custom hamburger menu | Existing MobileNav + Sheet | Already built in Phase 1 |
| Form validation display | Custom error rendering | Inline validation + server action returns | Keep it simple for 3 fields |
| Icon system | SVG sprite sheets | Lucide React (already installed) | Tree-shakeable, consistent sizing |
| Smooth scrolling | Custom JS scroll handler | CSS `scroll-behavior: smooth` on html | Native, no JS needed |

## Common Pitfalls

### Pitfall 1: Next.js Image Without Remote Patterns
**What goes wrong:** Images from Supabase Storage fail to load with "Un-configured Host" error.
**Why it happens:** Next.js requires explicit allowlisting of remote image domains.
**How to avoid:** Configure `next.config.ts` with Supabase hostname:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```
**Warning signs:** Broken image icons in the browser, console errors about unconfigured hosts.

### Pitfall 2: Missing RLS Policies Block All Queries
**What goes wrong:** Supabase returns empty arrays even though data exists in tables.
**Why it happens:** RLS is enabled by default on new tables; without a SELECT policy for `anon`, no data is returned.
**How to avoid:** Always create RLS policies immediately after creating tables:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON profiles FOR SELECT USING (true);
```
**Warning signs:** Components render empty state even after inserting seed data.

### Pitfall 3: Next.js 16 Async Params
**What goes wrong:** Type errors or runtime crashes when accessing route params.
**Why it happens:** In Next.js 16, `params` is a Promise and must be awaited.
**How to avoid:** Always use `const { slug } = await params` in page components.
**Warning signs:** TypeScript errors about params type.

### Pitfall 4: Client/Server Component Boundary Confusion
**What goes wrong:** Trying to use `useState` or `onClick` in a server component, or trying to call `createClient` (server) in a client component.
**Why it happens:** Unclear which components need interactivity.
**How to avoid:** Only 3 components in this phase need to be client components: `ProjectFilter` (filter state), `ProjectGallery` (image swap state), and `ContactForm` (form state + submission). Everything else is a server component.
**Warning signs:** "useState is not a function" errors, or "cookies() can only be called in a Server Component" errors.

### Pitfall 5: Supabase Storage Public URLs
**What goes wrong:** Images fail to load because the Storage bucket is private.
**Why it happens:** Supabase Storage buckets default to private access.
**How to avoid:** Ensure storage buckets for portfolio images and resume are set to public. Use `supabase.storage.from('bucket').getPublicUrl('path')` pattern for generating URLs. Alternatively, store full public URLs directly in the database columns.
**Warning signs:** 403 errors when loading images.

### Pitfall 6: Empty State Not Handled
**What goes wrong:** Page crashes or looks broken when no data exists yet.
**Why it happens:** No guard for `null` or empty arrays from database queries.
**How to avoid:** Every section should handle the case where its data is null or an empty array gracefully, showing a clean empty state or hiding the section entirely.

## Code Examples

### Home Page Composition
```typescript
// src/app/(public)/page.tsx
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { EducationSection } from '@/components/sections/education-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
```

### Section Wrapper Pattern
```typescript
// Consistent section spacing and ID anchoring
function SectionWrapper({
  id,
  title,
  children,
  className,
}: {
  id: string
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight mb-8 md:mb-12">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}
```

### Experience Timeline CSS Pattern
```typescript
// Vertical timeline with alternating cards
// Use CSS pseudo-elements for the vertical line
// and Tailwind for alternating alignment
<div className="relative">
  {/* Vertical line */}
  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

  {experiences.map((exp, index) => (
    <div
      key={exp.id}
      className={cn(
        "relative mb-8 md:mb-12 md:w-1/2",
        index % 2 === 0 ? "md:pr-8 md:ml-0" : "md:pl-8 md:ml-auto"
      )}
    >
      {/* Timeline dot */}
      <div className="absolute top-4 hidden md:block w-3 h-3 rounded-full bg-primary
        ${index % 2 === 0 ? 'right-0 translate-x-[calc(50%+0.5px)]' : 'left-0 -translate-x-[calc(50%+0.5px)]'}"
      />
      <Card>
        {/* Card content */}
      </Card>
    </div>
  ))}
</div>
```

### Contact Form with Server Action
```typescript
'use client'

import { useActionState } from 'react'
import { submitContactForm } from '@/actions/contact'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await submitContactForm(formData)
      return result
    },
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast.success('Message sent!')
      formRef.current?.reset()
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {/* name, email, message fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

### Smooth Scroll CSS
```css
/* Add to globals.css */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 3.5rem; /* matches navbar h-14 = 3.5rem */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useEffect` + fetch for data | Server components with direct DB access | Next.js 13+ (stable) | No loading spinners for initial data |
| `getStaticPaths` | `generateStaticParams` | Next.js 13+ (app router) | Simpler static generation |
| `router.query` for params | `await params` (Promise) | Next.js 15+ | Must await params in pages |
| Custom form handling | `useActionState` + server actions | React 19 | Built-in pending states |
| Client-side form libraries | Server actions with FormData | Next.js 14+ | Simpler, works without JS |

**Deprecated/outdated:**
- `next/image` `domains` config: replaced by `remotePatterns` (more secure)
- `useFormState`: renamed to `useActionState` in React 19
- `params` as sync object: now a Promise in Next.js 15+

## Open Questions

1. **Supabase Project ID for Type Generation**
   - What we know: Types can be auto-generated via `npx supabase gen types typescript --project-id <ID>`
   - What's unclear: Whether the user has Supabase CLI installed and their project ID
   - Recommendation: Define TypeScript types manually in `src/lib/types/database.ts` for now; they can be swapped for generated types later. This avoids a CLI dependency during development.

2. **Supabase Storage Bucket Setup**
   - What we know: Profile photos, project images, and resumes need to be stored somewhere
   - What's unclear: Whether storage buckets already exist in their Supabase project
   - Recommendation: Include bucket creation instructions in the plan, but store public URLs directly in database columns. This decouples the component work from storage setup.

3. **Seed Data Strategy**
   - What we know: Components need real data to render; the owner's info is known (from PROJECT.md context)
   - What's unclear: Whether to seed via SQL or the Supabase dashboard
   - Recommendation: Provide SQL INSERT statements as part of the database setup task so sections can be developed and tested immediately.

## Sources

### Primary (HIGH confidence)
- [Next.js Image Component docs](https://nextjs.org/docs/app/api-reference/components/image) - remotePatterns config, Image props
- [Next.js images config](https://nextjs.org/docs/app/api-reference/config/next-config-js/images) - remotePatterns setup
- [Supabase JavaScript select docs](https://supabase.com/docs/reference/javascript/select) - query patterns
- [Supabase TypeScript support](https://supabase.com/docs/reference/javascript/typescript-support) - type generation
- [Shadcn Badge component](https://ui.shadcn.com/docs/components/radix/badge) - badge/pill patterns
- [Shadcn Textarea component](https://ui.shadcn.com/docs/components/radix/textarea) - textarea for contact form

### Secondary (MEDIUM confidence)
- [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) - server component patterns
- [Supabase type generation](https://supabase.com/docs/guides/api/rest/generating-types) - CLI type generation

### Tertiary (LOW confidence)
- Timeline CSS patterns derived from common implementations; exact positioning may need adjustment during development

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and verified in package.json
- Architecture: HIGH - patterns follow Next.js app router conventions with server components
- Database schema: MEDIUM - schema is designed for the requirements but hasn't been validated against Supabase-specific constraints
- Pitfalls: HIGH - based on official Next.js and Supabase documentation
- UI patterns: MEDIUM - timeline and gallery patterns are common but may need CSS adjustments

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (30 days - stable stack, no rapid changes expected)

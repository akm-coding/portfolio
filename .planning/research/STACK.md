# Stack Research: Developer Portfolio with Admin Dashboard

## Decided Stack (Owner's Choice)

| Technology | Purpose | Version | Confidence |
|-----------|---------|---------|------------|
| Next.js | Framework (App Router) | 15.x | High |
| Shadcn UI | Component library | Latest | High |
| Tailwind CSS | Styling | 4.x | High |
| Framer Motion | Animations | 11.x | High |
| Supabase | Database + Auth + Storage | Latest JS SDK v2 | High |
| Vercel | Hosting/Deployment | N/A | High |
| TypeScript | Language | 5.x | High |

## Recommended Additional Stack

### ORM / Database Access

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **Supabase JS Client** | Recommended | Direct Supabase SDK — no ORM needed for this scale. Type-safe with generated types. Owner already chose Supabase. |
| Prisma | Not recommended | Overkill for portfolio. Adds build complexity, cold start issues on Vercel serverless. |
| Drizzle | Alternative | Lighter than Prisma but still unnecessary when Supabase client handles everything. |

**Decision:** Use `@supabase/supabase-js` directly + `supabase gen types` for TypeScript types.

### Form Handling

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **React Hook Form** | Recommended | Lightweight, performant, great DX. Works well with Shadcn UI form components. |
| **Zod** | Recommended (pair with RHF) | Schema validation, type inference, used by Shadcn UI forms natively. |
| Formik | Not recommended | Heavier, less modern, worse performance than RHF. |

**Decision:** `react-hook-form` + `zod` + `@hookform/resolvers`

### Theme Management

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **next-themes** | Recommended | De facto standard for Next.js dark/light/system toggle. Works with Shadcn UI out of the box. |
| Custom implementation | Not recommended | Reinventing the wheel — next-themes handles SSR, system preference, localStorage. |

**Decision:** `next-themes`

### Email (Contact Form)

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **Resend** | Recommended | Modern email API, generous free tier (100 emails/day), great DX, built by Vercel-adjacent team. |
| Nodemailer + SMTP | Alternative | Free but more setup, less reliable deliverability. |
| SendGrid | Alternative | Overkill for contact form volume. |

**Decision:** `resend` for sending email notifications when contact form is submitted.

### Image Handling

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **Supabase Storage** | Recommended | Already in stack, handles uploads, generates public URLs. |
| **Next.js Image** | Recommended | Built-in optimization, lazy loading, responsive images. |
| Cloudinary | Not recommended | Unnecessary third-party when Supabase Storage + Next Image covers needs. |

**Decision:** Supabase Storage for uploads + `next/image` for rendering.

### Icons

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **Lucide React** | Recommended | Default icon set for Shadcn UI. Consistent, tree-shakeable. |
| React Icons | Alternative | Larger bundle, multiple icon sets — unnecessary variety for portfolio. |

**Decision:** `lucide-react` (already included with Shadcn UI)

### Date Formatting

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **date-fns** | Recommended | Lightweight, tree-shakeable, handles experience/education date formatting. |
| dayjs | Alternative | Also fine, slightly less tree-shakeable. |
| Intl API | Alternative | Built-in but less ergonomic for complex formatting. |

**Decision:** `date-fns`

### State Management

| Option | Recommendation | Rationale |
|--------|---------------|-----------|
| **React Server Components** | Recommended | Next.js 15 default — most data fetching happens server-side. |
| **React state + context** | For client state | Theme, modals, form state — no external lib needed. |
| Zustand/Redux | Not recommended | Overkill for portfolio. RSC + local state is sufficient. |

**Decision:** RSC for data, React state/context for UI state. No external state management.

## What NOT to Use

| Technology | Reason |
|-----------|--------|
| Prisma | Unnecessary ORM layer — Supabase client is sufficient |
| Redux/Zustand | Overkill — RSC + React state handles everything |
| Styled Components/CSS Modules | Tailwind CSS already chosen |
| Cloudinary | Supabase Storage covers image needs |
| NextAuth/Auth.js | Supabase Auth is already integrated |
| tRPC | Overkill — Next.js Server Actions + Supabase client is simpler |
| Storybook | Nice but unnecessary for solo portfolio project |

## Full Package List

```json
{
  "dependencies": {
    "next": "^15",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "framer-motion": "^11",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zod": "^3",
    "next-themes": "^0.4",
    "resend": "^4",
    "date-fns": "^4",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

## Confidence Levels

- **High confidence:** next-themes, react-hook-form, zod, lucide-react, Supabase client (established, widely used)
- **Medium confidence:** resend (newer but well-regarded, verify free tier limits), date-fns (alternatives exist but this is solid)
- **Verify versions:** All version numbers should be verified at install time via `npm info [package] version`

---
*Researched: 2026-03-12*

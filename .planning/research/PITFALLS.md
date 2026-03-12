# Pitfalls Research: Developer Portfolio with Admin Dashboard

## Critical Pitfalls

### 1. Unprotected Admin Routes
**Risk:** Admin CRUD pages accessible without authentication.
**Warning signs:** Can access `/admin/*` routes in incognito without logging in.
**Prevention:**
- Next.js middleware checks auth on ALL `/admin` routes
- Supabase RLS as second layer — even if middleware bypassed, DB rejects unauthorized writes
- Test in incognito during development
**Phase:** Phase 1 (Foundation/Auth)

### 2. Missing Row Level Security (RLS)
**Risk:** Supabase tables without RLS allow anyone with the anon key to read/write all data.
**Warning signs:** Using Supabase client without enabling RLS on tables.
**Prevention:**
- Enable RLS on EVERY table immediately after creation
- Public tables: allow `SELECT` for anon, restrict `INSERT/UPDATE/DELETE` to authenticated admin
- Messages table: allow `INSERT` for anon (contact form), restrict `SELECT/UPDATE/DELETE` to admin
- Test with anon key in browser console
**Phase:** Phase 1 (Database Setup)

### 3. Animations Blocking SSR/SEO
**Risk:** Wrapping entire page in Framer Motion `<motion.div>` makes content invisible to crawlers and causes hydration issues.
**Warning signs:** Page content flashes or doesn't appear in "View Source". Lighthouse SEO score drops.
**Prevention:**
- Keep Framer Motion in Client Components only
- Server Components render content statically — visible to crawlers
- Use `motion` for enhancement (fade-in, slide), not for rendering content
- Test with JavaScript disabled — content should still be visible
**Phase:** Phase 5 (Polish/Animations)

### 4. Client Component Overuse
**Risk:** Making everything a Client Component defeats Next.js benefits (larger bundle, slower load, worse SEO).
**Warning signs:** `"use client"` at the top of most files. Large JavaScript bundle size.
**Prevention:**
- Default to Server Components
- Only use `"use client"` for: interactivity (forms, buttons), browser APIs, Framer Motion animations
- Compose: Server Component parent with Client Component children for interactive parts
- Check bundle size with `@next/bundle-analyzer`
**Phase:** Phase 2-3 (Public Pages)

## Moderate Pitfalls

### 5. Theme Flash on Load (FOUC)
**Risk:** Page briefly flashes wrong theme before `next-themes` hydrates.
**Warning signs:** White flash when loading dark mode page, or vice versa.
**Prevention:**
- Use `next-themes` with `attribute="class"` and `suppressHydrationWarning` on `<html>`
- Add `enableSystem` and `defaultTheme="system"`
- The `next-themes` script tag runs before render — handles this if configured correctly
**Phase:** Phase 1 (Theme Setup)

### 6. Contact Form Spam
**Risk:** Bots flooding contact form, filling Supabase with junk, burning Resend email quota.
**Warning signs:** Hundreds of identical or gibberish submissions.
**Prevention:**
- Honeypot field (hidden input that bots fill, humans don't)
- Rate limiting on Server Action (simple in-memory or Supabase-based)
- Optional: Cloudflare Turnstile (free, privacy-friendly CAPTCHA alternative)
- Don't send email for every submission — batch or check honeypot first
**Phase:** Phase 2 (Contact Form)

### 7. Supabase Client Sprawl
**Risk:** Creating Supabase clients inconsistently across the app leads to auth context bugs.
**Warning signs:** Different auth states in different components. "User is null" errors in server actions.
**Prevention:**
- Create exactly 3 client factories in `lib/supabase/`:
  - `client.ts` — browser client (singleton)
  - `server.ts` — server component/action client (per-request)
  - `middleware.ts` — middleware client (per-request)
- Never call `createClient` outside these files
**Phase:** Phase 1 (Supabase Setup)

### 8. Over-Engineering the Admin Dashboard
**Risk:** Building a full CMS when simple forms suffice. Gold-plating admin UI that only you use.
**Warning signs:** Spending more time on admin than public site. Building features like bulk operations, advanced filtering.
**Prevention:**
- Admin is a tool for YOU — functional over beautiful
- Simple forms with Shadcn UI components are sufficient
- Data table for listing, form for create/edit, confirm dialog for delete
- Skip: drag-and-drop reordering, inline editing, bulk operations (v2 if ever)
**Phase:** Phase 4 (Admin Dashboard)

### 9. Image Upload URL Handling
**Risk:** Storing full Supabase Storage URLs in database — URLs break if bucket or project changes.
**Warning signs:** Hardcoded full URLs like `https://xyz.supabase.co/storage/v1/object/public/...` in DB.
**Prevention:**
- Store only the storage path in DB (e.g., `projects/my-project.png`)
- Generate full URL at render time using `supabase.storage.from('bucket').getPublicUrl(path)`
- This way, changing Supabase projects or buckets doesn't break all images
**Phase:** Phase 4 (Image Upload)

### 10. Environment Variable Mismanagement
**Risk:** Leaking server-side env vars to client, or missing vars in production.
**Warning signs:** `NEXT_PUBLIC_` prefix on secret keys. Supabase service role key in client code.
**Prevention:**
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are client-safe
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are server-only (no `NEXT_PUBLIC_` prefix)
- Set all env vars in Vercel dashboard before deploying
- Use `.env.local` for development, never commit it
**Phase:** Phase 1 (Setup)

## Minor Pitfalls

### 11. Inconsistent Data Fetching Patterns
**Risk:** Mixing fetch strategies randomly — some pages SSG, some SSR, some client-fetch — leads to confusing behavior.
**Warning signs:** Some pages fast, some slow. Stale data on some pages but not others.
**Prevention:**
- Public pages: ISR with `revalidate` (e.g., 3600 seconds)
- Admin pages: SSR (always fresh, behind auth)
- Contact form: Client-side submission (Server Action)
- Document the pattern in a comment or README
**Phase:** Phase 2-3

### 12. Admin Not Mobile-Responsive
**Risk:** Admin dashboard unusable on mobile/tablet.
**Warning signs:** Sidebar overlaps content on small screens. Forms unusable on phone.
**Prevention:**
- Use Shadcn UI `Sheet` component for mobile sidebar (collapsible)
- Test admin on mobile during development — you might edit from your phone
- Keep it simple — responsive Shadcn components handle most of this
**Phase:** Phase 4

### 13. Missing Open Graph / Social Meta Tags
**Risk:** Portfolio link shared on LinkedIn/Twitter shows blank preview — bad look for a developer.
**Warning signs:** Sharing portfolio link shows generic or no preview.
**Prevention:**
- Next.js `generateMetadata` for each page
- Include: title, description, og:image (screenshot or generated image)
- Test with LinkedIn Post Inspector and Twitter Card Validator
**Phase:** Phase 5 (SEO)

### 14. Animation Performance Jank
**Risk:** Framer Motion animations cause jank on lower-end devices or trigger layout thrashing.
**Warning signs:** Animations stutter, page scroll feels choppy, high paint times in DevTools.
**Prevention:**
- Animate only `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (trigger layout)
- Use `will-change` sparingly
- Use `useReducedMotion` hook to respect user preference
- Test on throttled CPU in Chrome DevTools
**Phase:** Phase 5 (Animations)

## Phase-Specific Warning Map

| Phase | Watch Out For |
|-------|--------------|
| Phase 1 (Foundation) | Unprotected routes, missing RLS, Supabase client sprawl, env vars, theme flash |
| Phase 2 (Public Pages) | Client component overuse, inconsistent data fetching, contact form spam |
| Phase 3 (Public Pages cont.) | Animation + SSR conflicts, missing meta tags |
| Phase 4 (Admin) | Over-engineering, image URL handling, mobile responsiveness |
| Phase 5 (Polish) | Animation jank, SEO gaps, performance regression |

---
*Researched: 2026-03-12*

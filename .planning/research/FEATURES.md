# Features Research: Developer Portfolio with Admin Dashboard

## Table Stakes (Must Have)

| Feature | Description | Complexity |
|---------|-------------|------------|
| Hero Section | Name, title, tagline, CTA, profile photo | Low |
| Projects Showcase | Grid/list of projects with descriptions, tech tags, links | Medium |
| Work Experience | Timeline of roles with company, dates, descriptions | Medium |
| Skills Display | Categorized skills with proficiency indicators | Low |
| Education Section | Degrees, certifications, relevant coursework | Low |
| Contact Form | Name, email, message — stored in Supabase | Medium |
| Social Links | GitHub, LinkedIn, email, phone | Low |
| Responsive Design | Mobile-first, works on all screen sizes | Medium |
| Theme Toggle | Dark/light/system with smooth transitions | Medium |
| SEO Optimization | Meta tags, Open Graph, structured data, sitemap | Medium |
| Performance | Fast load times, optimized images, Core Web Vitals | Medium |
| Resume Download | Downloadable PDF resume link | Low |

## Differentiators (Competitive Advantage)

| Feature | Description | Complexity |
|---------|-------------|------------|
| Admin Dashboard CRUD | Protected routes for managing all content sections | High |
| Framer Motion Animations | Page transitions, scroll reveals, hover effects, staggered lists | High |
| Project Filtering | Filter by tech stack, category, or status | Medium |
| GitHub Integration | Auto-fetch repos, show contribution stats | Medium |
| Image Upload | Upload project screenshots, profile photo via Supabase Storage | Medium |
| Contact Form Notifications | Email notification when someone submits contact form | Medium |
| Summary/About CRUD | Editable profile summary, tagline, bio from admin | Low |
| Skills CRUD | Add/remove/reorder skills from admin | Low |
| Project Detail Pages | Individual project pages with full descriptions, gallery | Medium |
| Smooth Page Transitions | Animated route transitions with Framer Motion | Medium |
| Scroll Progress Indicator | Visual indicator of reading progress | Low |
| Command Palette | Keyboard shortcut for quick navigation (nice-to-have) | Medium |
| Analytics (Basic) | View count per project (nice-to-have, v2) | Medium |
| Testimonials Section | Client/colleague quotes (nice-to-have, v2) | Low |

## Anti-Features (Do NOT Build for v1)

| Feature | Reason |
|---------|--------|
| Blog/CMS | Scope creep — not core to portfolio purpose |
| Multi-language (i18n) | English only, unnecessary complexity |
| Analytics Dashboard | Vercel Analytics covers basics, defer custom solution |
| Public User Accounts | Only admin needs auth |
| 3D/WebGL Effects | Performance risk, high complexity, diminishing returns |
| AI Chatbot | Gimmicky, adds latency, not valuable for portfolio |
| Custom CMS | Supabase + admin dashboard is sufficient |
| Comments System | Not a social platform |
| Skill Endorsements | LinkedIn handles this already |
| Over-engineered Animations | Keep Framer Motion purposeful, not distracting |

## Feature Dependencies

```
Supabase Setup → Auth → Admin Dashboard → All CRUD features
                                        → Image Upload (Supabase Storage)
                                        → Contact Form Storage

Theme System → All UI components depend on this

Layout/Navigation → All public pages
                  → Responsive design

Framer Motion Setup → Page transitions
                    → Scroll animations
                    → Component animations
```

## Build Order Recommendation

**Phase 1:** Foundation — Next.js setup, Supabase, auth, theme system, layout
**Phase 2:** Public pages — Hero, about, experience, education, skills, projects, contact
**Phase 3:** Admin dashboard — CRUD for all content sections, image upload
**Phase 4:** Polish — Framer Motion animations, SEO, performance, responsive fine-tuning

## Complexity Budget

| Group | Estimated Effort |
|-------|-----------------|
| Foundation (setup, auth, theme) | 20% |
| Public Pages (all sections) | 30% |
| Admin Dashboard (CRUD) | 30% |
| Polish (animations, SEO, perf) | 20% |

---
*Researched: 2026-03-12*

# Phase 3: Admin Dashboard - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Protected CRUD interface for managing all portfolio content: profile editing, project management with image uploads, experience and education entries, skill management with reordering, and contact message inbox. All behind the existing auth guard from Phase 1. Email notifications are deferred.

</domain>

<decisions>
## Implementation Decisions

### CRUD form patterns
- Dedicated pages for create/edit: /admin/projects/new, /admin/projects/[id]/edit, etc.
- List pages show table rows with columns (Title, relevant info, Actions)
- On save: success toast + redirect back to list page
- Delete: confirmation dialog ("Are you sure? This cannot be undone.") with Cancel/Delete buttons
- Profile: single edit page with all fields (name, title, tagline, bio, photo, resume, contact info, social links)

### Content management UX
- Image uploads (profile photo, project screenshots): drag-and-drop zone that accepts drag-and-drop or click-to-browse, shows preview thumbnail after upload, uploads directly to Supabase Storage
- Skill reordering: up/down arrow buttons on each skill row (no drag-and-drop library needed)
- Admin list pages: data tables with rows for all content types (projects, experience, education, skills)
- Project tech stack tags: text input where you type a tag name, press Enter/comma to add as chip/badge, click X to remove

### Messages inbox
- Table layout with read/unread indicators (bold/dot for unread)
- Click a row to expand inline showing full message (no separate page), marks as read on expand
- Actions: toggle read/unread status and delete with confirmation
- Unread count shown in sidebar nav and dashboard stat card

### Dashboard overview (/admin)
- Summary stat cards: total projects, total experience entries, unread messages count
- Stat cards are display-only (not clickable) — use sidebar for navigation
- Recent unread messages list below stats for quick overview

### Email notifications
- Skipped for Phase 3 — messages only visible in admin dashboard
- Email notification on new contact submission deferred to future work

### Claude's Discretion
- Form validation patterns and error display
- Table column choices per content type
- Empty state designs for each admin section
- Loading states during form submission and data fetching
- Responsive admin layout adjustments
- Supabase Storage bucket configuration and file naming

</decisions>

<specifics>
## Specific Ideas

- Admin forms should feel consistent across all content types — same button placement, same save/cancel pattern, same toast feedback
- Messages inbox should clearly distinguish unread from read at a glance
- The dashboard overview should give a quick sense of "what needs attention" (unread messages)

</specifics>

<deferred>
## Deferred Ideas

- Email notifications on new contact submissions (CTCT-03) — add email service (Resend) in a future phase
- Drag-and-drop reordering for skills (UXEN-02 in v2 requirements)
- Archive functionality for messages

</deferred>

---

*Phase: 03-admin-dashboard*
*Context gathered: 2026-03-13*

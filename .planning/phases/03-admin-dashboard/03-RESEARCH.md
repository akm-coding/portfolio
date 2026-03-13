# Phase 3: Admin Dashboard - Research

**Researched:** 2026-03-13
**Domain:** CRUD Admin Interface with File Uploads (Next.js + Supabase)
**Confidence:** HIGH

## Summary

Phase 3 builds a protected admin dashboard for managing all portfolio content: profile, projects, experience, education, skills, and contact messages. The existing codebase already has auth protection (middleware + layout guard), an admin sidebar with navigation links for all sections, Supabase server/client utilities, manual TypeScript types for all database tables, and read-only query functions. The phase needs to add write operations (insert, update, delete), server actions for form handling, file upload to Supabase Storage, and admin page routes with forms and tables.

The established patterns from Phase 1 and 2 are clear: server actions with `useActionState` (React 19) for forms, `sonner` toast for feedback, `@base-ui/react` primitives via Shadcn "base-nova" style, and query functions in `src/lib/queries/` that return null/empty on error. The admin dashboard should follow these same patterns consistently.

**Primary recommendation:** Use server actions for all CRUD mutations, upload files client-side directly to Supabase Storage (bypassing the 1MB server action body limit), and add Shadcn Table/Dialog/AlertDialog components for list pages and confirmations.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Dedicated pages for create/edit: /admin/projects/new, /admin/projects/[id]/edit, etc.
- List pages show table rows with columns (Title, relevant info, Actions)
- On save: success toast + redirect back to list page
- Delete: confirmation dialog ("Are you sure? This cannot be undone.") with Cancel/Delete buttons
- Profile: single edit page with all fields (name, title, tagline, bio, photo, resume, contact info, social links)
- Image uploads (profile photo, project screenshots): drag-and-drop zone that accepts drag-and-drop or click-to-browse, shows preview thumbnail after upload, uploads directly to Supabase Storage
- Skill reordering: up/down arrow buttons on each skill row (no drag-and-drop library needed)
- Admin list pages: data tables with rows for all content types (projects, experience, education, skills)
- Project tech stack tags: text input where you type a tag name, press Enter/comma to add as chip/badge, click X to remove
- Messages inbox: table layout with read/unread indicators (bold/dot for unread), click row to expand inline showing full message, marks as read on expand, toggle read/unread and delete with confirmation
- Unread count shown in sidebar nav and dashboard stat card
- Dashboard overview (/admin): summary stat cards (total projects, total experience entries, unread messages count), stat cards display-only, recent unread messages list below stats
- Email notifications skipped for Phase 3

### Claude's Discretion
- Form validation patterns and error display
- Table column choices per content type
- Empty state designs for each admin section
- Loading states during form submission and data fetching
- Responsive admin layout adjustments
- Supabase Storage bucket configuration and file naming

### Deferred Ideas (OUT OF SCOPE)
- Email notifications on new contact submissions (CTCT-03) -- add email service (Resend) in a future phase
- Drag-and-drop reordering for skills (UXEN-02 in v2 requirements)
- Archive functionality for messages

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROF-04 | Admin can edit profile info, summary, and upload photo | Server action for profile update + client-side Supabase Storage upload for avatar; single edit page pattern |
| PROJ-03 | Admin can create, edit, and delete projects | CRUD server actions + dedicated /new and /[id]/edit pages; list page with data table |
| PROJ-04 | Admin can upload project screenshots via Supabase Storage | Client-side upload to Supabase Storage bucket; ProjectImage table management |
| EXPR-02 | Admin can create, edit, and delete experience entries | CRUD server actions + form pages; same pattern as projects |
| EDUC-02 | Admin can create, edit, and delete education entries | CRUD server actions + form pages; same pattern as projects |
| SKLL-02 | Admin can add, edit, delete, and reorder skills | CRUD server actions + inline reorder with display_order swap; up/down arrow buttons |
| CTCT-03 | Admin receives email notification on new contact submission | DEFERRED -- email notifications explicitly skipped for Phase 3 per CONTEXT.md |
| CTCT-04 | Admin can view and manage contact messages in dashboard | Messages query functions + read/unread toggle + delete server actions; expandable row UI |

</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.1.6 | Framework, server actions, routing | Already in use |
| @supabase/supabase-js | ^2.99.1 | Database + Storage client | Already in use |
| @supabase/ssr | ^0.9.0 | Server/client Supabase helpers | Already in use |
| react | 19.2.3 | UI with useActionState | Already in use |
| sonner | ^2.0.7 | Toast notifications | Already in use for contact form feedback |
| lucide-react | ^0.577.0 | Icons | Already in use |

### Shadcn UI Components to Add
| Component | Purpose | Install Command |
|-----------|---------|-----------------|
| table | Data tables for list pages | `npx shadcn@latest add table` |
| dialog | Inline message expansion, general modals | `npx shadcn@latest add dialog` |
| alert-dialog | Delete confirmation dialogs | `npx shadcn@latest add alert-dialog` |
| select | Category dropdowns (skills, filters) | `npx shadcn@latest add select` |
| switch | Toggle read/unread status | `npx shadcn@latest add switch` |

**Note:** The project uses Shadcn "base-nova" style which wraps `@base-ui/react` primitives (not Radix UI). All Shadcn components installed via CLI will automatically use the correct base-nova style as configured in `components.json`.

### No New npm Dependencies Needed
The existing stack covers all needs. File uploads use the browser Supabase client directly. Forms use native React 19 `useActionState`. No form library (react-hook-form, zod) is needed given the simple validation patterns already established.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── actions/
│   ├── contact.ts          # (existing)
│   ├── profile.ts          # Profile update server action
│   ├── projects.ts         # Project CRUD server actions
│   ├── experience.ts       # Experience CRUD server actions
│   ├── education.ts        # Education CRUD server actions
│   ├── skills.ts           # Skill CRUD + reorder server actions
│   └── messages.ts         # Message read/unread toggle, delete
├── app/admin/
│   ├── layout.tsx           # (existing - auth guard + sidebar)
│   ├── page.tsx             # Dashboard overview with stats
│   ├── profile/
│   │   └── page.tsx         # Profile edit form
│   ├── projects/
│   │   ├── page.tsx         # Projects list table
│   │   ├── new/page.tsx     # Create project form
│   │   └── [id]/edit/page.tsx # Edit project form
│   ├── experience/
│   │   ├── page.tsx         # Experience list table
│   │   ├── new/page.tsx     # Create experience form
│   │   └── [id]/edit/page.tsx # Edit experience form
│   ├── education/
│   │   ├── page.tsx         # Education list table
│   │   ├── new/page.tsx     # Create education form
│   │   └── [id]/edit/page.tsx # Edit education form
│   ├── skills/
│   │   └── page.tsx         # Skills list with inline add/edit/reorder
│   └── messages/
│       └── page.tsx         # Messages inbox with expandable rows
├── components/admin/
│   ├── project-form.tsx     # Shared form for create/edit project
│   ├── experience-form.tsx  # Shared form for create/edit experience
│   ├── education-form.tsx   # Shared form for create/edit education
│   ├── skill-form.tsx       # Inline skill add/edit form
│   ├── profile-form.tsx     # Profile edit form
│   ├── image-upload.tsx     # Reusable drag-and-drop upload zone
│   ├── tag-input.tsx        # Tech stack tag input (Enter/comma to add)
│   ├── delete-dialog.tsx    # Reusable delete confirmation
│   ├── message-row.tsx      # Expandable message row
│   └── stat-card.tsx        # Dashboard stat card
└── lib/queries/
    ├── profile.ts           # (extend with update)
    ├── projects.ts          # (extend with create/update/delete)
    ├── experiences.ts       # (extend with create/update/delete)
    ├── education.ts         # (extend with create/update/delete)
    ├── skills.ts            # (extend with create/update/delete/reorder)
    └── messages.ts          # (extend with getAll, toggleRead, delete)
```

### Pattern 1: Server Action CRUD with useActionState
**What:** All mutations go through server actions; forms use React 19 `useActionState` for pending/error/success states.
**When to use:** Every admin form (create, edit, delete).
**Example:**
```typescript
// src/actions/projects.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  // ... extract other fields

  if (!title?.trim()) return { error: 'Title is required.' }

  const { error } = await supabase.from('projects').insert({
    title: title.trim(),
    slug: slug.trim(),
    // ... other fields
  })

  if (error) {
    console.error('Error creating project:', error.message)
    return { error: 'Failed to create project.' }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}
```

### Pattern 2: Client-Side File Upload to Supabase Storage
**What:** Upload files directly from the browser to Supabase Storage, bypassing the server action 1MB body limit.
**When to use:** Profile photo uploads, project screenshot uploads.
**Example:**
```typescript
// src/components/admin/image-upload.tsx (client component)
'use client'

import { createClient } from '@/lib/supabase/client'

async function uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Upload error:', error.message)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
```

### Pattern 3: Shared Form Component for Create/Edit
**What:** Single form component that works for both creating and editing, receiving optional initial data.
**When to use:** Projects, experience, education.
**Example:**
```typescript
// src/components/admin/project-form.tsx
'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createProject, updateProject } from '@/actions/projects'
import { toast } from 'sonner'
import type { Project } from '@/lib/types/database'

interface ProjectFormProps {
  project?: Project  // undefined = create mode, defined = edit mode
}

export function ProjectForm({ project }: ProjectFormProps) {
  const action = project ? updateProject.bind(null, project.id) : createProject
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    // success redirects automatically via server action
  }, [state])

  return (
    <form action={formAction}>
      {/* form fields with defaultValue={project?.field} */}
    </form>
  )
}
```

### Pattern 4: Reusable Delete Confirmation
**What:** AlertDialog wrapping a delete server action with confirmation.
**When to use:** All delete operations.
**Example:**
```typescript
// src/components/admin/delete-dialog.tsx
'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteDialogProps {
  onConfirm: () => void
  isPending: boolean
  trigger: React.ReactNode
}
```

### Anti-Patterns to Avoid
- **Passing File objects through server actions:** Server actions have a 1MB body limit by default. Upload files client-side to Supabase Storage, then pass the resulting URL string to the server action.
- **Using the service role key client-side:** Never expose the service role key. Use RLS policies to control storage access. The anon key + RLS is sufficient.
- **Building custom state management for forms:** Use `useActionState` from React 19 -- it handles pending state, error state, and form reset natively.
- **Separate query files for admin vs public:** Extend existing query files in `src/lib/queries/` with mutation functions rather than creating separate admin query files.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data tables | Custom div-based table | Shadcn Table component | Accessible, styled, consistent with design system |
| Delete confirmations | window.confirm() | Shadcn AlertDialog | Styled consistently, accessible, non-blocking |
| Toast notifications | Custom notification system | Sonner (already installed) | Already used in contact form, consistent UX |
| File upload dropzone | Complex drag-and-drop from scratch | Simple onDragOver/onDrop + input[type=file] | Native HTML5 drag events are sufficient for single-file upload zones |
| Slug generation | Manual slug logic | Simple regex replace: `title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')` | One-liner, no library needed |
| Form state management | useState for every field | `useActionState` + FormData + `defaultValue` | React 19 pattern already established in codebase |

## Common Pitfalls

### Pitfall 1: Server Action Body Size Limit for File Uploads
**What goes wrong:** Uploading images through server actions fails silently or throws when file exceeds 1MB.
**Why it happens:** Next.js server actions default to 1MB body limit.
**How to avoid:** Upload files client-side directly to Supabase Storage using the browser client. Pass only the resulting URL string to the server action.
**Warning signs:** Form submission fails with no error message when attaching images.

### Pitfall 2: Missing revalidatePath After Mutations
**What goes wrong:** Admin makes a change but the list page still shows stale data.
**Why it happens:** Next.js caches server component data. Without revalidation, cached data persists.
**How to avoid:** Call `revalidatePath('/admin/projects')` AND `revalidatePath('/')` (or relevant public path) after every mutation to refresh both admin and public views.
**Warning signs:** Changes appear after manual page refresh but not after redirect.

### Pitfall 3: Supabase Storage Bucket Not Public
**What goes wrong:** Uploaded images return 403 or broken image URLs on the public site.
**Why it happens:** Supabase Storage buckets are private by default.
**How to avoid:** Create a public bucket (e.g., "portfolio") via Supabase dashboard or API. Set appropriate RLS policies: public read for all, write only for authenticated users.
**Warning signs:** Images work in admin (authenticated) but not on public pages.

### Pitfall 4: Race Condition Between Upload and Form Submit
**What goes wrong:** Form submits before file upload completes, saving null URL.
**Why it happens:** File upload is async, form submission is separate.
**How to avoid:** Disable the submit button until upload completes. Store the uploaded URL in component state, include it as a hidden form field. Only enable submit when upload is done.
**Warning signs:** Records saved with null image URLs intermittently.

### Pitfall 5: Forgetting to Revalidate Public Pages
**What goes wrong:** Admin updates content but public portfolio still shows old data.
**Why it happens:** Only revalidating admin paths, not the public home page or project detail pages.
**How to avoid:** Revalidate all affected paths: `revalidatePath('/')` for home page sections, `revalidatePath('/projects/[slug]')` for project details.

### Pitfall 6: Skill Reorder Off-by-One
**What goes wrong:** Moving skills up/down produces unexpected ordering or errors at boundaries.
**Why it happens:** Not handling edge cases (first item can't move up, last can't move down).
**How to avoid:** Disable the up arrow on the first item and down arrow on the last item. Swap `display_order` values between adjacent items in a single transaction.

## Code Examples

### Server Action with Bound ID (for edit operations)
```typescript
// src/actions/projects.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProject(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title is required.' }

  const { error } = await supabase
    .from('projects')
    .update({
      title: title.trim(),
      slug: formData.get('slug') as string,
      short_description: formData.get('short_description') as string,
      full_description: formData.get('full_description') as string,
      tech_stack: JSON.parse(formData.get('tech_stack') as string || '[]'),
      github_url: formData.get('github_url') as string || null,
      live_url: formData.get('live_url') as string || null,
      thumbnail_url: formData.get('thumbnail_url') as string || null,
      featured: formData.get('featured') === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating project:', error.message)
    return { error: 'Failed to update project.' }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}
```

### Client-Side Image Upload Component Pattern
```typescript
// Drag-and-drop zone pattern
'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  bucket: string
  folder: string
  currentUrl?: string | null
  onUpload: (url: string) => void
}

export function ImageUpload({ bucket, folder, currentUrl, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return

    setUploading(true)
    setPreview(URL.createObjectURL(file))

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (error) {
      console.error('Upload failed:', error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    onUpload(urlData.publicUrl)
    setUploading(false)
  }, [bucket, folder, onUpload])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded" />
      ) : (
        <p className="text-muted-foreground">Drag & drop or click to upload</p>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
```

### Skill Reorder Pattern
```typescript
// src/actions/skills.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reorderSkill(
  skillId: string,
  direction: 'up' | 'down'
) {
  const supabase = await createClient()

  // Get current skill
  const { data: skill } = await supabase
    .from('skills')
    .select('id, display_order, category')
    .eq('id', skillId)
    .single()

  if (!skill) return { error: 'Skill not found' }

  // Get adjacent skill in same category
  const { data: adjacent } = await supabase
    .from('skills')
    .select('id, display_order')
    .eq('category', skill.category)
    .order('display_order', { ascending: direction === 'up' ? false : true })
    .filter('display_order', direction === 'up' ? 'lt' : 'gt', skill.display_order)
    .limit(1)
    .single()

  if (!adjacent) return { error: 'Cannot move further' }

  // Swap display_order values
  await supabase.from('skills').update({ display_order: adjacent.display_order }).eq('id', skill.id)
  await supabase.from('skills').update({ display_order: skill.display_order }).eq('id', adjacent.id)

  revalidatePath('/admin/skills')
  revalidatePath('/')
}
```

### Tag Input Pattern (for project tech stack)
```typescript
// src/components/admin/tag-input.tsx
'use client'

import { useState, type KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-lg border p-2">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button type="button" onClick={() => onChange(value.filter(t => t !== tag))}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        className="flex-1 min-w-[120px] border-0 p-0 h-auto focus-visible:ring-0"
      />
    </div>
  )
}
```

### Messages Inbox with Expandable Rows
```typescript
// Pattern for expandable message row
'use client'

import { useState } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { toggleMessageRead } from '@/actions/messages'

export function MessageRow({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false)

  const handleExpand = async () => {
    setExpanded(!expanded)
    if (!expanded && !message.is_read) {
      await toggleMessageRead(message.id, true)
    }
  }

  return (
    <>
      <TableRow
        onClick={handleExpand}
        className={`cursor-pointer ${!message.is_read ? 'font-semibold' : ''}`}
      >
        <TableCell>
          {!message.is_read && <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />}
          {message.name}
        </TableCell>
        <TableCell>{message.email}</TableCell>
        <TableCell className="text-muted-foreground">
          {new Date(message.created_at).toLocaleDateString()}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3} className="bg-muted/50 p-4">
            <p className="whitespace-pre-wrap">{message.message}</p>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| API routes for mutations | Server actions (`'use server'`) | Next.js 14+ (stable) | No API route files needed, colocated with logic |
| useState + onSubmit | useActionState (React 19) | React 19 (2024) | Built-in pending state, progressive enhancement |
| react-hook-form + zod | Native FormData + server validation | React 19 pattern | Fewer dependencies for simple forms |
| Signed upload URLs | Direct client upload with RLS | Supabase Storage current | Simpler for single-user admin apps with RLS |

## Supabase Storage Setup

### Bucket Configuration (Claude's Discretion)
**Recommendation:** Create a single public bucket named `portfolio` with folders:
- `avatars/` -- profile photos
- `projects/` -- project screenshots and thumbnails
- `resumes/` -- resume PDF files

**File naming convention:** `{folder}/{timestamp}.{extension}` (e.g., `projects/1710345600000.webp`)

**RLS Policies needed on `storage.objects`:**
- Public read: `SELECT` for all users (bucket_id = 'portfolio')
- Authenticated write: `INSERT`, `UPDATE`, `DELETE` for authenticated users only

### Next.js Config
The existing `next.config.ts` already has `images.remotePatterns` configured for `*.supabase.co/storage/v1/object/public/**`, so Next.js `<Image>` components will work with Supabase Storage URLs without changes.

## Open Questions

1. **Supabase Storage bucket creation**
   - What we know: Buckets can be created via dashboard or API
   - What's unclear: Whether the bucket already exists in the user's Supabase project
   - Recommendation: Document bucket creation as a setup step in Wave 0; provide SQL migration or dashboard instructions

2. **Tech stack field storage format**
   - What we know: The `tech_stack` column is `string[]` (PostgreSQL text array)
   - What's unclear: Whether Supabase insert/update handles JSON arrays correctly for text[] columns
   - Recommendation: Use `JSON.parse(formData.get('tech_stack'))` to convert the hidden field value; Supabase JS SDK handles array columns natively

3. **Project images management**
   - What we know: `project_images` table exists with `project_id`, `image_url`, `display_order`
   - What's unclear: Whether to manage images inline on the project form or as a separate step
   - Recommendation: Manage images inline on the project create/edit form -- add/remove images with upload zone, save all image URLs when form submits

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `src/actions/contact.ts`, `src/lib/queries/*.ts`, `src/components/contact/contact-form.tsx` -- established patterns
- Supabase Storage upload docs: https://supabase.com/docs/guides/storage/uploads/standard-uploads
- Supabase JS storage.from().upload() API: https://supabase.com/docs/reference/javascript/storage-from-upload
- Supabase JS storage.from().getPublicUrl() API: https://supabase.com/docs/reference/javascript/storage-from-getpublicurl

### Secondary (MEDIUM confidence)
- Next.js server actions bodySizeLimit: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions -- 1MB default confirmed
- Shadcn UI components (table, dialog, alert-dialog): https://ui.shadcn.com/docs/components -- available for base-nova style

### Tertiary (LOW confidence)
- None -- all findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and in use; patterns established in Phase 1-2
- Architecture: HIGH -- follows existing codebase patterns (server actions, query functions, component structure)
- Pitfalls: HIGH -- file upload size limit is well-documented; revalidation patterns verified in Next.js docs
- Storage upload: HIGH -- verified with official Supabase docs

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable stack, no fast-moving dependencies)

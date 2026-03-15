# Phase 5: Animated Statistics - Research

**Researched:** 2026-03-15
**Domain:** Supabase CRUD, Motion spring animations, drag-and-drop reordering, dynamic Lucide icons
**Confidence:** HIGH

## Summary

Phase 5 adds admin-managed statistic counters (label, numeric value, optional suffix, Lucide icon name) that display on the public portfolio with spring-animated count-up triggered on scroll. The implementation follows established project patterns: a new `statistics` Supabase table, server actions for CRUD, a query module, admin management page with drag-and-drop reordering, and a public section component placed between About and Projects.

The count-up animation uses Motion's `useMotionValue`, `useTransform`, and `animate()` -- all already available in the installed `motion` v12.36.0 package. The `useInView` hook (also from `motion/react`) triggers the animation once when the section scrolls into view. For drag-and-drop reordering, `@dnd-kit/core` + `@dnd-kit/sortable` is the only viable option since `@hello-pangea/dnd` does not support React 19. Dynamic icon rendering uses `lucide-react/dynamic`'s `DynamicIcon` component since the icon name is stored as a string in the database.

**Primary recommendation:** Use existing `motion/react` hooks for count-up animation (no new animation packages needed), add `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop reordering, and use `DynamicIcon` from `lucide-react/dynamic` for rendering icons by name string.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Horizontal row of cards with subtle border/shadow, side by side on desktop
- Icon sits above the number, label at the bottom -- vertical stack per card
- No section heading -- the numbers speak for themselves
- Placed between the About and Projects sections on the public page
- Section hidden entirely when no stats exist in the database
- Count-up duration: ~3 seconds (slow, dramatic build-up)
- Spring physics: smooth ease-out, no bouncy overshoot -- professional feel
- All cards start counting simultaneously when section scrolls into view
- Numbers only animate -- cards are already visible, no fade/slide entry
- Animation triggers only once per page load (useInView with once: true)
- Icon selection: admin types a Lucide icon name (e.g., 'briefcase', 'code', 'rocket')
- Reordering: drag and drop (not up/down arrows)
- Simple preview panel showing how the stat card will look while editing
- No limit on number of stats -- layout wraps as needed
- Fields per stat: label, numeric value, suffix (optional), icon name, display order
- Default stats to seed: Years of Experience (4+), Projects Completed (20+), Technologies Used (15+), Companies Worked At (4)
- Suffix field supports "+" for estimates -- admin sets per stat
- Hide entire section when no stats exist (don't show empty state placeholder)

### Claude's Discretion
- Exact card shadow/border styling and spacing
- Mobile breakpoint behavior (likely 2x2 grid or single column)
- Icon size and color treatment
- Drag and drop library choice
- Preview panel positioning and styling
- Database table schema details

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| STAT-01 | Admin can create, edit, delete, and reorder statistic entries (label, value, suffix, icon) | Supabase `statistics` table with RLS, server actions following skills.ts pattern, @dnd-kit for drag-and-drop reorder |
| STAT-02 | Public site displays statistics section with spring-animated count-up triggered on scroll into view | Motion `useMotionValue` + `useTransform` + `animate()` with spring config, `useInView` for scroll trigger |
| STAT-03 | Count-up animation triggers only once per page load (not on every scroll) | `useInView` with `once: true` option (same pattern as existing `defaultViewport` in `lib/motion.ts`) |
| STAT-04 | Statistics section displays in responsive grid (stacked on mobile, row on desktop) | Tailwind responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with flex-wrap fallback |

</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.36.0 | Spring count-up animation, useInView | Already used throughout project for animations |
| lucide-react | 0.577.0 | Dynamic icon rendering by name | Already used for all icons in admin and public site |
| @supabase/ssr | 0.9.0 | Server-side Supabase client | Standard project database access pattern |
| next | 16.1.6 | Server components, server actions, revalidation | Project framework |

### New Packages
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/core | ^6.3.x | Drag-and-drop context provider and sensors | Admin statistics reordering |
| @dnd-kit/sortable | ^10.x | Sortable preset (useSortable, SortableContext) | Vertical list drag-and-drop |
| @dnd-kit/utilities | ^3.x | CSS utilities (CSS.Transform.toString) | Transform styles for drag handles |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @dnd-kit | @hello-pangea/dnd | Does NOT support React 19 -- incompatible with this project |
| @dnd-kit/core+sortable | @dnd-kit/react (v0.3.x) | Pre-1.0, API unstable -- too risky for production |
| DynamicIcon | dynamicIconImports + next/dynamic | More setup but smaller bundle; DynamicIcon simpler for admin-only page |

**Installation:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── actions/
│   └── statistics.ts          # Server actions: create, update, delete, reorder
├── lib/
│   ├── queries/
│   │   └── statistics.ts      # getStatistics(), getStatisticById()
│   └── types/
│       └── database.ts        # Add Statistic interface
├── components/
│   ├── admin/
│   │   ├── statistic-form.tsx  # Form for create/edit with live preview
│   │   └── statistics-list.tsx # Drag-and-drop sortable list
│   └── sections/
│       └── statistics-section.tsx  # Public animated section
├── app/
│   ├── admin/
│   │   └── statistics/
│   │       └── page.tsx        # Admin statistics management page
│   └── (public)/
│       └── page.tsx            # Add StatisticsSection between About and Projects
└── supabase/
    └── migrations/
        └── 002_statistics.sql  # New table + RLS + seed data
```

### Pattern 1: Count-Up Animation with Motion
**What:** Animate a number from 0 to target value using spring physics when scrolled into view
**When to use:** Public statistics section
**Example:**
```typescript
// Source: motion/react docs + project pattern from scroll-reveal.tsx
"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useTransform, animate } from "motion/react"

interface CountUpProps {
  to: number
  suffix?: string
}

export function CountUp({ to, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, to, {
        duration: 3,
        ease: "easeOut",
      })
    }
  }, [isInView, motionValue, to])

  // Subscribe to rounded changes and update DOM directly
  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest}${suffix}`
      }
    })
    return unsubscribe
  }, [rounded, suffix])

  return <span ref={ref}>0{suffix}</span>
}
```

### Pattern 2: Server Actions with Display Order (existing project pattern)
**What:** CRUD operations following the skills.ts pattern with display_order management
**When to use:** Admin statistics management
**Example:**
```typescript
// Source: existing src/actions/skills.ts pattern
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStatistic(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const label = formData.get('label') as string
  const value = Number(formData.get('value'))
  const suffix = (formData.get('suffix') as string) || null
  const icon_name = formData.get('icon_name') as string

  if (!label?.trim()) return { error: 'Label is required.' }
  if (isNaN(value)) return { error: 'Value must be a number.' }
  if (!icon_name?.trim()) return { error: 'Icon name is required.' }

  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from('statistics')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (maxOrderData?.display_order ?? -1) + 1

  const { error } = await supabase.from('statistics').insert({
    label: label.trim(),
    value,
    suffix: suffix?.trim() || null,
    icon_name: icon_name.trim(),
    display_order,
  })

  if (error) return { error: 'Failed to create statistic.' }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  redirect('/admin/statistics')
}
```

### Pattern 3: Drag-and-Drop Sortable List with @dnd-kit
**What:** Vertical sortable list with drag handles for reordering statistics
**When to use:** Admin statistics page
**Example:**
```typescript
// Source: @dnd-kit/sortable docs
"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
```

### Pattern 4: Dynamic Lucide Icon by Name
**What:** Render a Lucide icon from a string name stored in the database
**When to use:** Both admin preview and public statistics cards
**Example:**
```typescript
// Source: lucide-react docs (lucide.dev/guide/packages/lucide-react)
import { DynamicIcon } from "lucide-react/dynamic"

// In component:
<DynamicIcon name={stat.icon_name} size={32} className="text-primary" />
```

**Note:** `DynamicIcon` imports all icons into the bundle. This is acceptable here because:
1. It is used on the admin page (which is not public-facing performance-critical)
2. For the public section, consider a small icon map of only the icons actually stored in the database, OR accept the bundle cost since Lucide tree-shakes well with dynamic imports

### Anti-Patterns to Avoid
- **Animating with React state updates:** Do NOT use `useState` + `setInterval` for count-up. This causes re-renders every frame. Use Motion's `useMotionValue` which updates outside React's render cycle.
- **Re-triggering animation on every scroll:** Always use `once: true` with `useInView`. Without it, scrolling past and back re-triggers the count.
- **Storing icon component references in DB:** Store the icon NAME string (e.g., "briefcase"), not a component reference. Render dynamically at runtime.
- **Using `framer-motion` import path:** This project uses `motion/react` (the v12 import path). Do not import from `framer-motion`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop reordering | Custom mousedown/touchstart handlers | @dnd-kit/sortable | Accessibility (keyboard, screen reader), touch support, collision detection |
| Spring count-up animation | setInterval + useState counter | motion/react useMotionValue + animate | 60fps without re-renders, proper easing, spring physics |
| Dynamic icon rendering | Switch statement mapping names to components | DynamicIcon from lucide-react/dynamic | Handles all 1400+ icons, fallback handling, type safety |
| Scroll detection | IntersectionObserver manually | useInView from motion/react | Already integrated with Motion ecosystem, once option built-in |

**Key insight:** The motion library already installed in this project provides everything needed for the count-up animation. No new animation library is needed.

## Common Pitfalls

### Pitfall 1: useMotionValue Display Not Updating
**What goes wrong:** Using `{rounded}` in JSX renders the initial value only -- Motion values don't trigger React re-renders.
**Why it happens:** `useMotionValue` is designed to avoid re-renders for performance.
**How to avoid:** Either (a) use `motion.span` with the motion value, or (b) subscribe to changes with `rounded.on("change", callback)` and update DOM directly via ref.
**Warning signs:** Number stays at 0 and never animates.

### Pitfall 2: Suffix Appearing After Count Finishes
**What goes wrong:** The "+" suffix pops in after the number finishes counting.
**Why it happens:** Suffix rendered separately, not tied to the animation.
**How to avoid:** Include the suffix in the same DOM update as the number. When updating via `ref.current.textContent`, concatenate: `${latest}${suffix}`.

### Pitfall 3: DndContext Missing Sensors for Touch/Keyboard
**What goes wrong:** Drag-and-drop only works with mouse, fails on mobile or keyboard navigation.
**Why it happens:** Default DndContext uses only pointer sensor.
**How to avoid:** Configure both `PointerSensor` and `KeyboardSensor` via `useSensors`.

### Pitfall 4: Display Order Gaps After Delete
**What goes wrong:** After deleting a stat, display_order has gaps (e.g., 0, 1, 3).
**Why it happens:** Only the deleted row is removed; remaining orders are not compacted.
**How to avoid:** Either (a) accept gaps (Supabase `ORDER BY display_order` still works correctly), or (b) recompact on delete. Option (a) is simpler and sufficient.

### Pitfall 5: DynamicIcon Bundle Size on Public Page
**What goes wrong:** `DynamicIcon` from `lucide-react/dynamic` imports ALL Lucide icons into the client bundle.
**Why it happens:** It needs to map any string to any icon at runtime.
**How to avoid:** For the public statistics section, consider using `dynamicIconImports` with `next/dynamic` for lazy loading, or accept the cost since stats are a small section. For admin, the cost is acceptable.

## Code Examples

### Database Migration (SQL)
```sql
-- 002_statistics.sql
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value INT NOT NULL,
  suffix TEXT,
  icon_name TEXT NOT NULL DEFAULT 'hash',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON statistics FOR SELECT USING (true);
CREATE POLICY "Authenticated insert" ON statistics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON statistics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON statistics FOR DELETE TO authenticated USING (true);

-- Seed default statistics
INSERT INTO statistics (label, value, suffix, icon_name, display_order) VALUES
  ('Years of Experience', 4, '+', 'calendar', 0),
  ('Projects Completed', 20, '+', 'folder-kanban', 1),
  ('Technologies Used', 15, '+', 'code', 2),
  ('Companies Worked At', 4, NULL, 'briefcase', 3);
```

### TypeScript Type (add to database.ts)
```typescript
export interface Statistic {
  id: string
  label: string
  value: number
  suffix: string | null
  icon_name: string
  display_order: number
  created_at: string
  updated_at: string
}
```

### Query Module
```typescript
// src/lib/queries/statistics.ts
import { createClient } from '@/lib/supabase/server'
import type { Statistic } from '@/lib/types/database'

export async function getStatistics(): Promise<Statistic[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching statistics:', error.message)
    return []
  }
  return data ?? []
}
```

### Drag-and-Drop Reorder Server Action
```typescript
// In src/actions/statistics.ts
export async function reorderStatistics(orderedIds: string[]) {
  const supabase = await createClient()

  // Update all display_orders in a batch
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('statistics')
      .update({ display_order: index })
      .eq('id', id)
  )

  await Promise.all(updates)

  revalidatePath('/admin/statistics')
  revalidatePath('/')
}
```

### Public Section Integration
```typescript
// In src/app/(public)/page.tsx -- add between About and Projects
<ScrollReveal>
  <AboutSection />
</ScrollReveal>
<StatisticsSection />   {/* No ScrollReveal wrapper -- cards visible, only numbers animate */}
<ScrollReveal>
  <ProjectsSection />
</ScrollReveal>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (import from `motion/react`) | 2024 (v11+) | Different import path, same API |
| `@hello-pangea/dnd` for lists | `@dnd-kit/core` + `@dnd-kit/sortable` | 2024 (React 19) | hello-pangea does not support React 19 |
| Manual IntersectionObserver | `useInView` from motion/react | 2023+ | Built-in once option, cleaner API |
| Icon switch/map components | `DynamicIcon` from lucide-react/dynamic | 2024 | Official dynamic icon support |

**Deprecated/outdated:**
- `react-beautiful-dnd`: Deprecated, replaced by `@hello-pangea/dnd` (which itself doesn't support React 19)
- `framer-motion` import path: Replaced by `motion/react` in v11+
- `useState` + `requestAnimationFrame` counters: Replaced by Motion value-based animation

## Open Questions

1. **DynamicIcon bundle impact on public page**
   - What we know: DynamicIcon imports all icons (~200KB). The public statistics section renders server-side but the icon component is client-side.
   - What's unclear: Exact bundle size impact with tree-shaking in Next.js 16.
   - Recommendation: Start with DynamicIcon for simplicity. If bundle analysis shows concern, switch to `dynamicIconImports` with `next/dynamic` for lazy loading per-icon.

2. **@dnd-kit/sortable version compatibility**
   - What we know: Peer dep is `>=16.8.0` for React, so React 19 installs without errors.
   - What's unclear: Whether there are runtime issues with React 19's concurrent features.
   - Recommendation: Install and test. If issues arise, fall back to simple up/down arrow buttons (the existing project pattern from skills).

## Sources

### Primary (HIGH confidence)
- Project codebase analysis: `src/actions/skills.ts`, `src/lib/queries/skills.ts`, `src/app/admin/skills/` -- established CRUD + reorder patterns
- Project codebase: `src/lib/motion.ts`, `src/components/motion/scroll-reveal.tsx` -- existing animation patterns
- Project `package.json`: `motion` v12.36.0, `lucide-react` v0.577.0, React 19.2.3, Next 16.1.6
- Supabase migration `001_portfolio_schema.sql` -- RLS policy pattern
- npm registry: `@dnd-kit/core` peerDependencies `>=16.8.0` (verified via `npm info`)

### Secondary (MEDIUM confidence)
- [Lucide React DynamicIcon docs](https://lucide.dev/guide/packages/lucide-react) -- DynamicIcon component API
- [@dnd-kit sortable docs](https://docs.dndkit.com/presets/sortable) -- SortableContext, verticalListSortingStrategy
- [Animated counter gist](https://gist.github.com/bonface221/f1d4d42992ac71c4289702c7da0a5b3f) -- useMotionValue + useInView + animate pattern
- [Motion useSpring docs](https://motion.dev/docs/react-use-spring) -- spring configuration options

### Tertiary (LOW confidence)
- @hello-pangea/dnd React 19 incompatibility -- based on [GitHub issue #864](https://github.com/hello-pangea/dnd/issues/864) and npm peer dep analysis
- @dnd-kit/react v0.3.x stability -- based on version number being pre-1.0

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all core libraries already installed, only @dnd-kit is new and verified compatible
- Architecture: HIGH -- follows exact patterns established in phases 1-4 (skills CRUD, scroll-reveal, server actions)
- Pitfalls: HIGH -- common issues well-documented in Motion and @dnd-kit ecosystems
- Animation approach: HIGH -- useMotionValue + animate is the standard Motion pattern for count-up

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable ecosystem, no fast-moving dependencies)

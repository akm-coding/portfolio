'use client'

import { useEffect, useState } from 'react'
import { icons } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

/**
 * Renders a Lucide icon by its kebab-case name (e.g. "folder-kanban", "code", "briefcase").
 * Falls back to "Hash" icon if the name is not found.
 * Client-only rendering to avoid hydration mismatch.
 */
export function DynamicIcon({
  name,
  size,
  ...props
}: { name: string } & LucideProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span style={{ display: 'inline-block', width: size ?? 24, height: size ?? 24 }} />
  }

  // Convert kebab-case to PascalCase: "folder-kanban" -> "FolderKanban"
  const pascalName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const IconComponent = icons[pascalName as keyof typeof icons]

  if (!IconComponent) {
    const Fallback = icons['Hash']
    return <Fallback size={size} {...props} />
  }

  return <IconComponent size={size} {...props} />
}

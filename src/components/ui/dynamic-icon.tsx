'use client'

import { icons } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

/**
 * Renders a Lucide icon by its kebab-case name (e.g. "folder-kanban", "code", "briefcase").
 * Falls back to "Hash" icon if the name is not found.
 */
export function DynamicIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  // Convert kebab-case to PascalCase: "folder-kanban" -> "FolderKanban"
  const pascalName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const IconComponent = icons[pascalName as keyof typeof icons]

  if (!IconComponent) {
    const Fallback = icons['Hash']
    return <Fallback {...props} />
  }

  return <IconComponent {...props} />
}

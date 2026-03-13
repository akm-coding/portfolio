'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/actions/projects'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ProjectActionsProps {
  projectId: string
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProject(projectId)
    })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/admin/projects/${projectId}/edit`} />}>
        <Pencil className="h-4 w-4" />
      </Button>
      <DeleteDialog onConfirm={handleDelete} isPending={isPending}>
        <Button variant="ghost" size="icon-sm" disabled={isPending}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </DeleteDialog>
    </div>
  )
}

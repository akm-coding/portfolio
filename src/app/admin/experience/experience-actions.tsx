'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { deleteExperience } from '@/actions/experience'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Pencil, Trash2 } from 'lucide-react'

export function ExperienceActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(() => {
      deleteExperience(id)
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/admin/experience/${id}/edit`} />}>
        <Pencil className="h-4 w-4" />
      </Button>
      <DeleteDialog onConfirm={handleDelete} isPending={isPending}>
        <Button variant="ghost" size="icon-sm">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </DeleteDialog>
    </div>
  )
}

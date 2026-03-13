'use client'

import { useActionState, useEffect, useState } from 'react'
import { createExperience, updateExperience } from '@/actions/experience'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Experience } from '@/lib/types/database'

interface ExperienceFormProps {
  experience?: Experience
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const action = experience
    ? updateExperience.bind(null, experience.id)
    : createExperience
  const [state, formAction, isPending] = useActionState(action, null)
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? false)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          required
          defaultValue={experience?.company}
          placeholder="Company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          required
          defaultValue={experience?.role}
          placeholder="Job title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={experience?.description ?? ''}
          placeholder="Describe your role and responsibilities..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            required
            defaultValue={experience?.start_date}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            disabled={isCurrent}
            defaultValue={experience?.end_date ?? ''}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_current"
          name="is_current"
          type="checkbox"
          value="true"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="is_current">I currently work here</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? experience
              ? 'Updating...'
              : 'Creating...'
            : experience
              ? 'Update'
              : 'Create'}
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/experience" />}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

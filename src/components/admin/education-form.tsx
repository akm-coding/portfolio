'use client'

import { useActionState, useEffect } from 'react'
import { createEducation, updateEducation } from '@/actions/education'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Education } from '@/lib/types/database'

interface EducationFormProps {
  education?: Education
}

export function EducationForm({ education }: EducationFormProps) {
  const action = education
    ? updateEducation.bind(null, education.id)
    : createEducation
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          name="institution"
          required
          defaultValue={education?.institution}
          placeholder="University or institution name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          name="degree"
          required
          defaultValue={education?.degree}
          placeholder="e.g. Bachelor of Science"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="field_of_study">Field of Study</Label>
        <Input
          id="field_of_study"
          name="field_of_study"
          defaultValue={education?.field_of_study ?? ''}
          placeholder="e.g. Computer Science"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={education?.description ?? ''}
          placeholder="Notable achievements, coursework, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={education?.start_date}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={education?.end_date ?? ''}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? education
              ? 'Updating...'
              : 'Creating...'
            : education
              ? 'Update'
              : 'Create'}
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/education" />}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useActionState, useEffect } from 'react'
import { createSkill, updateSkill } from '@/actions/skills'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Skill } from '@/lib/types/database'

const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'DevOps',
  'Tools',
  'Languages',
  'Databases',
  'Other',
] as const

interface SkillFormProps {
  skill?: Skill
  onCancel?: () => void
}

export function SkillForm({ skill, onCancel }: SkillFormProps) {
  const action = skill ? updateSkill.bind(null, skill.id) : createSkill
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex-1 min-w-[150px]">
        <Input
          name="name"
          required
          defaultValue={skill?.name}
          placeholder="Skill name"
        />
      </div>

      <div className="w-[180px]">
        <Select name="category" defaultValue={skill?.category ?? 'Frontend'}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {SKILL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? 'Saving...' : skill ? 'Save' : 'Add Skill'}
      </Button>

      {onCancel && (
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  )
}

'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { createStatistic, updateStatistic } from '@/actions/statistics'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import type { Statistic } from '@/lib/types/database'

interface StatisticFormProps {
  statistic?: Statistic
}

export function StatisticForm({ statistic }: StatisticFormProps) {
  const action = statistic
    ? updateStatistic.bind(null, statistic.id)
    : createStatistic
  const [state, formAction, isPending] = useActionState(action, null)

  // Local state for live preview
  const [label, setLabel] = useState(statistic?.label ?? '')
  const [value, setValue] = useState(statistic?.value?.toString() ?? '')
  const [suffix, setSuffix] = useState(statistic?.suffix ?? '')
  const [iconName, setIconName] = useState(statistic?.icon_name ?? 'hash')

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            required
            defaultValue={statistic?.label}
            placeholder="e.g. Years of Experience"
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            name="value"
            type="number"
            required
            defaultValue={statistic?.value}
            placeholder="e.g. 10"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suffix">Suffix (optional)</Label>
          <Input
            id="suffix"
            name="suffix"
            defaultValue={statistic?.suffix ?? ''}
            placeholder="e.g. +"
            onChange={(e) => setSuffix(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_name">Icon Name</Label>
          <Input
            id="icon_name"
            name="icon_name"
            required
            defaultValue={statistic?.icon_name ?? 'hash'}
            placeholder="e.g. briefcase, code, rocket"
            onChange={(e) => setIconName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use kebab-case Lucide icon names. Examples: calendar, folder-kanban, code, briefcase, rocket
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : statistic ? 'Save Changes' : 'Create Statistic'}
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/statistics" />}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Preview</p>
        <Card className="max-w-[220px]">
          <CardContent className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <DynamicIcon name={iconName || 'hash'} className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold">
              {value || '0'}
              {suffix && <span className="text-primary">{suffix}</span>}
            </p>
            <p className="text-sm text-muted-foreground">
              {label || 'Label'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

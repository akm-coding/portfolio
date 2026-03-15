'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderStatistics, deleteStatistic } from '@/actions/statistics'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-react'
import type { Statistic } from '@/lib/types/database'

interface StatisticsListProps {
  statistics: Statistic[]
}

function SortableItem({
  statistic,
  onDelete,
  isPending,
}: {
  statistic: Statistic
  onDelete: (id: string) => void
  isPending: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: statistic.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border bg-background px-4 py-3"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <DynamicIcon name={statistic.icon_name} className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{statistic.label}</p>
      </div>

      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {statistic.value}
        {statistic.suffix && statistic.suffix}
      </p>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href={`/admin/statistics?edit=${statistic.id}`} />}>
          <Pencil className="h-4 w-4" />
        </Button>
        <DeleteDialog
          onConfirm={() => onDelete(statistic.id)}
          isPending={isPending}
        >
          <Button variant="ghost" size="icon-sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </DeleteDialog>
      </div>
    </div>
  )
}

export function StatisticsList({ statistics }: StatisticsListProps) {
  const [items, setItems] = useState(statistics)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id)
        const newIndex = prev.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(prev, oldIndex, newIndex)

        // Persist new order
        startTransition(async () => {
          await reorderStatistics(newItems.map((item) => item.id))
        })

        return newItems
      })
    }
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteStatistic(id)
    })
  }

  return (
    <div className="space-y-4">
      <Button nativeButton={false} render={<Link href="/admin/statistics?new=true" />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Statistic
      </Button>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          No statistics yet. Add your first statistic.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((statistic) => (
                <SortableItem
                  key={statistic.id}
                  statistic={statistic}
                  onDelete={handleDelete}
                  isPending={isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

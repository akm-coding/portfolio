'use client'

import { useState, useTransition } from 'react'
import { reorderSkill, deleteSkill } from '@/actions/skills'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { SkillForm } from '@/components/admin/skill-form'
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from 'lucide-react'
import type { Skill } from '@/lib/types/database'

interface SkillsListProps {
  skills: Skill[]
}

export function SkillsList({ skills }: SkillsListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  const handleReorder = (skillId: string, direction: 'up' | 'down') => {
    startTransition(async () => {
      await reorderSkill(skillId, direction)
    })
  }

  const handleDelete = (skillId: string) => {
    startTransition(async () => {
      await deleteSkill(skillId)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        {showAddForm ? (
          <SkillForm onCancel={() => setShowAddForm(false)} />
        ) : (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-muted-foreground">No skills yet. Add your first skill.</p>
      ) : (
        categories.map((category) => {
          const categorySkills = grouped[category]
          return (
            <div key={category} className="space-y-2">
              <h2 className="text-lg font-semibold">{category}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[200px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySkills.map((skill, index) => (
                    <TableRow key={skill.id}>
                      {editingId === skill.id ? (
                        <TableCell colSpan={2}>
                          <SkillForm
                            skill={skill}
                            onCancel={() => setEditingId(null)}
                          />
                        </TableCell>
                      ) : (
                        <>
                          <TableCell className="font-medium">{skill.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={index === 0 || isPending}
                                onClick={() => handleReorder(skill.id, 'up')}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={index === categorySkills.length - 1 || isPending}
                                onClick={() => handleReorder(skill.id, 'down')}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setEditingId(skill.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <DeleteDialog
                                onConfirm={() => handleDelete(skill.id)}
                                isPending={isPending}
                              >
                                <Button variant="ghost" size="icon-sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </DeleteDialog>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        })
      )}
    </div>
  )
}

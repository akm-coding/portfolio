'use client'

import { useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { reorderProjects, deleteProject } from '@/actions/projects'
import type { Project } from '@/lib/types/database'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const dragCounter = useRef(0)

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnter = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setOverIndex(index)
  }

  const handleDragLeave = () => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setOverIndex(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }

    const reordered = [...projects]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    setProjects(reordered)
    setDragIndex(null)
    setOverIndex(null)

    startTransition(async () => {
      await reorderProjects(reordered.map((p) => p.id))
    })
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
    dragCounter.current = 0
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      await deleteProject(id)
      setDeletingId(null)
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Tech Stack</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project, index) => (
          <TableRow
            key={project.id}
            draggable
            onDragStart={handleDragStart(index)}
            onDragEnter={handleDragEnter(index)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`${dragIndex === index ? 'opacity-50' : ''} ${
              overIndex === index && dragIndex !== index
                ? 'border-t-2 border-t-primary'
                : ''
            }`}
          >
            <TableCell>
              <GripVertical className="size-4 cursor-grab text-muted-foreground active:cursor-grabbing" />
            </TableCell>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {project.tech_stack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
                {project.tech_stack.length > 3 && (
                  <Badge variant="outline">
                    +{project.tech_stack.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {project.featured ? (
                <Badge variant="default">Featured</Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={<Link href={`/admin/projects/${project.id}/edit`} />}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteDialog
                  onConfirm={() => handleDelete(project.id)}
                  isPending={deletingId === project.id}
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={deletingId === project.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </DeleteDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

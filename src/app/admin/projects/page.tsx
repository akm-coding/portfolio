import { getProjects } from '@/lib/queries/projects'
import { ProjectList } from '@/components/admin/project-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
          <Plus className="mr-1 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No projects yet.{' '}
            <Link href="/admin/projects/new" className="text-primary underline">
              Create your first project.
            </Link>
          </p>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  )
}

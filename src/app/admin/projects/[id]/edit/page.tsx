import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/queries/projects'
import { ProjectForm } from '@/components/admin/project-form'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}

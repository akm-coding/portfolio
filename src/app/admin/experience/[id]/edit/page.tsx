import { notFound } from 'next/navigation'
import { getExperienceById } from '@/lib/queries/experiences'
import { ExperienceForm } from '@/components/admin/experience-form'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Experience</h1>
      <ExperienceForm experience={experience} />
    </div>
  )
}

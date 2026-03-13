import { notFound } from 'next/navigation'
import { getEducationById } from '@/lib/queries/education'
import { EducationForm } from '@/components/admin/education-form'

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const education = await getEducationById(id)

  if (!education) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Education</h1>
      <EducationForm education={education} />
    </div>
  )
}

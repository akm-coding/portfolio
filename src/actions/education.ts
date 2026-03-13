'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEducation(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const institution = formData.get('institution') as string
  const degree = formData.get('degree') as string

  if (!institution?.trim()) return { error: 'Institution is required.' }
  if (!degree?.trim()) return { error: 'Degree is required.' }

  const { error } = await supabase.from('education').insert({
    institution: institution.trim(),
    degree: degree.trim(),
    field_of_study: (formData.get('field_of_study') as string)?.trim() || null,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    description: (formData.get('description') as string)?.trim() || null,
  })

  if (error) {
    console.error('Error creating education:', error.message)
    return { error: 'Failed to create education entry.' }
  }

  revalidatePath('/admin/education')
  revalidatePath('/')
  redirect('/admin/education')
}

export async function updateEducation(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const institution = formData.get('institution') as string
  const degree = formData.get('degree') as string

  if (!institution?.trim()) return { error: 'Institution is required.' }
  if (!degree?.trim()) return { error: 'Degree is required.' }

  const { error } = await supabase
    .from('education')
    .update({
      institution: institution.trim(),
      degree: degree.trim(),
      field_of_study: (formData.get('field_of_study') as string)?.trim() || null,
      start_date: formData.get('start_date') as string,
      end_date: (formData.get('end_date') as string) || null,
      description: (formData.get('description') as string)?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating education:', error.message)
    return { error: 'Failed to update education entry.' }
  }

  revalidatePath('/admin/education')
  revalidatePath('/')
  redirect('/admin/education')
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('education').delete().eq('id', id)

  if (error) {
    console.error('Error deleting education:', error.message)
    return { error: 'Failed to delete education entry.' }
  }

  revalidatePath('/admin/education')
  revalidatePath('/')
  redirect('/admin/education')
}

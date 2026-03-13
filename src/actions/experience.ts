'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExperience(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const company = formData.get('company') as string
  const role = formData.get('role') as string

  if (!company?.trim()) return { error: 'Company is required.' }
  if (!role?.trim()) return { error: 'Role is required.' }

  const { error } = await supabase.from('experiences').insert({
    company: company.trim(),
    role: role.trim(),
    description: (formData.get('description') as string)?.trim() || null,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    is_current: formData.get('is_current') === 'true',
  })

  if (error) {
    console.error('Error creating experience:', error.message)
    return { error: 'Failed to create experience.' }
  }

  revalidatePath('/admin/experience')
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function updateExperience(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const company = formData.get('company') as string
  const role = formData.get('role') as string

  if (!company?.trim()) return { error: 'Company is required.' }
  if (!role?.trim()) return { error: 'Role is required.' }

  const { error } = await supabase
    .from('experiences')
    .update({
      company: company.trim(),
      role: role.trim(),
      description: (formData.get('description') as string)?.trim() || null,
      start_date: formData.get('start_date') as string,
      end_date: (formData.get('end_date') as string) || null,
      is_current: formData.get('is_current') === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating experience:', error.message)
    return { error: 'Failed to update experience.' }
  }

  revalidatePath('/admin/experience')
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('experiences').delete().eq('id', id)

  if (error) {
    console.error('Error deleting experience:', error.message)
    return { error: 'Failed to delete experience.' }
  }

  revalidatePath('/admin/experience')
  revalidatePath('/')
  redirect('/admin/experience')
}

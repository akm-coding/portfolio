'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const supabase = await createClient()

  const full_name = formData.get('full_name') as string
  const title = formData.get('title') as string

  if (!full_name?.trim()) return { error: 'Full name is required.' }
  if (!title?.trim()) return { error: 'Title is required.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: full_name.trim(),
      title: title.trim(),
      tagline: (formData.get('tagline') as string)?.trim() || null,
      bio: (formData.get('bio') as string)?.trim() || null,
      avatar_url: (formData.get('avatar_url') as string) || null,
      resume_url: (formData.get('resume_url') as string) || null,
      email: (formData.get('email') as string)?.trim() || null,
      phone: (formData.get('phone') as string)?.trim() || null,
      location: (formData.get('location') as string)?.trim() || null,
      github_url: (formData.get('github_url') as string)?.trim() || null,
      linkedin_url: (formData.get('linkedin_url') as string)?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', (formData.get('id') as string))

  if (error) {
    console.error('Error updating profile:', error.message)
    return { error: 'Failed to update profile.' }
  }

  revalidatePath('/admin/profile')
  revalidatePath('/')
  return { success: true }
}

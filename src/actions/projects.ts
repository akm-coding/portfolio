'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title is required.' }

  let slug = (formData.get('slug') as string)?.trim()
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: title.trim(),
      slug,
      short_description: (formData.get('short_description') as string)?.trim() || null,
      full_description: (formData.get('full_description') as string)?.trim() || null,
      tech_stack: JSON.parse((formData.get('tech_stack') as string) || '[]'),
      github_url: (formData.get('github_url') as string)?.trim() || null,
      live_url: (formData.get('live_url') as string)?.trim() || null,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      featured: formData.get('featured') === 'true',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating project:', error.message)
    return { error: 'Failed to create project.' }
  }

  // Handle project images
  const projectImages = formData.get('project_images') as string
  if (projectImages && data) {
    const imageUrls = projectImages.split(',').filter(Boolean)
    if (imageUrls.length > 0) {
      const imageRows = imageUrls.map((url, index) => ({
        project_id: data.id,
        image_url: url.trim(),
        display_order: index,
      }))
      await supabase.from('project_images').insert(imageRows)
    }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function updateProject(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title is required.' }

  let slug = (formData.get('slug') as string)?.trim()
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const { error } = await supabase
    .from('projects')
    .update({
      title: title.trim(),
      slug,
      short_description: (formData.get('short_description') as string)?.trim() || null,
      full_description: (formData.get('full_description') as string)?.trim() || null,
      tech_stack: JSON.parse((formData.get('tech_stack') as string) || '[]'),
      github_url: (formData.get('github_url') as string)?.trim() || null,
      live_url: (formData.get('live_url') as string)?.trim() || null,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      featured: formData.get('featured') === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating project:', error.message)
    return { error: 'Failed to update project.' }
  }

  // Handle project images: delete existing, re-insert
  const projectImages = formData.get('project_images') as string
  await supabase.from('project_images').delete().eq('project_id', id)

  if (projectImages) {
    const imageUrls = projectImages.split(',').filter(Boolean)
    if (imageUrls.length > 0) {
      const imageRows = imageUrls.map((url, index) => ({
        project_id: id,
        image_url: url.trim(),
        display_order: index,
      }))
      await supabase.from('project_images').insert(imageRows)
    }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    console.error('Error deleting project:', error.message)
    return { error: 'Failed to delete project.' }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}

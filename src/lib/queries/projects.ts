import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectImage } from '@/lib/types/database'

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error.message)
    return []
  }

  return data ?? []
}

export async function getProjectBySlug(
  slug: string
): Promise<(Project & { project_images: ProjectImage[] }) | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project by slug:', error.message)
    return null
  }

  return data
}

import { createClient } from '@/lib/supabase/server'
import type { Experience } from '@/lib/types/database'

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('is_current', { ascending: false })
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching experiences:', error.message)
    return []
  }

  return data ?? []
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching experience by id:', error.message)
    return null
  }

  return data
}

import { createClient } from '@/lib/supabase/server'
import type { Education } from '@/lib/types/database'

export async function getEducation(): Promise<Education[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching education:', error.message)
    return []
  }

  return data ?? []
}

export async function getEducationById(id: string): Promise<Education | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching education by id:', error.message)
    return null
  }

  return data
}

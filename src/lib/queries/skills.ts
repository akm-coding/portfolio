import { createClient } from '@/lib/supabase/server'
import type { Skill } from '@/lib/types/database'

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching skills:', error.message)
    return []
  }

  return data ?? []
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching skill by id:', error.message)
    return null
  }

  return data
}

import { createClient } from '@/lib/supabase/server'
import type { Statistic } from '@/lib/types/database'

export async function getStatistics(): Promise<Statistic[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching statistics:', error.message)
    return []
  }

  return data ?? []
}

export async function getStatisticById(id: string): Promise<Statistic | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching statistic by id:', error.message)
    return null
  }

  return data
}

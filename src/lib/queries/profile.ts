import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types/database'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching profile:', error.message)
    return null
  }

  return data
}

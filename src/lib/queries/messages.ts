import { createClient } from '@/lib/supabase/server'
import type { Message } from '@/lib/types/database'

export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching messages:', error.message)
    return []
  }

  return data ?? []
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  if (error) {
    console.error('Error fetching unread message count:', error.message)
    return 0
  }

  return count ?? 0
}

export async function insertMessage(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('messages').insert({
    name: data.name,
    email: data.email,
    message: data.message,
  })

  if (error) {
    console.error('Error inserting message:', error.message)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }

  return { success: true }
}

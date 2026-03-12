import { createClient } from '@/lib/supabase/server'

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

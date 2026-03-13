'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleMessageRead(id: string, isRead: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('messages')
    .update({ is_read: isRead })
    .eq('id', id)

  if (error) {
    console.error('Error toggling message read status:', error.message)
    return { error: 'Failed to update message.' }
  }

  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) {
    console.error('Error deleting message:', error.message)
    return { error: 'Failed to delete message.' }
  }

  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

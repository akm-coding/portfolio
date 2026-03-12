'use server'

import { insertMessage } from '@/lib/queries/messages'

export async function submitContactForm(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: string } | null> {
  const name = formData.get('name') as string | null
  const email = formData.get('email') as string | null
  const message = formData.get('message') as string | null

  if (!name || !name.trim()) {
    return { error: 'Name is required.' }
  }

  if (!email || !email.trim()) {
    return { error: 'Email is required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { error: 'Please enter a valid email address.' }
  }

  if (!message || !message.trim()) {
    return { error: 'Message is required.' }
  }

  if (message.trim().length < 10) {
    return { error: 'Message must be at least 10 characters.' }
  }

  const result = await insertMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  })

  if (!result.success) {
    return { error: 'Failed to send message. Please try again.' }
  }

  return { success: true }
}

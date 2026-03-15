'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStatistic(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const label = formData.get('label') as string
  const valueStr = formData.get('value') as string
  const suffix = formData.get('suffix') as string
  const icon_name = formData.get('icon_name') as string

  if (!label?.trim()) return { error: 'Label is required.' }

  const value = parseInt(valueStr, 10)
  if (isNaN(value)) return { error: 'Value must be a number.' }

  if (!icon_name?.trim()) return { error: 'Icon name is required.' }

  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from('statistics')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (maxOrderData?.display_order ?? -1) + 1

  const { error } = await supabase.from('statistics').insert({
    label: label.trim(),
    value,
    suffix: suffix?.trim() || null,
    icon_name: icon_name.trim(),
    display_order,
  })

  if (error) {
    console.error('Error creating statistic:', error.message)
    return { error: 'Failed to create statistic.' }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  redirect('/admin/statistics')
}

export async function updateStatistic(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const label = formData.get('label') as string
  const valueStr = formData.get('value') as string
  const suffix = formData.get('suffix') as string
  const icon_name = formData.get('icon_name') as string

  if (!label?.trim()) return { error: 'Label is required.' }

  const value = parseInt(valueStr, 10)
  if (isNaN(value)) return { error: 'Value must be a number.' }

  if (!icon_name?.trim()) return { error: 'Icon name is required.' }

  const { error } = await supabase
    .from('statistics')
    .update({
      label: label.trim(),
      value,
      suffix: suffix?.trim() || null,
      icon_name: icon_name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating statistic:', error.message)
    return { error: 'Failed to update statistic.' }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  redirect('/admin/statistics')
}

export async function deleteStatistic(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('statistics').delete().eq('id', id)

  if (error) {
    console.error('Error deleting statistic:', error.message)
    return { error: 'Failed to delete statistic.' }
  }

  revalidatePath('/admin/statistics')
  revalidatePath('/')
  redirect('/admin/statistics')
}

export async function reorderStatistics(orderedIds: string[]) {
  const supabase = await createClient()

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('statistics')
        .update({ display_order: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )
  )

  revalidatePath('/admin/statistics')
  revalidatePath('/')
}

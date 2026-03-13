'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSkill(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const category = formData.get('category') as string

  if (!name?.trim()) return { error: 'Name is required.' }
  if (!category?.trim()) return { error: 'Category is required.' }

  // Get max display_order for the category
  const { data: maxOrderData } = await supabase
    .from('skills')
    .select('display_order')
    .eq('category', category.trim())
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (maxOrderData?.display_order ?? -1) + 1

  const { error } = await supabase.from('skills').insert({
    name: name.trim(),
    category: category.trim(),
    display_order,
  })

  if (error) {
    console.error('Error creating skill:', error.message)
    return { error: 'Failed to create skill.' }
  }

  revalidatePath('/admin/skills')
  revalidatePath('/')
  redirect('/admin/skills')
}

export async function updateSkill(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const category = formData.get('category') as string

  if (!name?.trim()) return { error: 'Name is required.' }
  if (!category?.trim()) return { error: 'Category is required.' }

  const { error } = await supabase
    .from('skills')
    .update({
      name: name.trim(),
      category: category.trim(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating skill:', error.message)
    return { error: 'Failed to update skill.' }
  }

  revalidatePath('/admin/skills')
  revalidatePath('/')
  redirect('/admin/skills')
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('skills').delete().eq('id', id)

  if (error) {
    console.error('Error deleting skill:', error.message)
    return { error: 'Failed to delete skill.' }
  }

  revalidatePath('/admin/skills')
  revalidatePath('/')
  redirect('/admin/skills')
}

export async function reorderSkill(
  skillId: string,
  direction: 'up' | 'down'
) {
  const supabase = await createClient()

  // Get current skill
  const { data: skill } = await supabase
    .from('skills')
    .select('id, display_order, category')
    .eq('id', skillId)
    .single()

  if (!skill) return { error: 'Skill not found' }

  // Get adjacent skill in same category
  const { data: adjacent } = await supabase
    .from('skills')
    .select('id, display_order')
    .eq('category', skill.category)
    .order('display_order', { ascending: direction === 'up' ? false : true })
    .filter('display_order', direction === 'up' ? 'lt' : 'gt', skill.display_order)
    .limit(1)
    .single()

  if (!adjacent) return { error: 'Cannot move further' }

  // Swap display_order values
  await supabase.from('skills').update({ display_order: adjacent.display_order }).eq('id', skill.id)
  await supabase.from('skills').update({ display_order: skill.display_order }).eq('id', adjacent.id)

  revalidatePath('/admin/skills')
  revalidatePath('/')
}

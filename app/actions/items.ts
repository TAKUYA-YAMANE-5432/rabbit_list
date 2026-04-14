'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { error: string } | { success: true } | null

export async function addItem(
  locationId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get('name') as string)?.trim()
  const purchasedAt = formData.get('purchased_at') as string
  const memo = (formData.get('memo') as string)?.trim() || null

  if (!name) return { error: 'お土産名を入力してください' }
  if (!purchasedAt) return { error: '購入日を入力してください' }

  const supabase = await createClient()
  const { error } = await supabase.from('items').insert({
    location_id: locationId,
    name,
    purchased_at: purchasedAt,
    memo,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/locations/${locationId}`)
  return { success: true }
}

export async function updateItem(
  itemId: string,
  locationId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get('name') as string)?.trim()
  const purchasedAt = formData.get('purchased_at') as string
  const memo = (formData.get('memo') as string)?.trim() || null

  if (!name) return { error: 'お土産名を入力してください' }
  if (!purchasedAt) return { error: '購入日を入力してください' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('items')
    .update({ name, purchased_at: purchasedAt, memo })
    .eq('id', itemId)

  if (error) throw new Error(error.message)

  revalidatePath(`/locations/${locationId}`)
  return { success: true }
}

export async function deleteItem(
  itemId: string,
  locationId: string
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('items').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
  revalidatePath(`/locations/${locationId}`)
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { error: string } | { success: true } | null

export async function addCustomLocation(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: '場所名を入力してください' }

  const prefectureRaw = (formData.get('prefecture') as string)?.trim()
  const prefecture = prefectureRaw || null

  const supabase = await createClient()
  const { error } = await supabase.from('locations').insert({
    name,
    is_custom: true,
    prefecture,
    city: null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/list')
  return { success: true }
}

export async function updateCustomLocation(
  locationId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: '場所名を入力してください' }

  const prefectureRaw = (formData.get('prefecture') as string)?.trim()
  const prefecture = prefectureRaw || null

  const supabase = await createClient()
  const { error } = await supabase
    .from('locations')
    .update({ name, prefecture })
    .eq('id', locationId)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/list')
  revalidatePath(`/locations/${locationId}`)
  return { success: true }
}

export async function deleteCustomLocation(locationId: string): Promise<void> {
  const supabase = await createClient()

  // FK 制約のため items を先に削除
  await supabase.from('items').delete().eq('location_id', locationId)

  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', locationId)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/list')
}

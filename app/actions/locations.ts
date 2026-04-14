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

  const supabase = await createClient()
  const { error } = await supabase.from('locations').insert({
    name,
    is_custom: true,
    prefecture: null,
    city: null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  return { success: true }
}

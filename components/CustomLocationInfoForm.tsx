'use client'

import { useActionState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCustomLocation, deleteCustomLocation } from '@/app/actions/locations'
import { PREFECTURE_NAMES } from '@/lib/prefecture-order'
import type { Location } from '@/types/database'

interface Props {
  location: Location
}

export function CustomLocationInfoForm({ location }: Props) {
  const updateBound = updateCustomLocation.bind(null, location.id)
  const [state, formAction, isPending] = useActionState(updateBound, null)
  const [isDeleting, startDeleteTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (
      !window.confirm(
        `「${location.name}」を削除しますか？\nこの場所に登録されたお土産もすべて削除されます。`
      )
    )
      return

    startDeleteTransition(async () => {
      await deleteCustomLocation(location.id)
      router.push('/')
    })
  }

  return (
    <section className="bg-white rounded-3xl border-2 border-[#FFD6E7] shadow-sm p-5 mb-6">
      <h2 className="text-sm font-bold text-[#8B6B8C] mb-4 flex items-center gap-1">
        🗺️ 場所の情報
      </h2>
      <form action={formAction} className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="loc-name"
            className="block text-sm font-medium text-[#8B6B8C] mb-1"
          >
            場所名 <span className="text-[#FF8FAB]">*</span>
          </label>
          <input
            id="loc-name"
            name="name"
            type="text"
            required
            defaultValue={location.name}
            className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-sm text-[#5C3D5E] bg-[#FDFDF8] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="loc-pref"
            className="block text-sm font-medium text-[#8B6B8C] mb-1"
          >
            紐づける都道府県
          </label>
          <select
            id="loc-pref"
            name="prefecture"
            defaultValue={location.prefecture ?? ''}
            className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-sm text-[#5C3D5E] bg-[#FDFDF8] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
          >
            <option value="">なし</option>
            {PREFECTURE_NAMES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        {state && 'error' in state && (
          <p role="alert" className="text-red-400 text-sm">
            {state.error}
          </p>
        )}
        {state && 'success' in state && (
          <p className="text-[#FF8FAB] text-sm font-medium">✓ 保存しました</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending || isDeleting}
            className="bg-[#FF8FAB] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#E05A7A] disabled:opacity-50 transition-all shadow-sm"
          >
            {isPending ? '保存中...' : '✓ 保存'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            className="ml-auto text-red-400 bg-red-50 hover:bg-red-100 px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50 transition-all"
          >
            {isDeleting ? '削除中...' : '🗑️ この場所を削除'}
          </button>
        </div>
      </form>
    </section>
  )
}

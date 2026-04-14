'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addCustomLocation } from '@/app/actions/locations'

export function AddCustomLocationForm() {
  const [state, formAction, isPending] = useActionState(addCustomLocation, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'success' in state) formRef.current?.reset()
  }, [state])

  return (
    <section className="mt-6 border-t-2 border-[#FFE8F0] pt-5">
      <h2 className="text-sm font-bold text-[#8B6B8C] mb-3 flex items-center gap-1">
        <span>🗺️</span> カスタム場所を追加
      </h2>
      <form ref={formRef} action={formAction} className="flex gap-2">
        <input
          name="name"
          type="text"
          required
          placeholder="例: 富士山、東京ディズニーランド"
          className="flex-1 border-2 border-[#FFD6E7] rounded-full px-4 py-2 text-sm text-[#5C3D5E] placeholder-[#DDB8DD] bg-[#FDFDF8] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FF8FAB] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#E05A7A] disabled:opacity-50 transition-all shadow-sm whitespace-nowrap"
        >
          {isPending ? '追加中...' : '＋ 追加'}
        </button>
      </form>
      {state && 'error' in state && (
        <p role="alert" className="text-red-400 text-sm mt-2">{state.error}</p>
      )}
    </section>
  )
}

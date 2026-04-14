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
    <section className="mt-6 border-t border-gray-200 pt-4">
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        カスタム場所を追加
      </h2>
      <form ref={formRef} action={formAction} className="flex gap-2">
        <input
          name="name"
          type="text"
          required
          placeholder="例: 富士山、東京ディズニーランド"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isPending ? '追加中...' : '追加'}
        </button>
      </form>
      {state && 'error' in state && (
        <p role="alert" className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </section>
  )
}

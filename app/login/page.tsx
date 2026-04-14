'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDFAF4]">
      {/* 背景の装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFD6E7] rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E8D5F5] rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative bg-white border-2 border-[#FFB3CC] rounded-3xl shadow-lg shadow-pink-100 w-full max-w-sm mx-4 p-8">
        {/* ロゴ */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🐰</div>
          <h1 className="text-2xl font-bold text-[#E05A7A]">
            お土産リスト
          </h1>
          <p className="text-sm text-[#C4A5C4] mt-1">
            パスワードを入力してね
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#8B6B8C] mb-1"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="パスワードを入力"
              className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-[#5C3D5E] placeholder-[#DDB8DD] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors bg-[#FDFDF8]"
            />
          </div>

          {state?.error && (
            <div role="alert" className="bg-red-50 border border-red-200 rounded-2xl px-4 py-2">
              <p className="text-red-500 text-sm">{state.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-[#FF8FAB] text-white py-3 rounded-full font-bold text-sm hover:bg-[#E05A7A] disabled:opacity-50 transition-all shadow-md shadow-pink-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {isPending ? '🐾 ログイン中...' : '🐰 ログイン'}
          </button>
        </form>

        {/* 装飾 */}
        <p className="text-center text-[#DDB8DD] text-xs mt-6">
          ✿ たくさんのおみやげ、記録しよう ✿
        </p>
      </div>
    </main>
  )
}

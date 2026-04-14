'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          お土産リスト
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          パスワードを入力してください
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-red-500 text-sm">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </main>
  )
}

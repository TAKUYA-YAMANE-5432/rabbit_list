import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          お土産リスト
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            地図
          </Link>
          <Link
            href="/list"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            一覧
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}

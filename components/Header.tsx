import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export function Header() {
  return (
    <header className="bg-white border-b-2 border-[#FFD6E7] px-4 py-3 shadow-sm shadow-pink-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:animate-bounce">🐰</span>
          <span className="text-lg font-bold text-[#E05A7A]">
            お土産リスト
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="text-sm font-medium text-[#8B6B8C] hover:text-[#E05A7A] hover:bg-[#FDFAF4] px-3 py-1.5 rounded-full transition-all"
          >
            🗾 地図
          </Link>
          <Link
            href="/list"
            className="text-sm font-medium text-[#8B6B8C] hover:text-[#E05A7A] hover:bg-[#FDFAF4] px-3 py-1.5 rounded-full transition-all"
          >
            📋 一覧
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-[#C4A5C4] hover:text-[#E05A7A] hover:bg-[#FDFAF4] px-3 py-1.5 rounded-full transition-all"
            >
              ログアウト
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}

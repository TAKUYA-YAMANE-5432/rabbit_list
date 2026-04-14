'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ItemWithLocation, Location } from '@/types/database'

interface Props {
  items: ItemWithLocation[]
  locations: Location[]
  locationFilter: string
  sortDir: 'asc' | 'desc'
}

export function ListPageClient({ items, locations, locationFilter, sortDir }: Props) {
  const router = useRouter()

  const buildUrl = (newLocation: string, newSort: 'asc' | 'desc') => {
    const params = new URLSearchParams()
    if (newLocation) params.set('location', newLocation)
    if (newSort !== 'asc') params.set('sort', newSort)
    const qs = params.toString()
    return `/list${qs ? '?' + qs : ''}`
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(e.target.value, sortDir))
  }

  const handleSortToggle = () => {
    router.push(buildUrl(locationFilter, sortDir === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
      {/* フィルター・ソートバー */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={locationFilter}
          onChange={handleLocationChange}
          aria-label="場所で絞り込み"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべての場所</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSortToggle}
          aria-label={`場所名${sortDir === 'asc' ? '降順' : '昇順'}に並べ替え`}
          className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          場所名
          <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
        </button>

        <span className="text-sm text-gray-500 ml-auto">
          {items.length} 件
        </span>
      </div>

      {/* 件数 0 */}
      {items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">お土産がまだ登録されていません</p>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            地図から場所を選んで追加する
          </Link>
        </div>
      )}

      {/* PC: テーブル */}
      {items.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">お土産名</th>
                  <th className="pb-2 pr-4 font-medium">場所</th>
                  <th className="pb-2 pr-4 font-medium">購入日</th>
                  <th className="pb-2 font-medium">メモ</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {item.locations.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                      {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="py-3 text-gray-500 max-w-xs truncate">
                      {item.memo ?? '—'}
                    </td>
                    <td className="py-3 pl-4">
                      <Link
                        href={`/locations/${item.locations.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        詳細 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* モバイル: カード */}
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <Link
                    href={`/locations/${item.locations.id}`}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium whitespace-nowrap"
                  >
                    詳細 →
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.locations.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                </p>
                {item.memo && (
                  <p className="text-sm text-gray-500 mt-2 border-t border-gray-100 pt-2">
                    {item.memo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ItemWithLocation, Location } from '@/types/database'
import { AddCustomLocationForm } from '@/components/AddCustomLocationForm'

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

  // 選択中の場所を特定（編集ボタン用）
  const selectedLocation = locationFilter
    ? locations.find((loc) => loc.name === locationFilter) ?? null
    : null

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
      {/* フィルター・ソートバー */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={locationFilter}
          onChange={handleLocationChange}
          aria-label="場所で絞り込み"
          className="border-2 border-[#FFD6E7] rounded-full px-4 py-2 text-sm text-[#5C3D5E] bg-white focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
        >
          <option value="">🗾 すべての場所</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSortToggle}
          aria-label={`場所名${sortDir === 'asc' ? '降順' : '昇順'}に並べ替え`}
          className="flex items-center gap-1.5 border-2 border-[#FFD6E7] rounded-full px-4 py-2 text-sm text-[#8B6B8C] bg-white hover:border-[#FF8FAB] hover:text-[#E05A7A] transition-all"
        >
          場所名
          <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
        </button>

        {/* 場所選択中：編集ボタン */}
        {selectedLocation && (
          <Link
            href={`/locations/${selectedLocation.id}`}
            className="flex items-center gap-1.5 bg-[#FF8FAB] text-white rounded-full px-4 py-2 text-sm font-bold hover:bg-[#E05A7A] transition-all shadow-sm"
          >
            ✏️ 編集・追加
          </Link>
        )}

        <span className="text-sm text-[#C4A5C4] ml-auto bg-[#FFE8F0] px-3 py-1 rounded-full font-medium">
          🎁 {items.length} 件
        </span>
      </div>

      {/* 件数 0 */}
      {items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🐰</p>
          <p className="text-lg font-bold text-[#C4A5C4] mb-2">
            おみやげがまだ登録されていないよ
          </p>
          <Link
            href="/"
            className="text-sm text-[#E05A7A] hover:underline font-medium"
          >
            地図から場所を選んで追加する →
          </Link>
        </div>
      )}

      {/* PC: テーブル */}
      {items.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-3xl border-2 border-[#FFD6E7] overflow-hidden shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#FDF6EC] text-[#8B6B8C]">
                  <th className="px-5 py-3 text-left font-bold">🎁 お土産名</th>
                  <th className="px-5 py-3 text-left font-bold">📍 場所</th>
                  <th className="px-5 py-3 text-left font-bold">📅 購入日</th>
                  <th className="px-5 py-3 text-left font-bold">📝 メモ</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-t border-[#FFE8F0] hover:bg-[#FDFDF8] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFDF8]'}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-[#5C3D5E]">
                      {item.name}
                    </td>
                    <td className="px-5 py-3.5 text-[#8B6B8C]">
                      {item.locations.name}
                    </td>
                    <td className="px-5 py-3.5 text-[#8B6B8C] whitespace-nowrap">
                      {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-5 py-3.5 text-[#C4A5C4] max-w-xs truncate">
                      {item.memo ?? '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/locations/${item.locations.id}`}
                        className="text-[#E05A7A] hover:text-white hover:bg-[#FF8FAB] text-xs font-bold px-3 py-1 rounded-full border border-[#FFB3CC] hover:border-[#FF8FAB] transition-all whitespace-nowrap"
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
                className="bg-white border-2 border-[#FFD6E7] rounded-3xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[#5C3D5E]">{item.name}</p>
                  <Link
                    href={`/locations/${item.locations.id}`}
                    className="text-[#E05A7A] text-xs font-bold whitespace-nowrap bg-[#FFE8F0] px-2.5 py-1 rounded-full hover:bg-[#FF8FAB] hover:text-white transition-all"
                  >
                    詳細 →
                  </Link>
                </div>
                <p className="text-sm text-[#8B6B8C] mt-1.5 flex items-center gap-1">
                  <span>📍</span> {item.locations.name}
                </p>
                <p className="text-xs text-[#C4A5C4] mt-1">
                  📅 {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                </p>
                {item.memo && (
                  <p className="text-sm text-[#8B6B8C] mt-2 border-t border-[#FFE8F0] pt-2">
                    {item.memo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* カスタム場所追加フォーム */}
      <AddCustomLocationForm />
    </main>
  )
}

'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import type { Item, Location } from '@/types/database'
import { AddCustomLocationForm } from '@/components/AddCustomLocationForm'

const JapanMap = dynamic(
  () => import('@/components/JapanMap').then((m) => m.JapanMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-[#FFE8F0] animate-pulse rounded-3xl flex items-center justify-center">
        <span className="text-4xl">🐰</span>
      </div>
    ),
  }
)

export type LocationWithItems = Location & { items: Item[] }

interface Props {
  prefectureLocations: LocationWithItems[]
  customLocations: LocationWithItems[]
}

export function MapPageClient({ prefectureLocations, customLocations }: Props) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)

  const activePrefectures = new Set([
    ...prefectureLocations
      .filter((l) => l.items.length > 0)
      .map((l) => l.prefecture!),
    ...customLocations
      .filter((l) => l.items.length > 0 && l.prefecture)
      .map((l) => l.prefecture!),
  ])

  // 選択された県に属する都道府県ロケーション
  const selectedLocation = selectedPrefecture
    ? prefectureLocations.find((l) => l.prefecture === selectedPrefecture) ?? null
    : null

  // 選択された県に紐づいているカスタム場所
  const linkedCustomLocations = selectedPrefecture
    ? customLocations.filter((l) => l.prefecture === selectedPrefecture)
    : []

  // パネルに表示するコンテンツがあるか（空の県でもパネルは開く）
  const isPanelOpen = selectedPrefecture !== null

  const handlePrefectureClick = (prefecture: string) => {
    setSelectedPrefecture((prev) => (prev === prefecture ? null : prefecture))
  }

  return (
    <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-4">
      {/* 地図 + パネル */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 地図 */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl border-2 border-[#FFD6E7] shadow-sm overflow-hidden p-2">
          <JapanMap
            activePrefectures={activePrefectures}
            onPrefectureClick={handlePrefectureClick}
            selectedPrefecture={selectedPrefecture}
          />
          {/* 凡例 */}
          <div className="flex items-center gap-4 px-2 pb-1 justify-end">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF8FAB]" />
              <span className="text-xs text-[#8B6B8C]">おみやげあり</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#F5E6F0]" />
              <span className="text-xs text-[#C4A5C4]">まだなし</span>
            </div>
          </div>
        </div>

        {/* 都道府県パネル */}
        {isPanelOpen && (
          <aside className="md:w-72 bg-white border-2 border-[#FFD6E7] rounded-3xl p-4 flex flex-col gap-3 shadow-md shadow-pink-50 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-white pt-0.5 pb-2 border-b border-[#FFE8F0]">
              <h2 className="text-lg font-bold text-[#E05A7A] flex items-center gap-1">
                📍 {selectedPrefecture}
              </h2>
              <button
                onClick={() => setSelectedPrefecture(null)}
                aria-label="パネルを閉じる"
                className="w-7 h-7 flex items-center justify-center text-[#C4A5C4] hover:text-[#E05A7A] hover:bg-[#FFF0F5] rounded-full transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* 都道府県ロケーションのお土産 */}
            {selectedLocation && (
              <div>
                {selectedLocation.items.length === 0 && linkedCustomLocations.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-2xl mb-1">🐰</p>
                    <p className="text-sm text-[#C4A5C4]">まだおみやげがないよ</p>
                  </div>
                ) : selectedLocation.items.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedLocation.items.map((item) => (
                      <li
                        key={item.id}
                        className="bg-[#FEF6EC] rounded-2xl px-3 py-2 text-sm"
                      >
                        <p className="font-medium text-[#5C3D5E]">{item.name}</p>
                        <p className="text-[#C4A5C4] text-xs mt-0.5">
                          {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Link
                  href={`/locations/${selectedLocation.id}`}
                  className="mt-3 flex text-center justify-center text-sm bg-[#FFE8F0] text-[#E05A7A] font-bold py-2 rounded-full hover:bg-[#FF8FAB] hover:text-white transition-all"
                >
                  詳細・編集 →
                </Link>
              </div>
            )}

            {/* 紐づいているカスタム場所 */}
            {linkedCustomLocations.map((loc) => (
              <div key={loc.id} className="border-t border-[#FFE8F0] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-[#8B6B8C] flex items-center gap-1">
                    ✨ {loc.name}
                  </p>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="text-xs text-[#E05A7A] bg-[#FFE8F0] hover:bg-[#FF8FAB] hover:text-white px-2.5 py-1 rounded-full font-bold transition-all"
                  >
                    編集 →
                  </Link>
                </div>
                {loc.items.length === 0 ? (
                  <p className="text-xs text-[#DDB8DD] px-1">おみやげなし</p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {loc.items.map((item) => (
                      <li
                        key={item.id}
                        className="bg-[#F5EEFF] rounded-xl px-3 py-1.5 text-sm"
                      >
                        <p className="font-medium text-[#5C3D5E]">{item.name}</p>
                        <p className="text-[#C4A5C4] text-xs mt-0.5">
                          {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* カスタム場所カードリスト */}
      {customLocations.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold text-[#8B6B8C] mb-3 flex items-center gap-1">
            <span>✨</span> カスタム場所
          </h2>
          <div className="flex flex-wrap gap-2">
            {customLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="px-4 py-2 bg-white border-2 border-[#FFD6E7] rounded-full text-sm font-medium text-[#8B6B8C] hover:border-[#FF8FAB] hover:text-[#E05A7A] hover:shadow-md transition-all"
              >
                {loc.name}
                {loc.prefecture && (
                  <span className="ml-1.5 text-xs text-[#C4A5C4]">
                    ({loc.prefecture})
                  </span>
                )}
                {loc.items.length > 0 && (
                  <span className="ml-2 bg-[#FFD6E7] text-[#E05A7A] text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {loc.items.length}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <AddCustomLocationForm />
    </main>
  )
}

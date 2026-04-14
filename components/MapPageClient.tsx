'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import type { Item, Location } from '@/types/database'
import { AddCustomLocationForm } from '@/components/AddCustomLocationForm'

const JapanMap = dynamic(
  () => import('@/components/JapanMap').then((m) => m.JapanMap),
  { ssr: false, loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded" /> }
)

export type LocationWithItems = Location & { items: Item[] }

interface Props {
  prefectureLocations: LocationWithItems[]
  customLocations: LocationWithItems[]
}

export function MapPageClient({ prefectureLocations, customLocations }: Props) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)

  const activePrefectures = new Set(
    prefectureLocations
      .filter((l) => l.items.length > 0)
      .map((l) => l.prefecture!)
  )

  const selectedLocation = selectedPrefecture
    ? prefectureLocations.find((l) => l.prefecture === selectedPrefecture) ?? null
    : null

  const handlePrefectureClick = (prefecture: string) => {
    setSelectedPrefecture((prev) => (prev === prefecture ? null : prefecture))
  }

  return (
    <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-4">
      {/* 地図 + パネル */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 地図 */}
        <div className="flex-1 min-w-0">
          <JapanMap
            activePrefectures={activePrefectures}
            onPrefectureClick={handlePrefectureClick}
            selectedPrefecture={selectedPrefecture}
          />
        </div>

        {/* 都道府県パネル */}
        {selectedLocation && (
          <aside className="md:w-72 bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedLocation.name}
              </h2>
              <button
                onClick={() => setSelectedPrefecture(null)}
                aria-label="パネルを閉じる"
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {selectedLocation.items.length === 0 ? (
              <p className="text-sm text-gray-500">まだお土産がありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedLocation.items.map((item) => (
                  <li key={item.id} className="text-sm">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-500">
                      {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/locations/${selectedLocation.id}`}
              className="mt-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              詳細・編集 →
            </Link>
          </aside>
        )}
      </div>

      {/* カスタム場所カードリスト */}
      {customLocations.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            カスタム場所
          </h2>
          <div className="flex flex-wrap gap-3">
            {customLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                {loc.name}
                {loc.items.length > 0 && (
                  <span className="ml-2 text-xs text-blue-600">
                    {loc.items.length}件
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

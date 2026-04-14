import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { ListPageClient } from '@/components/ListPageClient'
import { sortLocationsByPrefectureOrder, compareByPrefectureOrder } from '@/lib/prefecture-order'
import type { ItemWithLocation } from '@/types/database'

interface PageProps {
  searchParams: Promise<{ location?: string; sort?: string }>
}

export default async function ListPage({ searchParams }: PageProps) {
  const { location: locationFilter = '', sort = 'asc' } = await searchParams
  const sortDir = sort === 'desc' ? 'desc' : 'asc'

  const supabase = await createClient()

  const [itemsResult, locationsResult] = await Promise.all([
    supabase
      .from('items')
      .select('id, name, purchased_at, memo, location_id, created_at, locations(id, name, prefecture, city, is_custom, created_at)'),
    supabase
      .from('locations')
      .select('id, name, prefecture, city, is_custom, created_at'),
  ])

  if (itemsResult.error || locationsResult.error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">データの取得に失敗しました</p>
      </div>
    )
  }

  // locations は Supabase が配列で返す場合があるため単一オブジェクトに正規化
  let items = (itemsResult.data ?? []).map((item) => ({
    ...item,
    locations: Array.isArray(item.locations) ? item.locations[0] : item.locations,
  })) as ItemWithLocation[]

  // 絞り込み（場所名）
  if (locationFilter) {
    items = items.filter((item) => item.locations?.name === locationFilter)
  }

  // ソート（都道府県順：北海道→沖縄、カスタム場所は末尾）
  items = items.sort((a, b) =>
    compareByPrefectureOrder(
      a.locations?.name ?? '',
      b.locations?.name ?? '',
      sortDir
    )
  )

  // ドロップダウン用：都道府県順に並べ替え
  const sortedLocations = sortLocationsByPrefectureOrder(locationsResult.data ?? [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ListPageClient
        items={items}
        locations={sortedLocations}
        locationFilter={locationFilter}
        sortDir={sortDir}
      />
    </div>
  )
}

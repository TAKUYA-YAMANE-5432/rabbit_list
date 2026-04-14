import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { MapPageClient } from '@/components/MapPageClient'
import { sortLocationsByPrefectureOrder } from '@/lib/prefecture-order'

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, prefecture, city, is_custom, created_at, items(id, name, purchased_at, memo, location_id, created_at)')


  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">データの取得に失敗しました</p>
      </div>
    )
  }

  const prefectureLocations = sortLocationsByPrefectureOrder(
    data.filter((l) => !l.is_custom)
  )
  const customLocations = data
    .filter((l) => l.is_custom)
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <MapPageClient
        prefectureLocations={prefectureLocations}
        customLocations={customLocations}
      />
    </div>
  )
}

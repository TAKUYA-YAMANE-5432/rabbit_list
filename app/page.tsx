import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { MapPageClient } from '@/components/MapPageClient'

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, prefecture, city, is_custom, created_at, items(id, name, purchased_at, memo, location_id, created_at)')
    .order('name')

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">データの取得に失敗しました</p>
      </div>
    )
  }

  const prefectureLocations = data.filter((l) => !l.is_custom)
  const customLocations = data.filter((l) => l.is_custom)

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

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { ItemList } from '@/components/ItemList'
import { CustomLocationInfoForm } from '@/components/CustomLocationInfoForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [locationResult, itemsResult] = await Promise.all([
    supabase
      .from('locations')
      .select('id, name, prefecture, city, is_custom, created_at')
      .eq('id', id)
      .single(),
    supabase
      .from('items')
      .select('id, name, purchased_at, memo, location_id, created_at')
      .eq('location_id', id)
      .order('purchased_at', { ascending: false }),
  ])

  if (locationResult.error || !locationResult.data) {
    notFound()
  }

  const location = locationResult.data

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF4]">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[#C4A5C4] hover:text-[#E05A7A] transition-colors bg-white border border-[#FFD6E7] px-3 py-1.5 rounded-full"
        >
          ← 地図へ戻る
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-[#E05A7A] flex items-center gap-2">
            <span>📍</span>
            {location.name}
          </h1>
          {location.prefecture && !location.is_custom && (
            <p className="text-sm text-[#C4A5C4] mt-1">{location.prefecture}</p>
          )}
          {location.is_custom && location.prefecture && (
            <p className="text-sm text-[#C4A5C4] mt-1">
              📌 {location.prefecture} に紐づけ中
            </p>
          )}
        </div>

        {/* カスタム場所のみ：場所情報の編集・削除フォーム */}
        {location.is_custom && (
          <CustomLocationInfoForm location={location} />
        )}

        <div className="bg-white rounded-3xl border-2 border-[#FFD6E7] shadow-sm p-6">
          <ItemList
            locationId={id}
            items={itemsResult.data ?? []}
          />
        </div>
      </main>
    </div>
  )
}

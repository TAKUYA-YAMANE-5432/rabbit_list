import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { ItemList } from '@/components/ItemList'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [locationResult, itemsResult] = await Promise.all([
    supabase
      .from('locations')
      .select('id, name, prefecture, city, is_custom')
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 地図へ戻る
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
          {location.name}
        </h1>

        <ItemList
          locationId={id}
          items={itemsResult.data ?? []}
        />
      </main>
    </div>
  )
}

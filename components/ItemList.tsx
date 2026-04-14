'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { addItem, updateItem, deleteItem } from '@/app/actions/items'
import type { Item } from '@/types/database'

// ── 追加フォーム ──────────────────────────────────────────────────────────────
function AddItemForm({ locationId }: { locationId: string }) {
  const addItemBound = addItem.bind(null, locationId)
  const [state, formAction, isPending] = useActionState(addItemBound, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'success' in state) formRef.current?.reset()
  }, [state])

  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        お土産を追加
      </h2>
      <form ref={formRef} action={formAction} className="flex flex-col gap-3">
        <div>
          <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
            お土産名 <span className="text-red-500">*</span>
          </label>
          <input
            id="add-name"
            name="name"
            type="text"
            required
            placeholder="例: じゃがポックル"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="add-date" className="block text-sm font-medium text-gray-700 mb-1">
            購入日 <span className="text-red-500">*</span>
          </label>
          <input
            id="add-date"
            name="purchased_at"
            type="date"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="add-memo" className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            id="add-memo"
            name="memo"
            rows={2}
            placeholder="任意のメモ"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {state && 'error' in state && (
          <p role="alert" className="text-red-500 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '追加中...' : '追加する'}
        </button>
      </form>
    </section>
  )
}

// ── 編集フォーム ──────────────────────────────────────────────────────────────
function EditItemForm({
  item,
  locationId,
  onCancel,
}: {
  item: Item
  locationId: string
  onCancel: () => void
}) {
  const editItemBound = updateItem.bind(null, item.id, locationId)
  const [state, formAction, isPending] = useActionState(editItemBound, null)

  useEffect(() => {
    if (state && 'success' in state) onCancel()
  }, [state, onCancel])

  return (
    <form action={formAction} className="flex flex-col gap-3 py-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="name"
          type="text"
          required
          defaultValue={item.name}
          placeholder="お土産名"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="purchased_at"
          type="date"
          required
          defaultValue={item.purchased_at}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        name="memo"
        rows={2}
        defaultValue={item.memo ?? ''}
        placeholder="メモ（任意）"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {state && 'error' in state && (
        <p role="alert" className="text-red-500 text-sm">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '保存中...' : '保存'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

// ── メインコンポーネント ────────────────────────────────────────────────────────
interface Props {
  locationId: string
  items: Item[]
}

export function ItemList({ locationId, items }: Props) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  const handleDelete = (item: Item) => {
    if (!window.confirm(`「${item.name}」を削除しますか？`)) return
    setDeletingIds((prev) => new Set(prev).add(item.id))
    startTransition(async () => {
      await deleteItem(item.id, locationId)
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    })
  }

  return (
    <div>
      {/* お土産一覧 */}
      {items.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">まだお土産がありません</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="py-3">
              {editingItemId === item.id ? (
                <EditItemForm
                  item={item}
                  locationId={locationId}
                  onCancel={() => setEditingItemId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                    </p>
                    {item.memo && (
                      <p className="text-sm text-gray-600 mt-1">{item.memo}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingItemId(item.id)}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingIds.has(item.id)}
                      className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                    >
                      {deletingIds.has(item.id) ? '削除中...' : '削除'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <AddItemForm locationId={locationId} />
    </div>
  )
}

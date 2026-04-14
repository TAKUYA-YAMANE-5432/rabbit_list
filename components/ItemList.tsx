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
    <section className="mt-8 border-t-2 border-[#FFE8F0] pt-6">
      <h2 className="text-base font-bold text-[#E05A7A] mb-4 flex items-center gap-1">
        🎁 おみやげを追加
      </h2>
      <form ref={formRef} action={formAction} className="flex flex-col gap-3">
        <div>
          <label htmlFor="add-name" className="block text-sm font-medium text-[#8B6B8C] mb-1">
            おみやげ名 <span className="text-[#FF8FAB]">*</span>
          </label>
          <input
            id="add-name"
            name="name"
            type="text"
            required
            placeholder="例: じゃがポックル"
            className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-sm text-[#5C3D5E] placeholder-[#DDB8DD] bg-[#FDFDF8] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="add-date" className="block text-sm font-medium text-[#8B6B8C] mb-1">
            購入日 <span className="text-[#FF8FAB]">*</span>
          </label>
          <input
            id="add-date"
            name="purchased_at"
            type="date"
            required
            className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-sm text-[#5C3D5E] bg-[#FDFDF8] focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="add-memo" className="block text-sm font-medium text-[#8B6B8C] mb-1">
            メモ
          </label>
          <textarea
            id="add-memo"
            name="memo"
            rows={2}
            placeholder="任意のメモ"
            className="w-full border-2 border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-sm text-[#5C3D5E] placeholder-[#DDB8DD] bg-[#FDFDF8] resize-none focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
          />
        </div>

        {state && 'error' in state && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-2xl px-4 py-2">
            <p className="text-red-400 text-sm">{state.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start bg-[#FF8FAB] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#E05A7A] disabled:opacity-50 transition-all shadow-md shadow-pink-100 hover:-translate-y-0.5"
        >
          {isPending ? '追加中...' : '＋ 追加する'}
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
    <form action={formAction} className="flex flex-col gap-3 py-3 bg-[#FDFDF8] rounded-2xl px-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="name"
          type="text"
          required
          defaultValue={item.name}
          placeholder="おみやげ名"
          className="flex-1 border-2 border-[#FFD6E7] rounded-2xl px-3 py-2 text-sm text-[#5C3D5E] bg-white focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
        />
        <input
          name="purchased_at"
          type="date"
          required
          defaultValue={item.purchased_at}
          className="border-2 border-[#FFD6E7] rounded-2xl px-3 py-2 text-sm text-[#5C3D5E] bg-white focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
        />
      </div>
      <textarea
        name="memo"
        rows={2}
        defaultValue={item.memo ?? ''}
        placeholder="メモ（任意）"
        className="w-full border-2 border-[#FFD6E7] rounded-2xl px-3 py-2 text-sm text-[#5C3D5E] bg-white resize-none focus:outline-none focus:border-[#FF8FAB] focus:ring-2 focus:ring-[#FFD6E7] transition-colors"
      />

      {state && 'error' in state && (
        <p role="alert" className="text-red-400 text-sm">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FF8FAB] text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#E05A7A] disabled:opacity-50 transition-all"
        >
          {isPending ? '保存中...' : '✓ 保存'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#C4A5C4] px-4 py-1.5 rounded-full text-sm hover:bg-[#FFE8F0] hover:text-[#8B6B8C] transition-all"
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
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🐰</p>
          <p className="text-[#C4A5C4] font-medium">まだおみやげがないよ</p>
          <p className="text-sm text-[#DDB8DD] mt-1">下のフォームから追加してね ↓</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white border-2 border-[#FFE8F0] rounded-2xl overflow-hidden"
            >
              {editingItemId === item.id ? (
                <EditItemForm
                  item={item}
                  locationId={locationId}
                  onCancel={() => setEditingItemId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#5C3D5E]">{item.name}</p>
                    <p className="text-sm text-[#C4A5C4] mt-0.5">
                      📅 {new Date(item.purchased_at).toLocaleDateString('ja-JP')}
                    </p>
                    {item.memo && (
                      <p className="text-sm text-[#8B6B8C] mt-1.5 bg-[#FEF6EC] rounded-xl px-3 py-1.5">
                        {item.memo}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingItemId(item.id)}
                      className="text-xs text-[#8B6B8C] font-medium bg-[#FEF6EC] hover:bg-[#FFD6E7] px-3 py-1.5 rounded-full transition-all"
                    >
                      ✏️ 編集
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingIds.has(item.id)}
                      className="text-xs text-[#C4A5C4] font-medium bg-[#FEF6EC] hover:bg-red-100 hover:text-red-400 px-3 py-1.5 rounded-full disabled:opacity-50 transition-all"
                    >
                      {deletingIds.has(item.id) ? '削除中...' : '🗑️ 削除'}
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

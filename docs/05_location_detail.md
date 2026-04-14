# 05 場所詳細画面（`/locations/[id]`）

## 概要

特定の場所に紐づくお土産の一覧表示と CRUD（追加・編集・削除）を実装する。

## タスク

### ページ作成

- [x] `app/locations/[id]/page.tsx` を作成する（Server Component）
- [x] URL パラメータ `id` から location を取得して場所名をヘッダーに表示する
- [x] 存在しない `id` の場合は `notFound()` を返す

### お土産一覧表示

- [x] 該当 location に紐づく items を一覧表示する（購入日降順）
- [x] お土産名・購入日・メモを表示する
- [x] items が 0 件の場合は「まだお土産がありません」を表示する

### お土産追加

- [x] 追加フォームを実装する（ページ下部に常時表示）
- [x] 入力項目: お土産名（必須）・購入日（必須）・メモ（任意）
- [x] Server Action（`addItem`）で Supabase に INSERT する
- [x] 追加後にリストを再取得して表示を更新する（`revalidatePath`）
- [x] バリデーション: お土産名・購入日が空の場合はエラー表示する（HTML5 + Server Action 両方）

### お土産編集

- [x] 各お土産に「編集」ボタンを設置する
- [x] インライン編集フォームを実装する（`EditItemForm` コンポーネント）
- [x] Server Action（`updateItem`）で Supabase を UPDATE する
- [x] 保存後に編集モードを閉じてリストを更新する（`revalidatePath` + `{ success: true }` 検知）

### お土産削除

- [x] 各お土産に「削除」ボタンを設置する
- [x] 削除前に `window.confirm` で確認ダイアログを表示する
- [x] Server Action（`deleteItem`）で Supabase から DELETE する
- [x] 削除後にリストを再取得して表示を更新する（`revalidatePath`）

### カスタム場所の追加

- [x] 地図トップページ下部にカスタム場所追加フォームを実装する（`AddCustomLocationForm`）
- [x] `is_custom = true` で locations に INSERT する（Server Action: `addCustomLocation`）
- [x] 場所名（必須）のみ入力できればよい

### レスポンシブ対応

- [x] スマートフォンでも追加・編集・削除が操作しやすいレイアウトにする（`flex-col sm:flex-row`）

## 完了条件

- [x] 場所に紐づくお土産が一覧表示される
- [x] お土産の追加・編集・削除が正常に動作する
- [x] バリデーションエラーが適切に表示される

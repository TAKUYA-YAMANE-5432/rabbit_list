# 06 Vercel デプロイ

## 概要

アプリケーションを Vercel へデプロイし、本番環境で動作確認する。

## タスク

### 事前準備

- [x] `npm run build` がローカルでエラーなく通ることを確認する
- [x] `npm run lint` がエラーなく通ることを確認する（警告 0 件）
- [x] `.env.local` が `.gitignore` に含まれていることを確認する（`.env*` でカバー済み）
- [x] 全実装ファイルをコミット済み

### GitHub リポジトリ

- [ ] GitHub にリポジトリを作成する
- [ ] コードを push する

### Vercel プロジェクト作成

- [ ] Vercel と GitHub リポジトリを連携する
- [ ] Framework Preset を `Next.js` に設定する

### 環境変数設定（Vercel）

- [ ] `AUTH_PASSWORD` を設定する
- [ ] `NEXT_PUBLIC_SUPABASE_URL` を設定する
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する

### デプロイ確認

- [ ] Vercel の本番 URL でアプリが正常に表示される
- [ ] ログイン → 地図画面 → 一覧画面 → 場所詳細画面の動線が通ることを確認する
- [ ] お土産の追加・編集・削除が本番環境で動作することを確認する

## 完了条件

- 本番 URL でアプリが正常に動作する
- Supabase との接続が本番環境で確立されている

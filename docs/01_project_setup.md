# 01 プロジェクト基盤セットアップ

## 概要

Supabase クライアント・TypeScript 型定義など、全画面で共通利用する基盤を整備する。

## タスク

### 依存パッケージ導入

- [x] `@supabase/supabase-js` / `@supabase/ssr` をインストールする

### Supabase クライアント

- [x] `lib/supabase/server.ts` を作成し、Server Component / Middleware 用クライアントを export する
- [x] `lib/supabase/client.ts` を作成し、Client Component 用クライアントを export する
- [x] 環境変数 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を参照する

### TypeScript 型定義

- [x] Supabase MCP で TypeScript 型を生成する
- [x] `types/database.ts` に生成した型を配置する
- [x] `Location` / `LocationInsert` / `LocationUpdate` / `Item` / `ItemInsert` / `ItemUpdate` / `ItemWithLocation` の便利型エイリアスを定義する

### 環境変数確認

- [x] `.env.local` に `AUTH_PASSWORD` / `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` が揃っていることを確認する
- [x] `.env.local` が `.gitignore` に含まれていることを確認する（`.env*` でカバー済み）

## 完了条件

- [x] `npm run build` がエラーなく通る
- Supabase クライアントから `locations` テーブルを SELECT できる（02 認証実装後に動作確認）

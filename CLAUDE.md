# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

日本各地で購入したお土産を管理する個人運営向け Web アプリケーション。
詳細な要件は [`docs/requirements.md`](docs/requirements.md) を参照。

## 技術スタック

| 区分 | 採用技術 |
|------|----------|
| フレームワーク | Next.js 16.2.3 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データベース | Supabase (PostgreSQL) |
| 認証 | Next.js Middleware + Cookie（固定パスワード） |
| 地図 | 日本地図 SVG（都道府県単位でパス分割） |
| デプロイ | Vercel |

## コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint 実行
```

## アーキテクチャ

### 画面構成

| パス | 役割 |
|------|------|
| `/login` | 固定パスワード認証・Cookie 発行 |
| `/` | 日本地図（SVG）トップ。都道府県クリックでお土産パネル表示 |
| `/list` | 全お土産一覧。場所絞り込み・場所順ソート |
| `/locations/[id]` | 特定場所のお土産 CRUD |

### 認証フロー

- 環境変数 `AUTH_PASSWORD` に固定パスワードを設定する
- Next.js Middleware が全ルートで Cookie を検証し、未認証は `/login` へリダイレクト
- `/login` のみ Middleware の検証対象外とする

### データモデル（Supabase）

```
locations
  id           uuid PK
  prefecture   text | null   -- 都道府県名。カスタム場所は null
  city         text | null   -- 市区町村名（任意）
  name         text          -- 表示名
  is_custom    boolean       -- カスタム場所フラグ
  created_at   timestamptz

items
  id           uuid PK
  location_id  uuid FK → locations.id
  name         text          -- お土産名
  purchased_at date
  memo         text | null
  created_at   timestamptz
```

初期データとして日本 47 都道府県を locations テーブルに seed する。

### 地図実装方針

- 都道府県ごとにパス分割された日本地図 SVG を使用する
- お土産が 1 件以上ある都道府県は色を変えて視覚的に区別する
- カスタム場所（都道府県に属さない場所）は地図下にカードリストで表示する（MVP ではマップピン省略）

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `AUTH_PASSWORD` | ログインパスワード |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## MCP サーバー

`.mcp.json` に以下が設定済み:

- **supabase** — DB 操作・マイグレーション
- **playwright** — ブラウザ自動操作・UI 確認
- **github** — リポジトリ操作
- **serena** — コード解析・シンボル操作
- **contetxt7** — ライブラリドキュメント取得

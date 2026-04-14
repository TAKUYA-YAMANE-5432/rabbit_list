# 00 コーディングルール・ベストプラクティス

実装全体を通じて遵守するルールを定義する。
各チケット（01〜06）の実装はこのドキュメントを前提とする。

---

## 1. Next.js App Router

### Server Components / Client Components の使い分け

- [ ] コンポーネントはデフォルトで **Server Component** として実装する
- [ ] `useState` / `useEffect` / イベントハンドラが必要な場合のみ `'use client'` を付与する
- [ ] `'use client'` の境界はできる限りツリーの末端（葉）に置く
- [ ] Server Component から Client Component へはシリアライズ可能な props のみ渡す

### データ取得

- [ ] データ取得は Server Component 内で `async/await` を使って行う
- [ ] 毎リクエストで最新データが必要な場合は `cache: 'no-store'` を指定する
- [ ] 静的データ（変化しないマスタ等）は `cache: 'force-cache'`（デフォルト）を使う
- [ ] `useEffect` 内でのデータ取得は行わない

```tsx
// Good: Server Component でのデータ取得
export default async function Page() {
  const data = await fetchData() // cache: 'no-store' or supabase query
  return <ClientComponent data={data} />
}
```

### Server Actions（データ変更）

- [ ] INSERT / UPDATE / DELETE は Server Action（`'use server'`）で実装する
- [ ] Server Action ファイルは `src/app/actions/` 以下に配置する
- [ ] 変更後は `revalidatePath()` を呼び出してキャッシュを無効化する
- [ ] フォームの `action` 属性に Server Action を渡す実装を基本とする

```ts
// Good: Server Action
'use server'
import { revalidatePath } from 'next/cache'

export async function createItem(formData: FormData) {
  // DB 操作
  revalidatePath('/locations/[id]', 'page')
}
```

### ファイル・ディレクトリ構成

- [ ] ページは `src/app/` 配下に App Router の規約に従って配置する
- [ ] 共通コンポーネントは `src/components/` に配置する
- [ ] ライブラリ／ユーティリティは `src/lib/` に配置する
- [ ] 型定義は `src/types/` に配置する

---

## 2. Supabase（`@supabase/ssr`）

### クライアントの使い分け

- [ ] **Server Component / Route Handler / Middleware** では `createServerClient` を使う
- [ ] **Client Component**（`'use client'`）では `createBrowserClient` を使う
- [ ] `@supabase/supabase-js` の `createClient` は直接使わない

```ts
// src/lib/supabase/server.ts — Server 用
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

```ts
// src/lib/supabase/client.ts — Browser 用
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### クエリ

- [ ] クエリ結果の `error` は必ず確認し、エラー時は早期 return またはエラーを throw する
- [ ] `select()` では必要なカラムのみを指定する（`select('*')` は避ける）
- [ ] N+1 クエリを避け、JOIN（`.select('*, locations(*)')`）で一括取得する

---

## 3. TypeScript

- [ ] `tsconfig.json` の `strict: true` を維持する
- [ ] `any` 型は使用しない。型が不明な場合は `unknown` を使い、型ガードで絞り込む
- [ ] Supabase から生成した型（`Database` 型）を使い、手書きの DB 型は作らない
- [ ] 関数の引数・戻り値には型を明示する（型推論が自明な場合を除く）
- [ ] `as` によるキャストは最小限にとどめる

---

## 4. Tailwind CSS

### 基本方針

- [ ] スタイルは Tailwind のユーティリティクラスのみで記述する
- [ ] カスタム CSS（`globals.css` への追記等）は原則禁止とする
- [ ] 同じクラスの組み合わせが 3 箇所以上現れる場合はコンポーネントに切り出す

### レスポンシブ

- [ ] モバイルファーストで実装する（基底スタイルがスマートフォン向け）
- [ ] PC 向けの差分は `md:` / `lg:` プレフィックスで上書きする

```tsx
// Good: モバイルファースト
<div className="flex flex-col gap-2 md:flex-row md:gap-4">
```

### クラスの記述順

- [ ] レイアウト → サイズ → スペーシング → 色 → タイポグラフィ → その他 の順を維持する

---

## 5. 認証・セキュリティ

- [ ] パスワードや API キーはコードにハードコードせず、環境変数から読み込む
- [ ] Cookie は `httpOnly: true` / `sameSite: 'lax'` / `secure: true`（本番）で発行する
- [ ] Server Action の入力値は必ずサーバー側でバリデーションする
- [ ] Supabase へのクエリは必ず認証済みリクエストからのみ実行されるよう Middleware で保護する

---

## 6. 全般

- [ ] `console.log` はデバッグ目的でのみ使用し、コミット前に必ず削除する
- [ ] エラーハンドリングはユーザーに見えるシステム境界（UI）でのみ行い、内部では `throw` で伝播させる
- [ ] コンポーネントファイルは 1 ファイル = 1 コンポーネントを基本とする
- [ ] セマンティック HTML を使用する（`div` の乱用を避け `section` / `nav` / `button` 等を使う）
- [ ] インタラクティブ要素には `aria-label` 等のアクセシビリティ属性を付与する

# 02 認証

## 概要

固定パスワードによる認証を実装する。
Next.js Proxy（旧 Middleware）で全ルートを保護し、未認証時は `/login` へリダイレクトする。

## タスク

### ログインページ (`/login`)

- [x] `app/login/page.tsx` を作成する
- [x] パスワード入力フォームを実装する
- [x] フォーム送信時に Server Action（`app/actions/auth.ts`）でパスワードを検証する
- [x] 認証成功時に `auth_token` Cookie を発行してトップ (`/`) へリダイレクトする
- [x] 認証失敗時にエラーメッセージを表示する

### Proxy（旧 Middleware）

- [x] `proxy.ts` を作成する（Next.js 16 で middleware → proxy に改名）
- [x] 全ルートで `auth_token` Cookie を検証する
- [x] 未認証の場合は `/login` へリダイレクトする
- [x] `/login` は検証対象外にする（無限リダイレクト防止）

### ログアウト

- [x] ログアウト処理（`logout` Server Action: Cookie 削除 → `/login` リダイレクト）を実装する

## 完了条件

- [x] 未認証状態でトップにアクセスすると `/login` へリダイレクトされる
- [x] 正しいパスワードでログインするとトップへ遷移する
- [x] 誤ったパスワードではエラーが表示され遷移しない

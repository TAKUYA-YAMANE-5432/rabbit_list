'use server'

import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function generateToken(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get('password')

  if (typeof password !== 'string' || password.trim() === '') {
    return { error: 'パスワードを入力してください' }
  }

  const expected = process.env.AUTH_PASSWORD
  if (!expected || password !== expected) {
    return { error: 'パスワードが正しくありません' }
  }

  const token = generateToken(password)
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30日
  })

  redirect('/')
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}

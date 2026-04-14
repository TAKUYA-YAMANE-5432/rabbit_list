import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function generateToken(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /login は認証不要
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const expected = process.env.AUTH_PASSWORD
    ? generateToken(process.env.AUTH_PASSWORD)
    : null

  if (!token || !expected || token !== expected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

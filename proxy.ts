import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const refreshToken = request.cookies.get('refresh_token')?.value

  const authRoutes = [
    '/login',
    '/signup',
    '/recover-password',
    '/reset-password',
  ]

  const protectedRoutes = [
    '/',
    '/admin',
    '/agents',
    '/inbox',
    '/referrals',
    '/settings',
    '/dashboard',
    '/connection',
  ]

  // Redirect logged in users away from auth pages
  if (refreshToken && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (
    !refreshToken &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/recover-password',
    '/reset-password',
    '/settings/:path*',
  ],
}

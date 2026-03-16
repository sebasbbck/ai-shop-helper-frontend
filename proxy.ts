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
  const isAdminRoute = pathname.startsWith('/admin')
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname === '/' ||
    isAdminRoute

  // Redirect logged in users away from auth pages
  if (refreshToken && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!refreshToken && isProtectedRoute) {
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

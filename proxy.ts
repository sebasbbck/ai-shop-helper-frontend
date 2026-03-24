import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

const publicRoutes = ['/login', '/signup', '/recover-password', '/unauthorized', '/404', '/connection/failure']
const authRoutes = ['/login', '/signup', '/recover-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  let isAuthenticated = false
  let isAdmin = false

  if (token) {
    try {
      const decoded = decodeJwt(token)
      const now = Math.floor(Date.now() / 1000)
      isAuthenticated = decoded.exp ? decoded.exp > now : false
      isAdmin = (decoded as any).is_superuser || false
    } catch {
      isAuthenticated = false
    }
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

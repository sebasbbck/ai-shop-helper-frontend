import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  console.log('refresh_token found: ' + refreshToken)
  const loginUrl = new URL('/login', request.url)

  if (!refreshToken) {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Specifies which routes this middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*'],
}

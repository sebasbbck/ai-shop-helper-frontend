import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const loginUrl = new URL('/login', request.url)

  if (!token) {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Specifies which routes this middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*'],
}

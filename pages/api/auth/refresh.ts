import type { NextApiRequest, NextApiResponse } from 'next'
import { decodeAccessToken } from '../../../src/lib/auth/jwt'
import { ACCESS_TOKEN_COOKIE } from '../../../src/lib/auth/constants'
import { serializeCookie } from '../../../src/lib/auth/cookie-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' })
  }

  try {
    const cookieHeader = req.headers.cookie || ''

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
        },
      }
    )

    if (!response.ok) {
      const cookie = serializeCookie(ACCESS_TOKEN_COOKIE, '', 0)
      res.setHeader('Set-Cookie', cookie)
      return res.status(401).json({ detail: 'Refresh failed' })
    }

    const data = await response.json()
    const decoded = decodeAccessToken(data.access_token)
    const maxAge = decoded.exp - Math.floor(Date.now() / 1000)

    const cookie = serializeCookie(ACCESS_TOKEN_COOKIE, data.access_token, maxAge)
    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ access_token: data.access_token })
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' })
  }
}

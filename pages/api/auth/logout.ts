import type { NextApiRequest, NextApiResponse } from 'next'
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
    const token = req.cookies[ACCESS_TOKEN_COOKIE]

    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.warn('Backend logout failed:', error)
      }
    }

    const cookie = serializeCookie(ACCESS_TOKEN_COOKIE, '', 0)
    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' })
  }
}

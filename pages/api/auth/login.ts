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
    const { username, password } = req.body

    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json(error)
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

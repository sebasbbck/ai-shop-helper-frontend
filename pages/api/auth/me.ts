import type { NextApiRequest, NextApiResponse } from 'next'
import { ACCESS_TOKEN_COOKIE } from '../../../src/lib/auth/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method not allowed' })
  }

  try {
    const token = req.cookies[ACCESS_TOKEN_COOKIE]

    if (!token) {
      return res.status(401).json({ detail: 'Not authenticated' })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ detail: 'Failed to fetch user' })
    }

    const user = await response.json()
    res.status(200).json({ ...user, access_token: token })
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' })
  }
}

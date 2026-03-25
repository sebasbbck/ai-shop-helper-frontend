import { decodeAccessToken } from './jwt'
import { ACCESS_TOKEN_COOKIE } from './constants'
import type { AccessTokenPayload } from './types'

export function getTokenFromCookies(req: { cookies: Partial<{ [key: string]: string }> }): string | null {
  return req.cookies[ACCESS_TOKEN_COOKIE] || null
}

export function validateToken(token: string): {
  valid: boolean
  decoded?: AccessTokenPayload
  expiresIn?: number
} {
  try {
    const decoded = decodeAccessToken(token)
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = decoded.exp - now

    if (expiresIn <= 0) {
      return { valid: false }
    }

    return { valid: true, decoded, expiresIn }
  } catch (error) {
    return { valid: false }
  }
}

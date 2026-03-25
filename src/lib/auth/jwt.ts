import { decodeJwt } from 'jose'
import type { AccessTokenPayload } from './types'

export function decodeAccessToken(token: string): AccessTokenPayload {
  const decoded = decodeJwt(token)

  return {
    sub: decoded.sub as string,
    exp: decoded.exp as number,
    iat: decoded.iat as number,
    is_superuser: (decoded as any).is_superuser || false,
  }
}

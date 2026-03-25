export interface AccessTokenPayload {
  sub: string
  exp: number
  iat: number
  is_superuser: boolean
}

export interface AuthUser {
  id: string
  email: string
  is_superuser: boolean
}

export interface AuthResult {
  authenticated: boolean
  user?: AuthUser
  error?: string
}

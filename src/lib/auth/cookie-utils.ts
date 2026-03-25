export function serializeCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : ''
  return `${name}=${value}; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

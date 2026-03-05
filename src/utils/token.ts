import Cookies from 'js-cookie'

const TOKEN_COOKIE_NAME = 'token'

export const setToken = (token: string) => {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    // expires in 24 hours
    expires: 1,
    // secure flag - only send over HTTPS in production
    secure: process.env.NODE_ENV === 'production',
    // httpOnly would be ideal but not available in browser
    // sameSite helps with CSRF protection
    sameSite: 'Lax',
  })
}

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_COOKIE_NAME) || null
}

export const clearToken = () => {
  Cookies.remove(TOKEN_COOKIE_NAME)
}

import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getTokenFromCookies, validateToken } from './session-server'
import type { AuthUser } from './types'
import { getStaticTranslations } from '../../../lib/get-static-translations'
import { REFRESH_TOKEN_COOKIE } from './constants'
import { decodeAccessToken } from './jwt'
import { serializeCookie } from './cookie-utils'
import { ACCESS_TOKEN_COOKIE } from './constants'

interface WithAuthOptions {
  requireAdmin?: boolean
}

type AuthHandler = (
  context: GetServerSidePropsContext,
  user: AuthUser
) => ReturnType<GetServerSideProps>

export function withAuth(
  handler?: AuthHandler,
  options: WithAuthOptions = {}
): GetServerSideProps {
  return async (context) => {
    let token = getTokenFromCookies(context.req)
    let validation = token ? validateToken(token) : { valid: false }

    if (!validation.valid) {
      const refreshToken = context.req.cookies[REFRESH_TOKEN_COOKIE]

      if (refreshToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
            {
              method: 'POST',
              headers: {
                Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
              },
            }
          )

          if (response.ok) {
            const data = await response.json()
            token = data.access_token
            validation = validateToken(token)

            if (validation.valid) {
              const decoded = decodeAccessToken(token)
              const maxAge = decoded.exp - Math.floor(Date.now() / 1000)

              const cookies = []
              cookies.push(serializeCookie(ACCESS_TOKEN_COOKIE, token, maxAge))

              const backendCookies = response.headers.get('set-cookie')
              if (backendCookies) {
                cookies.push(backendCookies)
              }

              context.res.setHeader('Set-Cookie', cookies)
            }
          }
        } catch (error) {
          console.error('Server-side refresh failed:', error)
        }
      }

      if (!validation.valid) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        }
      }
    }

    const user: AuthUser = {
      id: validation.decoded.sub,
      email: '',
      is_superuser: validation.decoded.is_superuser,
    }

    if (options.requireAdmin && !user.is_superuser) {
      return {
        redirect: {
          destination: '/?error=unauthorized',
          permanent: false,
        },
      }
    }

    if (handler) {
      return handler(context, user)
    }

    const { locale } = context
    return {
      props: {
        ...(await getStaticTranslations(locale as string)),
        user,
      },
    }
  }
}

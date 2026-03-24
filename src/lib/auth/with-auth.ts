import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getTokenFromCookies, validateToken } from './session-server'
import type { AuthUser } from './types'
import { getStaticTranslations } from '../../../lib/get-static-translations'

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
    const token = getTokenFromCookies(context.req)

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }

    const validation = validateToken(token)

    if (!validation.valid || !validation.decoded) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
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

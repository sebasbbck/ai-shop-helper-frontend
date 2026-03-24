import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getTokenFromCookies, validateToken } from './session-server'
import { getStaticTranslations } from '../../../lib/get-static-translations'

type RedirectHandler = (
  context: GetServerSidePropsContext
) => ReturnType<GetServerSideProps>

export function withAuthRedirect(handler?: RedirectHandler): GetServerSideProps {
  return async (context) => {
    const token = getTokenFromCookies(context.req)

    if (token) {
      const validation = validateToken(token)

      if (validation.valid) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }

    if (handler) {
      return handler(context)
    }

    const { locale } = context
    return {
      props: {
        ...(await getStaticTranslations(locale as string)),
      },
    }
  }
}

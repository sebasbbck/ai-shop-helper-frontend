import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import LoginForm from '../src/features/auth/components/LoginForm'
import { SimpleLayout } from '../src/components/layouts/simple'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}

export default function Login() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <LoginForm />
    </SimpleLayout>
  )
}

import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import LoginForm from '../src/features/auth/components/LoginForm'
import { SimpleLayout } from '../src/components/layouts/simple'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
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

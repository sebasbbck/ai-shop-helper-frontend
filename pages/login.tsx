import { useTranslation } from 'next-i18next'
import LoginForm from '../src/features/auth/components/LoginForm'
import { SimpleLayout } from '../src/components/layouts/simple'
import { withAuthRedirect } from '../src/lib/auth/with-auth-redirect'

export const getServerSideProps = withAuthRedirect()

export default function Login() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <LoginForm />
    </SimpleLayout>
  )
}

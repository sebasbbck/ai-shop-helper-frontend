import { useTranslation } from 'next-i18next'
import { SimpleLayout } from '../src/components/layouts/simple'
import RecoverPasswordForm from '../src/features/auth/components/RecoverPasswordForm'
import { withAuthRedirect } from '../src/lib/auth/with-auth-redirect'

export const getServerSideProps = withAuthRedirect()

export default function RecoverPassword() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <RecoverPasswordForm />
    </SimpleLayout>
  )
}

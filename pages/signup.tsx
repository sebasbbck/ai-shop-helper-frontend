import { useTranslation } from 'next-i18next'
import SignUpForm from '../src/features/auth/components/SignUpForm'
import { SimpleLayout } from '../src/components/layouts/simple'
import { withAuthRedirect } from '../src/lib/auth/with-auth-redirect'

export const getServerSideProps = withAuthRedirect()

export default function Signup() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <SignUpForm />
    </SimpleLayout>
  )
}

import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { SimpleLayout } from '../src/components/layouts/simple'
import RecoverPasswordForm from '../src/features/auth/components/RecoverPasswordForm'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function RecoverPassword() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <RecoverPasswordForm />
    </SimpleLayout>
  )
}

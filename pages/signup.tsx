import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import SignUpForm from '../src/features/auth/components/SignUpForm'
import { SimpleLayout } from '../src/components/layouts/simple'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function Signup() {
  const { t } = useTranslation('translation')

  return (
    <SimpleLayout>
      <SignUpForm />
    </SimpleLayout>
  )
}

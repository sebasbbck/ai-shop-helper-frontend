import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import HomePage from '../src/features/agents/components/HomePage'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function Index() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  )
}

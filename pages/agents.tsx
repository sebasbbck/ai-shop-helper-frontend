import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import AgentsPage from '../src/features/agents/components/AgentsPage'

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
      <AgentsPage />
    </DashboardLayout>
  )
}

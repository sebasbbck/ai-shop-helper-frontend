import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import AgentsPage from '../src/features/agents/components/AgentsPage'
import { CONFIG } from '../src/global-config'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function Index() {
  const { t } = useTranslation('translation')
  const title = t('translation:titles.home', '', { appName: CONFIG.appName })

  // TODO: This route will point to a dashboard in the future.
  return (
    <DashboardLayout>
      <title>{title}</title>
      <AgentsPage />
    </DashboardLayout>
  )
}

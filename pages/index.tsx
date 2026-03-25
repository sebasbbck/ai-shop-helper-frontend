import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import AgentsPage from '../src/features/agents/components/AgentsPage'
import { CONFIG } from '../src/global-config'
import { withAuth } from '../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

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

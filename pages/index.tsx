import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import HomePage from '../src/features/agents/components/HomePage'
import { withAuth } from '../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function Index() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  )
}

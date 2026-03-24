import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import Inbox from '../src/features/notifications/components/Inbox'
import { withAuth } from '../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function InboxPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <Inbox />
    </DashboardLayout>
  )
}

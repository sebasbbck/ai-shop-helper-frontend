import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { navData } from '../../src/components/layouts/nav-config-admin'
import AdminControl from '../../src/features/admin/components/AdminControl'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth(undefined, { requireAdmin: true })

export default function AdminIndex() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout slotProps={{ nav: { data: navData } }}>
      <AdminControl />
    </DashboardLayout>
  )
}

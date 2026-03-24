import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { navData } from '../../src/components/layouts/nav-config-admin'
import AdminUsersPage from '../../src/features/admin/components/AdminUsersPage'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth(undefined, { requireAdmin: true })

export default function AdminUsers() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout slotProps={{ nav: { data: navData } }}>
      <AdminUsersPage />
    </DashboardLayout>
  )
}

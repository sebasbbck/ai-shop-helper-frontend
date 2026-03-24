import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import Referrals from '../src/features/referrals/components/Referrals'
import { withAuth } from '../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function ReferralsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <Referrals />
    </DashboardLayout>
  )
}

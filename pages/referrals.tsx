import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import Referrals from '../src/features/referrals/components/Referrals'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function ReferralsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <Referrals />
    </DashboardLayout>
  )
}

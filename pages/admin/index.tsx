import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { navData } from '../../src/components/layouts/nav-config-admin'
import AdminControl from '../../src/features/admin/components/AdminControl'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function AdminIndex() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout slotProps={{ nav: { data: navData } }}>
      <AdminControl />
    </DashboardLayout>
  )
}

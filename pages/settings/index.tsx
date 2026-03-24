import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsGeneral } from '../../src/features/settings/components/SettingsGeneral'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function GeneralSettingsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsGeneral />
      </SettingsLayout>
    </DashboardLayout>
  )
}

import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsNotifications } from '../../src/features/settings/components/SettingsNotifications'
import { SettingsOrgs } from '../../src/features/settings/components/SettingsOrgs'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function OrgsSettingsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsOrgs />
      </SettingsLayout>
    </DashboardLayout>
  )
}

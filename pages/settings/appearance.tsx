import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsAppearance } from '../../src/features/settings/components/SettingsAppearance'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function AppearanceSettingsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsAppearance />
      </SettingsLayout>
    </DashboardLayout>
  )
}

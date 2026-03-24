import { useTranslation } from 'next-i18next'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsBilling } from '../../src/features/settings/components/SettingsBilling'
import { withAuth } from '../../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function BillingSettingsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsBilling />
      </SettingsLayout>
    </DashboardLayout>
  )
}

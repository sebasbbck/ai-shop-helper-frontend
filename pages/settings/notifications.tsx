import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsNotifications } from '../../src/features/settings/components/SettingsNotifications'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function NotificationsSettingsPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsNotifications />
      </SettingsLayout>
    </DashboardLayout>
  )
}

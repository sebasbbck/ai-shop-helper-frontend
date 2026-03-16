import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsAppearance } from '../../src/features/settings/components/SettingsAppearance'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

export default function InboxPage() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsAppearance />
      </SettingsLayout>
    </DashboardLayout>
  )
}

import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../../lib/get-static-translations'
import { DashboardLayout } from '../../src/components/layouts/dashboard'
import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
import { SettingsGeneral } from '../../src/features/settings/components/SettingsGeneral'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
    },
  }
}

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

import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import Inbox from '../src/features/notifications/components/Inbox'

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
      <Inbox />
    </DashboardLayout>
  )
}

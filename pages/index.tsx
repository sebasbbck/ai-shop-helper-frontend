import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import HomePage from '../src/features/agents/components/HomePage'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}

export default function OldIndex() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  )
}

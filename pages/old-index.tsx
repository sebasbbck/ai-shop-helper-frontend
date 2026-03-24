import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { health } from '../api/default/default'

import { useTranslation } from 'next-i18next'
import { getStaticTranslations } from '../lib/get-static-translations'
import { getMe } from '../api/users/users'
import HomePage from '../src/features/agents/components/HomePage'
import { DashboardLayout } from '../src/components/layouts/dashboard'

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await getStaticTranslations(locale)),
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

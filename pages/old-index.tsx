import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { health } from '../api/default/default'

import { useTranslation } from 'next-i18next'
import { getMe } from '../api/users/users'
import HomePage from '../src/features/agents/components/HomePage'
import { DashboardLayout } from '../src/components/layouts/dashboard'
import { withAuth } from '../src/lib/auth/with-auth'

export const getServerSideProps = withAuth()

export default function OldIndex() {
  const { t } = useTranslation('translation')

  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  )
}

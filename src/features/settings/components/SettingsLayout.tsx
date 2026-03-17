import { Tabs, Tab } from '@mui/material'
import { paths } from '../../../route-helpers/paths'
import NextLink from 'next/link'
import { Iconify } from '../../../components/iconify'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { useTranslation } from 'next-i18next'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

interface SettingsLayoutProps {
  children: ReactNode
  [key: string]: any
}

export const SettingsLayout = ({ children, ...other }: SettingsLayoutProps) => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  const validPaths = [
    paths.settings.root,
    paths.settings.projects,
    paths.settings.billing,
    paths.settings.notifications,
    paths.settings.changePassword,
    paths.settings.appearance,
  ]
  const currentTab = validPaths.includes(pathname) ? pathname : false

  return (
    <DashboardContent {...other}>
      <Tabs value={currentTab} onChange={() => {}} sx={{ mb: 3 }}>
        <Tab
          icon={<Iconify width={24} icon="solar:user-id-bold" />}
          iconPosition="start"
          component={NextLink}
          label={t('translation:layout.general')}
          value={paths.settings.root}
          href={paths.settings.root}
        />
        <Tab
          icon={<Iconify width={24} icon="fluent:briefcase-24-filled" />}
          component={NextLink}
          label={t('translation:layout.projects')}
          value={paths.settings.projects}
          href={paths.settings.projects}
        />
        <Tab
          icon={<Iconify width={24} icon="solar:bill-list-bold" />}
          iconPosition="start"
          component={NextLink}
          label={t('translation:layout.billing')}
          value={paths.settings.billing}
          href={paths.settings.billing}
        />
        <Tab
          icon={<Iconify width={24} icon="solar:notification-unread-bold" />}
          component={NextLink}
          label={t('translation:layout.notifications')}
          value={paths.settings.notifications}
          href={paths.settings.notifications}
        />
        <Tab
          icon={<Iconify width={24} icon="solar:pallete-2-bold" />}
          iconPosition="start"
          component={NextLink}
          label={t('translation:layout.appearance')}
          value={paths.settings.appearance}
          href={paths.settings.appearance}
        />
      </Tabs>

      {/* This will render the current active page */}
      {children}
    </DashboardContent>
  )
}

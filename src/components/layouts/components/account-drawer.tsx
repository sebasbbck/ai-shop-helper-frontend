import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import { useBoolean } from 'minimal-shared/hooks'
import { AnimateBorder } from '../../../components/animate'
import { Iconify } from '../../../components/iconify'
import NextLink from 'next/link'
import { Label } from '../../../components/label'
import { Scrollbar } from '../../../components/scrollbar'
import { paths } from '../../../utils/paths'
import useAuth from '../../../hooks/useAuth'
import { AccountButton } from './account-button'
import { UpgradeBlock } from './nav-upgrade'
import { SignOutButton } from './sign-out-button'
import { useTranslation } from 'next-i18next'
import { SxProps, Theme } from '@mui/material'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

interface AccountDrawerProps {
  data?: {
    label: string | null | undefined
    href: string
    icon: React.ReactNode
    info?: string | number
  }[]
  sx?: SxProps<Theme>
  [key: string]: any
}

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const { pathname } = useRouter()

  const { user } = useAuth()
  const { t } = useTranslation()
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean()

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar
        // src={user?.photoURL}
        alt={user?.name || 'Usuario'}
        sx={{ width: 1, height: 1 }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  )

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {data.map((option) => {
        const rootLabel = pathname.includes('/#') ? 'Home' : 'Dashboard'
        const rootHref = pathname.includes('/') ? '/' : paths.dashboard.root

        return (
          <MenuItem key={option.label}>
            <Link
              component={NextLink}
              href={option.label === 'Home' ? rootHref : option.href}
              color="inherit"
              underline="none"
              onClick={onClose}
              sx={{
                p: 1,
                width: 1,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                color: 'text.secondary',
                '& svg': { width: 24, height: 24 },
                '&:hover': { color: 'text.primary' },
              }}
            >
              {option.icon}

              <Box component="span" sx={{ ml: 2 }}>
                {t(option.label as any) === 'Home'
                  ? rootLabel
                  : t(option.label as any)}
              </Box>

              {option.info && (
                <Label
                  color="error"
                  sx={{ ml: 1 }}
                  endIcon={undefined}
                  startIcon={undefined}
                  className={undefined}
                  disabled={undefined}
                >
                  {option.info}
                </Label>
              )}
            </Link>
          </MenuItem>
        )
      })}
    </MenuList>
  )

  return (
    <>
      <AccountButton
        onClick={onOpen}
        // photoURL={user?.photoURL}
        displayName={user?.name || 'Usuario desconocido'}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar
          sx={undefined}
          ref={undefined}
          className={undefined}
          slotProps={undefined}
        >
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.5, mb: 3 }}
              noWrap
            >
              {user?.email}
            </Typography>
          </Box>

          {renderList()}

          <Box sx={{ px: 2.5, py: 3 }}>
            <UpgradeBlock />
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  )
}

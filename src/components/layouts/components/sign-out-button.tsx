import Button from '@mui/material/Button'
import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import useAuth from '../../../hooks/useAuth'
// import { useRouter } from "@/route-helpers/hooks"
import { SxProps, Theme } from '@mui/material'
import { useRouter } from 'next/router'
// import { signOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

interface SignOutButtonProps {
  onClose: () => void
  sx?: SxProps<Theme>
  [key: string]: any
}

export function SignOutButton({ onClose, sx, ...other }: SignOutButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { logout } = useAuth()

  const handleLogout = useCallback(async () => {
    try {
      await logout()

      onClose?.()
      router.reload()
    } catch (error) {
      console.error(error)
    }
  }, [onClose, router, logout])

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      {t('translation:layout.logout')}
    </Button>
  )
}

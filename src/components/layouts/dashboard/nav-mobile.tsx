import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { mergeClasses } from 'minimal-shared/utils'
import { useEffect } from 'react'
import { NavSectionVertical } from '../../../components/nav-section'
import { Scrollbar } from '../../../components/scrollbar'
// import { usePathname } from "@/route-helpers/hooks"
import { layoutClasses } from '../core'
import { SxProps, Theme } from '@mui/material/styles'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

interface NavMobileProps {
  sx?: SxProps<Theme>
  data: any[]
  open: boolean
  slots?: {
    topArea?: React.ReactNode
    bottomArea?: React.ReactNode
  }
  onClose: () => void
  className?: string
  checkPermissions?: (item: any) => boolean
  [key: string]: any
}

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  className,
  checkPermissions,
  ...other
}: NavMobileProps) {
  const { pathname } = useRouter()

  useEffect(() => {
    if (open) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, onClose])

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: mergeClasses([
            layoutClasses.nav.root,
            layoutClasses.nav.vertical,
            className,
          ]),
          sx: [
            {
              overflow: 'unset',
              bgcolor: 'var(--layout-nav-bg)',
              width: 'var(--layout-nav-mobile-width)',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <img
            src="/assets/images/ai-shop-helper-logo-recortado.png"
            alt="Logo"
            style={{ maxWidth: '40px' }}
          />
        </Box>
      )}

      <Scrollbar
        fillContent
        sx={undefined}
        ref={undefined}
        className={undefined}
        slotProps={undefined}
      >
        <NavSectionVertical
          render={undefined}
          className={undefined}
          slotProps={undefined}
          enabledRootRedirect={undefined}
          cssVars={undefined}
          data={data}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: '1 1 auto' }}
          {...other}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  )
}

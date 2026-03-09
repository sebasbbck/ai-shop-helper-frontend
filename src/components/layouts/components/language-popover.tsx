import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { m } from 'framer-motion'
import { usePopover } from 'minimal-shared/hooks'
import { useCallback } from 'react'
import { transitionTap, varHover, varTap } from '../../../components/animate'
import { CustomPopover } from '../../../components/custom-popover'
import { FlagIcon } from '../../../components/flag-icon'
import { SxProps, Theme } from '@mui/material'
import { useRouter } from 'next/router'

interface LanguagePopoverProps {
  data: {
    value: string
    label: string
    countryCode: string
  }[]
  sx?: SxProps<Theme>
  [key: string]: any
}

export function LanguagePopover({
  data = [],
  sx,
  ...other
}: LanguagePopoverProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover()

  const router = useRouter()
  const lang = router.locale
  const currentLang = data.find((option) => option.value === lang) || data[0]

  const handleChangeLang = useCallback(
    (newLang: string) => {
      // 3. Navigate to the same page ('.') but swap the 'lang' parameter
      router.push(
        { pathname: router.pathname, query: router.query },
        { pathname: router.pathname, query: router.query },
        { locale: newLang },
      )
      onClose()
    },
    [router, onClose],
  )

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={undefined}
    >
      <MenuList sx={{ width: 160, minHeight: 72 }}>
        {data?.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang?.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <FlagIcon code={option.countryCode} sx={{ mr: 1 }} />
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  )

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <FlagIcon code={currentLang?.countryCode} />
      </IconButton>

      {renderMenuList()}
    </>
  )
}

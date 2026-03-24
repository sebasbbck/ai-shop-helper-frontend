import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button, { buttonClasses } from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import { usePopover } from 'minimal-shared/hooks'
import { useCallback } from 'react'
import { CustomPopover } from '../../../components/custom-popover'
import { Iconify } from '../../../components/iconify'
import { Scrollbar } from '../../../components/scrollbar'
import { useTranslation } from 'next-i18next'

import useCurrentProject from '../../../hooks/useCurrentProject'
import { Label } from '../../../components/label'
import { SxProps, Theme } from '@mui/material'
import { ProjectPublic } from '../../../../api/model'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

interface ProjectsPopoverProps {
  sx?: SxProps<Theme>
  [key: string]: any
}

export function ProjectsPopover({ sx, ...other }: ProjectsPopoverProps) {
  const mediaQuery = 'sm'

  const { open, anchorEl, onClose, onOpen } = usePopover()
  const router = useRouter()
  const { projects, currentProject, setCurrentProject } = useCurrentProject()
  const { t } = useTranslation()

  const handleChangeProject = useCallback(
    (newValue: ProjectPublic) => {
      if (newValue?.id) {
        setCurrentProject(String(newValue.id))
      }
      onClose()
    },
    [onClose, setCurrentProject],
  )

  const getProjectName = (project: ProjectPublic) =>
    project?.name || 'Cargando...'

  const buttonBg = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme: any) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  }

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Adapted: Use the first letter of the project name as a fallback logo */
      /* TODO: add logos to projects*/}
      <Avatar
        alt={getProjectName(currentProject)}
        // src={currentProject?.logo || ""}
        sx={{ width: 24, height: 24, borderRadius: '50%', fontSize: 12 }}
      >
        {getProjectName(currentProject).charAt(0).toUpperCase()}
      </Avatar>

      <Box
        component="span"
        sx={{
          typography: 'subtitle2',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {getProjectName(currentProject)}
      </Box>

      <Iconify
        width={16}
        icon="carbon:chevron-sort"
        sx={{ color: 'text.disabled' }}
      />
    </ButtonBase>
  )

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {projects.map((option) => (
            <MenuItem
              key={option.id}
              selected={String(option.id) === String(currentProject?.id)}
              onClick={() => handleChangeProject(option)}
              sx={{ height: 48 }}
            >
              <Avatar
                alt={getProjectName(option)}
                // src={option?.logo || ""}
                sx={{ width: 24, height: 24, fontSize: 12 }}
              >
                {getProjectName(option).charAt(0).toUpperCase()}
              </Avatar>

              <Typography
                noWrap
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
              >
                {getProjectName(option)}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Scrollbar>

      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

      <Button
        fullWidth
        startIcon={<Iconify width={18} icon="solar:settings-bold" />}
        onClick={() => {
          onClose()
          router.push('/settings/projects')
        }}
        sx={{
          gap: 2,
          justifyContent: 'flex-start',
          fontWeight: 'fontWeightMedium',
          [`& .${buttonClasses.startIcon}`]: {
            m: 0,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {t('translation:settings.projects.manage')}
      </Button>
    </CustomPopover>
  )

  /*
  const renderCredits = () => (
    <Label sx={{ ml: 1.5 }} endIcon={undefined} startIcon={undefined} className={undefined} disabled={undefined}>
      <Iconify width={16} icon="majesticons:coins" />
      {currentProject?.associated_tokens}
    </Label>
  )
*/

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  )
}

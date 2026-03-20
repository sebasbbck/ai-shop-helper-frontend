import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usePopover } from 'minimal-shared/hooks'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import { Iconify } from '../../../../components/iconify'
import { CustomPopover } from '../../../../components/custom-popover'

// import { CreateInvitationDialog } from './account-project-create-invitation-dialog';
import useCustomToast from '../../../../hooks/useCustomToast'
import useHandleError from '../../../../hooks/useHandleError'
import useAuth from '../../../../hooks/useAuth'
import { useTranslation } from 'next-i18next'
import { OrgPublic, OrgUserPublic, UserPublic } from '../../../../../api/model'
import {
  getOrgMembers,
  useGetOrgMembers,
  useRemoveOrgMember,
} from '../../../../../api/org-members/org-members'

// ----------------------------------------------------------------------

interface OrgMembersDialogProps {
  open: boolean
  onClose: () => any
  org: OrgPublic
}

export function OrgMembersDialog({
  open,
  onClose,
  org,
}: OrgMembersDialogProps) {
  const [cachedOrg, setCachedOrg] = useState(org)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()
  const { t } = useTranslation()

  useEffect(() => {
    if (org) {
      setCachedOrg(org)
    }
  }, [org])

  const orgId = cachedOrg?.id

  const { data: paginatedData, isLoading } = useGetOrgMembers(orgId)
  // Safely extract items from the response
  const users = paginatedData?.items ?? []

  /*
  const userRoleMutation = useMutation({
    mutationFn: (data: { is_administrator: boolean, is_editor: boolean, userProjectId: string }) =>
      ProjectsService.updateUserProjectRole({
        projectId: projectId || "",
        requestBody: {
          is_administrator: data.is_administrator,
          is_editor: data.is_editor
        },
        userProjectId: data.userProjectId,
      }),
    onSuccess: () => {
      showSuccessToast(t("translation:settings.projects.members_dialog.role_update_success"))
      queryClient.invalidateQueries({ queryKey: ["projectUsers", projectId] })
    },
    onError: (err) => {
      handleError(err)
    },
  })
  */

  const removeMutation = useRemoveOrgMember({
    mutation: {
      onSuccess: () => {
        showSuccessToast(
          t('translation:settings.projects.members_dialog.kick_user_success'),
        )
        queryClient.invalidateQueries({ queryKey: ['orgMembers', orgId] })
      },
      onError: (err) => {
        handleError(err)
      },
    },
  })

  const menuActions = usePopover()

  const renderMenuActions = (user: any) => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        {user?.is_administrator ? (
          <Box sx={{ mb: '4px' }}>
            <MenuItem onClick={() => {}}>
              <Iconify icon="tdesign:user-arrow-down-filled" />
              {t(
                'translation:settings.projects.members_dialog.demote_to_editor',
              )}
            </MenuItem>

            <MenuItem onClick={() => {}}>
              <Iconify icon="tdesign:user-arrow-down-filled" />
              {t(
                'translation:settings.projects.members_dialog.demote_to_member',
              )}
            </MenuItem>
          </Box>
        ) : user?.is_editor ? (
          <Box sx={{ mb: '4px' }}>
            <MenuItem onClick={() => {}}>
              <Iconify icon="tdesign:user-arrow-up-filled" />
              {t(
                'translation:settings.projects.members_dialog.promote_to_admin',
              )}
            </MenuItem>

            <MenuItem onClick={() => {}}>
              <Iconify icon="tdesign:user-arrow-down-filled" />
              {t(
                'translation:settings.projects.members_dialog.demote_to_member',
              )}
            </MenuItem>
          </Box>
        ) : (
          user && (
            <Box sx={{ mb: '4px' }}>
              <MenuItem onClick={() => {}}>
                <Iconify icon="tdesign:user-arrow-up-filled" />
                {t(
                  'translation:settings.projects.members_dialog.promote_to_admin',
                )}
              </MenuItem>

              <MenuItem onClick={() => {}}>
                <Iconify icon="tdesign:user-arrow-up-filled" />
                {t(
                  'translation:settings.projects.members_dialog.promote_to_editor',
                )}
              </MenuItem>
            </Box>
          )
        )}
        <Divider sx={{ borderStyle: 'dashed', mb: '4px' }} />

        <MenuItem
          onClick={() => {
            removeMutation.mutate({ orgId: orgId, userId: user.id })
            menuActions.onClose()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="material-symbols:close-rounded" />
          {t('translation:settings.projects.members_dialog.kick')}
        </MenuItem>
      </MenuList>
    </CustomPopover>
  )

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pr: 2 }}
        >
          <DialogTitle>
            {t('translation:settings.projects.members_dialog.title')}{' '}
            {cachedOrg?.name}
          </DialogTitle>
        </Stack>

        <DialogContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : !users?.length ? (
            <Typography
              sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}
            >
              {t('translation:settings.projects.members_dialog.no_members')}
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {users.map((user: OrgUserPublic) => (
                <Stack
                  key={user.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Avatar alt={user.id} sx={{ bgcolor: 'primary.main' }}>
                    {
                      // user.name?.charAt(0).toUpperCase()
                      user.user_id.charAt(0)
                    }
                  </Avatar>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {
                        // user.name
                        user.user_id
                      }
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {
                        // user.email || t("translation:settings.projects.members_dialog.no_email")
                        user.user_id
                      }
                    </Typography>
                  </Box>

                  {/* 
                  <Chip 
                    label={user.is_superuser ? t("translation:settings.projects.members_dialog.admin") : user.dfasfasddfp ? t("translation:settings.projects.members_dialog.editor") : t("translation:settings.projects.members_dialog.member")}
                    color={user.is_superuser ? "primary" : "default"}
                    size="small"
                  />
                  */}

                  {user.id != currentUser?.id && (
                    <IconButton
                      color={menuActions.open ? 'inherit' : 'default'}
                      onClick={(e) => {
                        setSelectedUser(user as any)
                        menuActions.onOpen(e)
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  )}
                </Stack>
              ))}

              {renderMenuActions(selectedUser)}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="aishophelper"
            onClick={() => setInviteDialogOpen(true)}
            startIcon={<Iconify icon="mingcute:user-add-fill" />}
          >
            {t('translation:settings.projects.members_dialog.invite')}
          </Button>
          <Button onClick={onClose} color="inherit" variant="outlined">
            {t('translation:settings.projects.members_dialog.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/*
      <CreateInvitationDialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)} 
        projectId={projectId || ""}
      />
      */}
    </>
  )
}

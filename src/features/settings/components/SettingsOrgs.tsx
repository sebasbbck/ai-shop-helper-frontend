import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import useCustomToast from '../../../hooks/useCustomToast'
import { Iconify } from '../../../components/iconify'
import { Form, Field } from '../../../components/hook-form'
import { useBoolean } from 'minimal-shared/hooks'

// import useCurrentProject from '../../../hooks/useCurrentProject'
// import { readDefaultProjectIdForUser, setDefaultProjectIdForUser } from '../../../hooks/useCurrentProject'
import useAuth from '../../../hooks/useAuth'
// import { Project, ProjectsService } from '@/client'
// import { ProjectMembersDialog } from './account-project-members-dialog'
// import { ProjectEditDialog } from './account-project-edit-dialog'
import useHandleError from '../../../hooks/useHandleError'
import { useTranslation } from 'next-i18next'
import { IconButton, Input, Radio, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import {
  getMyOrgs,
  useCreateOrg,
  useGetMyOrgs,
} from '../../../../api/orgs/orgs'
import { OrgPublic } from '../../../../api/model'
import { OrgsCreateOrgBody } from '../../../../api/orgs/orgs.zod'
import { OrgMembersDialog } from '../orgs/components/OrgMembersDialog'

// ----------------------------------------------------------------------

/*
export type ProjectCreateProps = {
  project_name: string;
  set_as_current_project: boolean;
};

const CreateProjectSchema = z.object({
  project_name: z.string().trim().min(1, "El nombre es obligatorio"),
  set_as_current_project: z.boolean()
})

const JoinProjectSchema = z.object({
  invitation_id: z.string().trim().min(1, "El código es obligatorio"),
})
*/

export function SettingsOrgs() {
  // const { projects, setCurrentProject } = useCurrentProject()
  const { user: authUser } = useAuth()
  const qc = useQueryClient()
  const handleError = useHandleError()
  const openCreateDialog = useBoolean()
  const { showSuccessToast } = useCustomToast()
  const { t } = useTranslation()
  const router = useRouter()

  const [selectedOrgForMembers, setSelectedOrgForMembers] =
    useState<OrgPublic | null>(null)
  const openMembersDialog = !!selectedOrgForMembers

  // const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null)
  // const openEditDialog = !!selectedProjectForEdit

  // const [editingTokens, setEditingTokens] = useState<Project | undefined>(undefined)
  const [tokens, setTokens] = useState<string | undefined>(undefined)

  const { data, isLoading } = useGetMyOrgs()

  // Safely extract items from the response
  const orgs = data?.items ?? []

  /*
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null)
  
  useEffect(() => {
    if (authUser?.id) {
      const id = readDefaultProjectIdForUser(authUser.id)
      setDefaultProjectId(id)
    }
  }, [authUser?.id])
  
  const handleSetAsDefault = (projectId: string) => {
    if (authUser?.id) {
      setDefaultProjectIdForUser(authUser.id, projectId)
      setDefaultProjectId(projectId)
    }
  }
  */

  const createProjectMethods = useForm({
    resolver: zodResolver(OrgsCreateOrgBody),
    defaultValues: { name: '' },
  })

  const {
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { isSubmitting: isCreating },
  } = createProjectMethods

  const createMutation = useCreateOrg({
    mutation: {
      onSuccess: async (data, variables) => {
        qc.invalidateQueries({ queryKey: ['projects'] })

        showSuccessToast(
          t('translation:settings.projects.add_project.create_success'),
        )
        resetCreateForm()
        openCreateDialog.onFalse()
      },
      onError: (err) => {
        handleError(err)
      },
    },
  })

  const onSubmitCreate = handleCreateSubmit((data) => {
    createMutation.mutate({ data })
  })

  const handleCloseCreate = () => {
    resetCreateForm()
    // resetJoinForm()
    setDialogView('choice')
    openCreateDialog.onFalse()
  }

  const [dialogView, setDialogView] = useState('choice') // 'choice' | 'create' | 'join'

  // Reset form when switching to create view to avoid controlled/uncontrolled component warning
  useEffect(() => {
    if (dialogView === 'create') {
      resetCreateForm()
    }
  }, [dialogView, resetCreateForm])

  /*
  const joinProjectMethods = useForm({
    resolver: zodResolver(JoinProjectSchema),
    defaultValues: { invitation_id: '' },
  })

  const joinMutation = useMutation({
    mutationFn: (data: { invitation_id: string }) => ProjectsService.addUserToProject({ invitationId: data.invitation_id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      showSuccessToast(t("settings.projects.add_project.join_success"))
      resetCreateForm()
      openCreateDialog.onFalse()
    },
    onError: (err) => {
      handleError(err)
    },
  })

  const { handleSubmit: handleJoinSubmit, reset: resetJoinForm } = joinProjectMethods

  const onSubmitJoin = handleJoinSubmit((data) => {
    console.log(data)
    joinMutation.mutate(data)
  })

  const UpdateTokensSchema = z.object({
      tokens: z.number().min(0, "El número de créditos no puede ser negativo"),
    })
  
    type UpdateTokensForm = z.infer<typeof UpdateTokensSchema>

    const methods = useForm<UpdateTokensForm>({
      resolver: zodResolver(UpdateTokensSchema),
      defaultValues: { 
          tokens: editingTokens?.associated_tokens ?? 0 
      },
    })
  
    const { reset } = methods
  
    useEffect(() => {
      if (editingTokens) {
        reset({ tokens: editingTokens.associated_tokens ?? 0 })
      }
    }, [editingTokens, reset])
  
    const updateTokensMutation = useMutation({
      mutationFn: (tokens: number) =>
        ProjectsService.updateProjectAssociatedTokens({ 
          projectId: editingTokens?.id ?? "", 
          requestBody: { associated_tokens: tokens } 
        }),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["projects"] })
        showSuccessToast("Créditos actualizados")
      },
      onError: (err: any) => {
        handleError(err)
      },
    })
  
    const onUpdateTokens = async (e: React.FormEvent) => {
      e.preventDefault()
      const numericTokens = tokens ? parseInt(tokens) : 0
      const validation = UpdateTokensSchema.safeParse({ tokens: numericTokens })

      if (!validation.success) {
        handleError(validation.error.message)
        return
      }
      await updateTokensMutation.mutateAsync(numericTokens)

      setEditingTokens(undefined)
      setTokens(undefined)
    }
*/
  const renderFormCreateFormDialog = () => (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openCreateDialog.value}
      onClose={handleCloseCreate}
    >
      <DialogTitle>
        {dialogView === 'choice' &&
          t('translation:settings.projects.add_project.title')}
        {dialogView === 'create' &&
          t('translation:settings.projects.add_project.create')}
        {dialogView === 'join' &&
          t('translation:settings.projects.add_project.join')}
      </DialogTitle>

      <Box sx={{ px: 3, py: 2, pb: 3 }}>
        {dialogView === 'choice' && (
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="aishophelper"
              size="large"
              startIcon={<Iconify icon="mingcute:group-line" width={24} />}
              sx={{
                py: 3,
                borderStyle: 'dashed',
                flexDirection: 'column',
                gap: 1,
              }}
              onClick={() => setDialogView('join')}
            >
              {t('translation:settings.projects.add_project.join')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="aishophelper"
              size="large"
              startIcon={<Iconify icon="mingcute:add-line" width={24} />}
              sx={{
                py: 3,
                borderStyle: 'dashed',
                flexDirection: 'column',
                gap: 1,
              }}
              onClick={() => setDialogView('create')}
            >
              {t('translation:settings.projects.add_project.create')}
            </Button>
          </Stack>
        )}

        {dialogView === 'create' && (
          <Form methods={createProjectMethods} onSubmit={onSubmitCreate}>
            <Stack spacing={3}>
              <Field.Text
                name="name"
                label={t('translation:settings.projects.add_project.name')}
              />

              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button color="inherit" onClick={() => setDialogView('choice')}>
                  {t('translation:settings.projects.add_project.back')}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  color="aishophelper"
                  loading={isCreating}
                >
                  {t('translation:settings.projects.add_project.create_button')}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}

        {/*
        dialogView === 'join' && (
          <Form methods={joinProjectMethods} onSubmit={onSubmitJoin}>
            <Stack spacing={3}>
              <Field.Text name="invitation_id" label={t("translation:settings.projects.add_project.invitation_code")} />
              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button color="inherit" onClick={() => setDialogView('choice')}>{t("translation:settings.projects.add_project.back")}</Button>
                <Button variant="contained" type="submit" color="aishophelper">
                  {t("translation:settings.projects.add_project.join_button")}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )
        */}
      </Box>
    </Dialog>
  )

  return (
    <>
      <Card>
        <CardHeader
          title={t('translation:settings.projects.title')}
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreateDialog.onTrue}
            >
              {t('translation:settings.projects.add')}
            </Button>
          }
        />

        <Box
          sx={{
            p: 3,
            rowGap: 2.5,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {orgs.map((org: OrgPublic) => (
            <Paper
              key={org.id}
              variant="outlined"
              sx={{
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Stack spacing={0.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1" noWrap>
                    {org.name}
                  </Typography>
                  {/*
                    <Tooltip
                      arrow
                      title={t("translation:settings.projects.default_project_tooltip")}
                      slotProps={{ tooltip: { sx: { maxWidth: 240, mr: 0.5 } } }}
                    >
                      <Radio
                        checked={defaultProjectId === String(project.id)}
                        onChange={() => handleSetAsDefault(String(project.id))}
                        sx={{
                          width: "24px",
                          height: "24px"
                        }}
                      />
                    </Tooltip>
                  */}
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {t('translation:settings.projects.tokens')}:
                  {/* editingTokens?.id === project.id ?
                    // <Box sx={{ display: "flex", gap: 1, mb: 0.5, alignItems: "center" }}>
                    <form onSubmit={onUpdateTokens} style={{ display: "flex", alignItems: "center"}}>
                      <Input
                        value={tokens}
                        onChange={(e) => {setTokens(e.target.value)}}
                        autoFocus
                        type="number"
                        sx={{
                          borderRadius: "8px",
                          height: 24,
                          fontWeight: 600,
                          maxWidth: 64,
                          flexShrink: 1,
                        }}
                        slotProps={{
                          input: {
                            min: 0,
                          },
                        }}
                      />
                      <IconButton
                        aria-label="cancel"
                        color="error"
                        sx={{ p: 0.5 }}
                        onClick={() => {
                          setEditingTokens(undefined)
                          setTokens(undefined)
                        }}
                      > 
                        <Iconify width={16} icon="material-symbols:close-rounded" />
                      </IconButton>

                      <IconButton
                        aria-label="save"
                        color="success"
                        sx={{ p: 0.5 }}
                        type="submit"
                        disabled={updateTokensMutation.isPending}
                      > 
                        <Iconify width={16} icon="eva:checkmark-fill" />
                      </IconButton>
                    </form>
                    // </Box>
                  */}
                  {
                    <>
                      <Box
                        component="span"
                        sx={{ color: 'text.primary', fontWeight: 'bold' }}
                      >
                        {org.credits}
                      </Box>
                      {/*
                      <IconButton 
                        onClick={() => {
                          setEditingTokens(project)
                          setTokens(project.associated_tokens?.toString())
                        }}
                        sx={{ p: 0.5 }}>
                        <Iconify icon="solar:pen-bold" width={16} />
                      </IconButton>
                      */}
                    </>
                  }
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<Iconify icon="mingcute:group-line" />}
                  fullWidth
                  // onClick={() => setSelectedProjectForMembers(project)}
                >
                  {t('translation:settings.projects.members')}
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="aishophelper"
                  startIcon={<Iconify icon="solar:pen-bold" />}
                  fullWidth
                  // onClick={() => setSelectedProjectForEdit(project)}
                >
                  {t('translation:settings.projects.edit')}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Card>

      {renderFormCreateFormDialog()}

      {selectedOrgForMembers && (
        <OrgMembersDialog
          open={openMembersDialog}
          org={selectedOrgForMembers}
          onClose={() => setSelectedOrgForMembers(null)}
        />
      )}
      {/*
      {selectedProjectForEdit &&
        <ProjectEditDialog 
          open={openEditDialog} 
          project={selectedProjectForEdit}
          onClose={() => setSelectedProjectForEdit(null)}
        />
      }
      */}
    </>
  )
}

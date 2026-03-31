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
import useAuth from '../../../hooks/useAuth'
import useHandleError from '../../../hooks/useHandleError'
import { useTranslation } from 'next-i18next'
import { IconButton, Input, MenuItem, Radio, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { OrgPublic, ProjectPublic } from '../../../../api/model'
import {
  getGetMyProjectsQueryKey,
  useCreateProject,
  useGetMyProjects,
} from '../../../../api/projects/projects'
import useCurrentProject, {
  readDefaultProjectIdForUser,
  setDefaultProjectIdForUser,
} from '../../../hooks/useCurrentProject'
import { ProjectsCreateProjectBody } from '../../../../api/projects/projects.zod'
import { useGetMyOrgs } from '../../../../api/orgs/orgs'
import { ProjectEditDialog } from '../../projects/components/ProjectEditDialog'

// ----------------------------------------------------------------------

// TODO: Remove hardcoded project type IDs
const PROJECT_TYPES = [
  { value: 'd6c239a7-8052-49ed-94e3-e374175d963a', label: 'WordPress' },
  { value: 'a495ab4e-1492-4575-ba71-1e4991a53ce0', label: 'Shopify' },
  { value: '8a5be972-acea-43f6-9e53-b010644fe6ce', label: 'WooCommerce' },
]

export function SettingsProjects() {
  const { projects, currentProject, setCurrentProject } = useCurrentProject()
  const { user: authUser } = useAuth()
  const qc = useQueryClient()
  const handleError = useHandleError()
  const openCreateDialog = useBoolean()
  const { showSuccessToast } = useCustomToast()
  const { t } = useTranslation()
  const router = useRouter()

  const [selectedProjectForEdit, setSelectedProjectForEdit] =
    useState<ProjectPublic | null>(null)
  const openEditDialog = !!selectedProjectForEdit
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null)

  const { data: orgsData, isLoading: isLoadingOrgs } = useGetMyOrgs(undefined, {
    query: {
      enabled: !!authUser,
    },
  })
  const orgs = orgsData?.items ?? []

  useEffect(() => {
    if (authUser?.id) {
      const id = currentProject?.id
      setDefaultProjectId(id)
    }
  }, [authUser?.id, currentProject?.id])

  const handleSetAsDefault = (projectId: string) => {
    if (authUser?.id) {
      setCurrentProject(projectId)
      setDefaultProjectId(projectId)
    }
  }

  const createProjectMethods = useForm({
    resolver: zodResolver(ProjectsCreateProjectBody),
    defaultValues: {
      name: '',
      project_type_id: '',
      org_id: '',
    },
  })

  const {
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { isSubmitting: isCreating },
  } = createProjectMethods

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: async (data, variables) => {
        qc.invalidateQueries({ queryKey: getGetMyProjectsQueryKey() })

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
    createMutation.mutate({
      orgId: data.org_id,
      data: data,
    })
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
              {/* Project Name */}
              <Field.Text
                name="name"
                label={t('translation:settings.projects.add_project.name')}
              />

              {/* Organization Selection */}
              <Field.Select
                name="org_id"
                label="Organización"
                helperText={isLoadingOrgs ? 'Cargando organizaciones...' : ''}
              >
                {orgs.map((org: OrgPublic) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Field.Select>

              {/* Project Type Selection */}
              <Field.Select name="project_type_id" label="Tipo de proyecto">
                {PROJECT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Field.Select>

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
          {projects.map((project: ProjectPublic) => (
            <Paper
              key={project.id}
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
                    {project.name}
                  </Typography>

                  <Tooltip
                    arrow
                    title={t(
                      'translation:settings.projects.default_project_tooltip',
                    )}
                    slotProps={{ tooltip: { sx: { maxWidth: 240, mr: 0.5 } } }}
                  >
                    <Radio
                      checked={defaultProjectId === String(project.id)}
                      onChange={() => handleSetAsDefault(String(project.id))}
                      sx={{
                        width: '24px',
                        height: '24px',
                      }}
                    />
                  </Tooltip>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                  // TODO: Obtain org name differently
                >
                  Organización:
                  {
                    <>
                      <Box
                        component="span"
                        sx={{ color: 'text.primary', fontWeight: 'bold' }}
                      >
                        {(orgs as OrgPublic[])?.find(
                          (o) => o.id === project.org_id,
                        )?.name ?? 'Cargando...'}
                      </Box>
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
                  onClick={() => setSelectedProjectForEdit(project)}
                >
                  {t('translation:settings.projects.edit_dialog.title')}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Card>

      {renderFormCreateFormDialog()}

      {selectedProjectForEdit && (
        <ProjectEditDialog
          open={openEditDialog}
          project={selectedProjectForEdit}
          onClose={() => setSelectedProjectForEdit(null)}
          orgs={orgs as OrgPublic[]}
        />
      )}
    </>
  )
}

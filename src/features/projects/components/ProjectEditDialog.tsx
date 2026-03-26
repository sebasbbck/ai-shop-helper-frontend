import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { useTranslation } from 'next-i18next'
import { OrgPublic, ProjectPublic } from '../../../../api/model'
import Stack from '@mui/material/Stack'
import { Field, Form } from '../../../components/hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectsUpdateProjectBody } from '../../../../api/projects/projects.zod'
import {
  getGetMyProjectsQueryKey,
  useUpdateProject,
} from '../../../../api/projects/projects'
import useCustomToast from '../../../hooks/useCustomToast'
import useHandleError from '../../../hooks/useHandleError'
import MenuItem from '@mui/material/MenuItem'
import { useForm } from 'react-hook-form'

// ----------------------------------------------------------------------

// TODO: Remove hardcoded project type IDs
const PROJECT_TYPES = [
  { value: 'd6c239a7-8052-49ed-94e3-e374175d963a', label: 'WordPress' },
  { value: 'a495ab4e-1492-4575-ba71-1e4991a53ce0', label: 'Shopify' },
  { value: '8a5be972-acea-43f6-9e53-b010644fe6ce', label: 'WooCommerce' },
]

interface ProjectEditDialogProps {
  open: boolean
  onClose: () => any
  project: ProjectPublic
  orgs: OrgPublic[]
}

export function ProjectEditDialog({
  open,
  onClose,
  project,
}: ProjectEditDialogProps) {
  const { t } = useTranslation()
  const [cachedProject, setCachedProject] = useState(project)
  const qc = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const handleError = useHandleError()

  useEffect(() => {
    if (project) {
      setCachedProject(project)
    }
  }, [project])

  // we use the cachedProject for the ID and the UI
  const projectId = cachedProject?.id

  const updateProjectMethods = useForm({
    resolver: zodResolver(ProjectsUpdateProjectBody),
    defaultValues: {
      name: project.name,
      project_type_id: project.project_type_id,
    },
  })

  const {
    handleSubmit: handleUpdateSubmit,
    reset,
    formState: { isSubmitting },
  } = updateProjectMethods

  const updateMutation = useUpdateProject({
    mutation: {
      onSuccess: async (data, variables) => {
        qc.invalidateQueries({ queryKey: getGetMyProjectsQueryKey() })

        showSuccessToast(
          t('translation:settings.projects.edit_dialog.update_success'),
        )
        reset()
        onClose()
      },
      onError: (err) => {
        handleError(err)
      },
    },
  })

  const onSubmitUpdate = handleUpdateSubmit((data) => {
    updateMutation.mutate({
      orgId: project.org_id,
      projectId: project.id,
      data,
    })
  })

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>
        {t('translation:settings.projects.edit_dialog.title')}{' '}
        {cachedProject?.name}
      </DialogTitle>

      <Form methods={updateProjectMethods} onSubmit={onSubmitUpdate}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Project Name */}
            <Field.Text
              name="name"
              label={t('translation:settings.projects.add_project.name')}
            />

            {/* Project Type Selection */}
            <Field.Select name="project_type_id" label="Tipo de proyecto">
              {PROJECT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={onClose}>
            {t('translation:settings.projects.add_project.back')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="aishophelper"
            loading={isSubmitting}
          >
            {t('translation:settings.projects.edit_dialog.update')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}

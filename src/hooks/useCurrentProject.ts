import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import useAuth from './useAuth'

import { ProjectPublic } from '../../api/model'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useGetMyProjects } from '../../api/projects/projects'

const CURRENT_PROJECT_KEY = 'current_project_id'
const DEFAULT_PROJECT_NAME = 'Proyecto por defecto'

function readCurrentProjectId(): string | null {
  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY)
  } catch (_err) {
    return null
  }
}

function setCurrentProjectId(id: string) {
  try {
    localStorage.setItem(CURRENT_PROJECT_KEY, id)
  } catch (_err) {
    // ignore
  }
}

export default function useCurrentProject() {
  const qc = useQueryClient()

  const { user: authUser } = useAuth()
  const prevTokensRef = useRef<number | null>(null)

  const { data, isLoading, refetch } = useGetMyProjects()
  const projects = (data?.items as ProjectPublic[]) ?? []
  // enabled: isLoggedIn(),

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    () => {
      try {
        return readCurrentProjectId()
      } catch (_err) {
        return null
      }
    },
  )

  /*
  const createProjectMutation = useMutation<Project, unknown, string>({
    mutationFn: async (name: string) => {
      const created = await ProjectsService.createProject({
        requestBody: { project_name: name },
      })
      return created
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["projects"] })
      try {
        const id = (created as any)?.id
        if (id) {
          setCurrentProjectId(String(id))
          setSelectedProjectId(String(id))
          try {
            window.dispatchEvent(new CustomEvent("aishop:current_project_changed", { detail: String(id) }))
          } catch (_e) {}
        }
      } catch (_) {}
    },
  })
  */

  useEffect(() => {
    const list: ProjectPublic[] = Array.isArray(projects) ? projects : []
    if (isLoading) return

    const stored = selectedProjectId ?? readCurrentProjectId()

    if (list.length > 0) {
      const exists = stored && list.find((p) => String(p.id) === String(stored))
      if (!exists) {
        const firstId = list[0]?.id
        if (firstId) {
          setCurrentProjectId(String(firstId))
          setSelectedProjectId(String(firstId))
        }
      } else {
        if (stored && stored !== selectedProjectId) {
          setSelectedProjectId(String(stored))
        }
      }
      return
    }

    if (!stored) {
      console.log(
        "This should create a project, but project creation hasn't been implemented yet.",
      )
      // createProjectMutation.mutate(DEFAULT_PROJECT_NAME)
      return
    }
  }, [projects, isLoading, selectedProjectId]) // , createProjectMutation.mutate

  useEffect(() => {
    const handler = (e: any) => {
      const id = (e && e.detail) || readCurrentProjectId()
      if (id) setSelectedProjectId(String(id))
    }
    try {
      window.addEventListener(
        'aishop:current_project_changed',
        handler as EventListener,
      )
    } catch (_e) {}
    return () => {
      try {
        window.removeEventListener(
          'aishop:current_project_changed',
          handler as EventListener,
        )
      } catch (_e) {}
    }
  }, [])

  const currentProject: ProjectPublic | null = (() => {
    try {
      const id = selectedProjectId ?? readCurrentProjectId()
      if (!id) return (projects as ProjectPublic[])[0] ?? null
      return (
        ((projects as ProjectPublic[]) || []).find(
          (p) => String(p.id) === String(id),
        ) ??
        (projects as ProjectPublic[])[0] ??
        null
      )
    } catch (_err) {
      return (projects as ProjectPublic[])[0] ?? null
    }
  })()

  const setCurrentProject = useCallback(
    (projectId: string) => {
      setCurrentProjectId(projectId)
      setSelectedProjectId(String(projectId))
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey
          return (
            Array.isArray(key) &&
            (key[0] === 'blogs' ||
              key[0] === 'workflows' ||
              key[0] === 'actions')
          )
        },
      })
      try {
        window.dispatchEvent(
          new CustomEvent('aishop:current_project_changed', {
            detail: String(projectId),
          }),
        )
      } catch (_e) {}
    },
    [qc],
  )

  // effect to monitor token drops
  /*
  useEffect(() => {
    if (!currentProject || isLoading) return
    const currentTokens = currentProject.associated_tokens ?? 0
    
    // check if we had tokens before, but now we have 0
    if (prevTokensRef.current !== null && prevTokensRef.current > 0 && currentTokens === 0) {
      navigate({ to: "/$lang/settings/billing", params: { lang: params.lang }})
    }

    // update the ref with the current value for the next comparison
    prevTokensRef.current = currentTokens
  }, [currentProject, isLoading, navigate])
  */

  return {
    projects: projects as ProjectPublic[],
    currentProject,
    isLoading,
    refreshProjects: refetch,
    setCurrentProject,
    // createProject: (name = DEFAULT_PROJECT_NAME) => createProjectMutation.mutate(name),
    // createProjectStatus: createProjectMutation.status,
  }
}

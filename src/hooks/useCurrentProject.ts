import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useAuth from './useAuth'

import { ProjectPublic } from '../../api/model'
import {
  getGetMyProjectsQueryKey,
  useGetMyProjects,
} from '../../api/projects/projects'
import { useGetMyOrgs } from '../../api/orgs/orgs'
import { getAccessToken } from '../../api/mutator/custom-instance'

const CURRENT_PROJECT_KEY = 'current_project_id'
const DEFAULT_PROJECT_IDS_KEY = 'default_project_ids'
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

function readDefaultProjectIdForUser(userId: string): string | null {
  try {
    const mapStr = localStorage.getItem(DEFAULT_PROJECT_IDS_KEY)
    if (!mapStr) return null
    const map = JSON.parse(mapStr) as Record<string, string>
    return map[userId] ?? null
  } catch (_err) {
    return null
  }
}

function setDefaultProjectIdForUser(userId: string, projectId: string) {
  try {
    const mapStr = localStorage.getItem(DEFAULT_PROJECT_IDS_KEY)
    const map = mapStr ? JSON.parse(mapStr) : {}
    map[userId] = projectId
    localStorage.setItem(DEFAULT_PROJECT_IDS_KEY, JSON.stringify(map))
  } catch (_err) {
    // ignore
  }
}

export { readDefaultProjectIdForUser, setDefaultProjectIdForUser }

export default function useCurrentProject() {
  const qc = useQueryClient()

  const { user: authUser } = useAuth()
  const token = getAccessToken()
  const prevTokensRef = useRef<number | null>(null)

  const { data, isLoading, isFetching, refetch } = useGetMyOrgs(undefined, {
    query: {
      // Only fire if we have a token and user
      enabled: !!token && !!authUser?.id,
    },
  })
  const orgs = useMemo(() => (data?.items as any[]) ?? [], [data])
  const projects = useMemo(
    () => orgs.flatMap((org) => (org.projects ?? []) as ProjectPublic[]),
    [orgs],
  )
  // enabled: isLoggedIn(),

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    // Only runs on the client after mount
    const id = readCurrentProjectId()
    if (id) setSelectedProjectId(id)
  }, [])

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
    if (isLoading || isFetching) return

    const list: ProjectPublic[] = Array.isArray(projects) ? projects : []
    const stored = selectedProjectId ?? readCurrentProjectId()

    if (list.length > 0) {
      const exists = stored && list.find((p) => String(p.id) = String(stored))
      if (!exists && !isFetching) {
        // Try to get the user's default project first, otherwise use the first project
        const defaultProjectId = authUser?.id
          ? readDefaultProjectIdForUser(authUser.id)
          : null
        const defaultProject =
          defaultProjectId &&
          list.find((p) => String(p.id) === String(defaultProjectId))
        const projectToUse = defaultProject ?? list[0]
        const projectId =
          typeof projectToUse === 'string' ? '' : projectToUse.id
        if (projectId) {
          setCurrentProjectId(String(projectId))
          setSelectedProjectId(String(projectId))
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
  }, [projects, isLoading, isFetching, selectedProjectId]) // , createProjectMutation.mutate

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
      if (authUser?.id) {
        setDefaultProjectIdForUser(authUser.id, projectId)
      }

      qc.invalidateQueries({ queryKey: getGetMyProjectsQueryKey() })
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
    [qc, authUser?.id],
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
    orgs,
    projects: projects as ProjectPublic[],
    currentProject,
    isLoading,
    refreshProjects: refetch,
    setCurrentProject,
    // createProject: (name = DEFAULT_PROJECT_NAME) => createProjectMutation.mutate(name),
    // createProjectStatus: createProjectMutation.status,
  }
}

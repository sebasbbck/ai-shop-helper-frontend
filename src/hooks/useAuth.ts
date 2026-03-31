import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { register } from '../../api/auth/auth'
import { getGetMeQueryKey } from '../../api/users/users'
import type { BodyAuthLogin, UserCreate } from '../../api/model'
import useHandleError from './useHandleError'
import { useTranslation } from 'next-i18next'
import {
  setAccessToken,
  clearAccessToken,
} from '../../api/mutator/custom-instance'

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleError = useHandleError()

  const { data: user, refetch } = useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Not authenticated')
      const data = await response.json()

      if (data.access_token) {
        setAccessToken(data.access_token)
      }

      return data
    },
    enabled: typeof window !== 'undefined',
    retry: false,
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserCreate) => register(data),
    onSuccess: () => {
      router.push('/login')
    },
    onError: (err: unknown) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const performLogin = async (credentials: BodyAuthLogin) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    setAccessToken(data.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: performLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
      await refetch()
      router.replace('/')
    },
    onError: (err: unknown) => {
      handleError(err)
    },
  })

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (e) {
      console.warn('Error calling logout API:', e)
    } finally {
      clearAccessToken()
      localStorage.removeItem('current_project_id')
      queryClient.clear()
      router.push('/login')
    }
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  }
}

export default useAuth

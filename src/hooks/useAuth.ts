import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { login, register, logout as logoutApi } from '../../api/auth/auth'
import { useGetMe, getGetMeQueryKey } from '../../api/users/users'
import type { BodyAuthLogin, UserPublic, UserCreate } from '../../api/model'
import useHandleError from './useHandleError'
import { useTranslation } from 'next-i18next'
import { setToken, getToken, clearToken } from '../utils/token'

const isLoggedIn = () => {
  return localStorage.getItem('token') !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const handleError = useHandleError()

  const { data: user, refetch } = useGetMe({
    query: {
      enabled: typeof window !== 'undefined' && isLoggedIn(),
    },
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
    const response = await login(credentials)
    setToken(response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: performLogin,
    onSuccess: async () => {
      // Invalidate and refetch the user query after successful login
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
      await refetch()
      router.push('/')
    },
    onError: (err: unknown) => {
      handleError(err)
    },
  })

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await logoutApi()
    } catch (e) {
      // Continue with logout even if API call fails
      console.warn('Error calling logout API:', e)
    } finally {
      // Clear local state
      clearToken()

      // Clear react-query cache to avoid leaking previous user's cached data
      queryClient.clear()

      // Redirect to login
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

export { isLoggedIn }
export default useAuth

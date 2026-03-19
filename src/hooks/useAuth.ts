import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { login, register, logout as logoutApi } from '../../api/auth/auth'
import { useGetMe, getGetMeQueryKey } from '../../api/users/users'
import type { BodyAuthLogin, UserPublic, UserCreate } from '../../api/model'
import useHandleError from './useHandleError'
import { useTranslation } from 'next-i18next'
import { setAccessToken, clearAccessToken, getAccessToken } from '../../api/mutator/custom-instance'

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const handleError = useHandleError()

  const { data: user, refetch } = useGetMe({
    query: {
      enabled: typeof window !== 'undefined' && !!getAccessToken(),
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
    setAccessToken(response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: performLogin,
    onSuccess: async () => {
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
      await logoutApi()
    } catch (e) {
      console.warn('Error calling logout API:', e)
    } finally {
      clearAccessToken()
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

import { useCallback } from 'react'
import { useRouter } from 'next/router'
import useCustomToast from './useCustomToast'
import { i18n } from 'next-i18next'
import { AxiosError } from 'axios'

export interface ErrorHandleResult {
  message: string
  shouldRedirectToBilling: boolean
}

export function getErrorMessage(err: any, t?: any) {
  const translate = t || ((key: string) => key)

  if (err instanceof AxiosError) {
    const statusCode = err.response?.status
    const errDetail = err.response?.data

    // Try server-returned detail
    if (errDetail?.detail && typeof errDetail.detail === 'string') {
      return errDetail.detail
    }

    // Try specific status code translations
    if (statusCode) {
      const specificKey = `translation:errors.${statusCode}`
      const fallbackKey = `translation:errors.fallbacks.${statusCode}`

      if (i18n.exists(specificKey)) return translate(specificKey)
      if (i18n.exists(fallbackKey)) return translate(fallbackKey)
    }

    return (
      errDetail?.message || translate('translation:errors.fallbacks.default')
    )
  }

  return err?.message || translate('translation:errors.fallbacks.default')
}

export const handleError = (err: any): ErrorHandleResult => {
  const errorMessage = getErrorMessage(err)

  if (err instanceof AxiosError && err.status === 402) {
    return { message: errorMessage, shouldRedirectToBilling: true }
  }

  return { message: errorMessage, shouldRedirectToBilling: false }
}

export default function useHandleError() {
  const { showErrorToast } = useCustomToast()
  const router = useRouter()

  return useCallback(
    (err: any) => {
      const result: ErrorHandleResult = handleError(err)

      showErrorToast(result.message)

      if (result.shouldRedirectToBilling) {
        router.push('/settings/billing')
      }
    },
    [showErrorToast, router],
  )
}

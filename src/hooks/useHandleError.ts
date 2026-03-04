import { useCallback } from "react"
import { useRouter } from "next/router"
import useCustomToast from "./useCustomToast"
import { i18n } from "next-i18next"
import { t } from "i18next"
import { AxiosError } from "axios"

export interface ErrorHandleResult {
  message: string
  shouldRedirectToBilling: boolean
}

export function getErrorMessage(err: any) {
  let errorMessage: string

  if (err instanceof AxiosError) {    
    errorMessage = err.message
    
    const errDetail = err.response?.data
    if (errDetail?.detail && typeof errDetail.detail === "string") {
      errorMessage = errDetail.detail
    }

    if (errDetail.code) {
      if (i18n.exists(`translation:errors.${errDetail.code}`)) {
        errorMessage = t(`translation:errors.${errDetail.code}` as any)
      } else if (i18n.exists(`translation:errors.fallbacks.${err.status}`)) {
        errorMessage = t(`translation:errors.fallbacks.${err.status}` as any)
      } else {
        errorMessage = errDetail.message || t("translation:errors.fallbacks.default")
      }
    }
  } else if (err instanceof Error) {
    errorMessage = err.message || t("translation:errors.fallbacks.default")
  } else if (typeof err === "string") {
    errorMessage = err
  } else {
    errorMessage = t("translation:errors.fallbacks.default")
  }

  return errorMessage
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

  return useCallback((err: any) => {
    const result: ErrorHandleResult = handleError(err)
    
    showErrorToast(result.message)
    
    if (result.shouldRedirectToBilling) {
      router.push("/settings/billing")
    }
  }, [showErrorToast, router])
}

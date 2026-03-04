"use client"

import { muiToaster } from "../components/ui/mui-toaster"

const useCustomToast = () => {
  const showSuccessToast = (description: string) => {
    muiToaster.success(description)
  }

  const showErrorToast = (description: string) => {
    muiToaster.error(description)
  }

  const showInfoToast = (title: string, description?: string) => {
    muiToaster.info(title, { description: description ?? undefined })
  }

  const showWarningToast = (title: string, description?: string) => {
    muiToaster.warning(title, { description: description ?? undefined })
  }

  return { showSuccessToast, showErrorToast, showInfoToast, showWarningToast }
}

export default useCustomToast

'use client'

import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert, { type AlertColor } from '@mui/material/Alert'

type ToastType = AlertColor | 'loading'

type ToastItem = {
  id: number
  title?: string
  description?: string
  type?: ToastType
  duration?: number | null
}

// Simple event-subscription based toaster
const subscribers = new Set<(toasts: ToastItem[]) => void>()
let internalToasts: ToastItem[] = []
let idCounter = 1

export const muiToaster = {
  create: (t: Omit<ToastItem, 'id'>) => {
    const id = idCounter++
    const toast: ToastItem = { id, ...t }
    internalToasts = [...internalToasts, toast]
    subscribers.forEach((s) => s(internalToasts))
    return id
  },
  success: (message: string, options?: Partial<ToastItem>) =>
    muiToaster.create({ title: message, type: 'success', ...options }),
  error: (message: string, options?: Partial<ToastItem>) =>
    muiToaster.create({ title: message, type: 'error', ...options }),
  info: (message: string, options?: Partial<ToastItem>) =>
    muiToaster.create({ title: message, type: 'info', ...options }),
  warning: (message: string, options?: Partial<ToastItem>) =>
    muiToaster.create({ title: message, type: 'warning', ...options }),
  dismiss: (id?: number) => {
    if (typeof id === 'number') {
      internalToasts = internalToasts.filter((t) => t.id !== id)
    } else {
      internalToasts = []
    }
    subscribers.forEach((s) => s(internalToasts))
  },
}

export function MUIToaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const sub = (ts: ToastItem[]) => setToasts(ts)
    subscribers.add(sub)
    setToasts(internalToasts)
    return () => {
      subscribers.delete(sub)
    }
  }, [])

  return (
    <>
      {toasts.map((t) => (
        <Snackbar
          key={t.id}
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={t.duration ?? 6000}
          onClose={() => muiToaster.dismiss(t.id)}
        >
          <Alert
            onClose={() => muiToaster.dismiss(t.id)}
            severity={(t.type === 'loading' ? 'info' : t.type) as AlertColor}
            elevation={6}
            variant="filled"
          >
            {t.title && <strong>{t.title}</strong>}
            {t.description ? <div>{t.description}</div> : null}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

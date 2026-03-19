import Axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { logout, refresh } from '../auth/auth'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

let accessToken: string | null = null

export const setAccessToken = (token: string) => {
  accessToken = token
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('access_token', token)
  }
}

export const getAccessToken = (): string | null => {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem('access_token')
  }
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('access_token')
  }
}

// Auth and i18n handler
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const lang =
      typeof window !== 'undefined' ? document.documentElement.lang : 'es'
    if (config.headers) {
      config.headers['Accept-Language'] = lang
    }

    return config
  },
  (error) => Promise.reject(error),
)

let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (!originalRequest || (originalRequest as any)._retry) {
      return Promise.reject(error)
    }

    const isAuthRequest =
      originalRequest.url?.match(/\/auth\/(login|refresh|logout)/) ||
      originalRequest.url?.includes('/login')

    if (error.response?.status === 401 && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            return AXIOS_INSTANCE(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      ;(originalRequest as any)._retry = true
      isRefreshing = true

      try {
        const { access_token } = await refresh()
        setAccessToken(access_token)
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`
        }

        processQueue(null, access_token)
        return AXIOS_INSTANCE(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAccessToken()
        logout().catch(() =>
          console.warn('Backend logout failed, but the access token has been cleared locally.')
        )
        const authPages = ['/login', '/signup', '/recover-password']
        const onAuthPage = authPages.some((p) => window.location.pathname.startsWith(p))
        if (!onAuthPage) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Add a second `options` argument to pass extra options to each query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const data =
    config.data instanceof URLSearchParams
      ? config.data.toString()
      : config.data

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    withCredentials: true,
    data,
  }).then(({ data }) => data)

  return promise
}

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>

// Standard body type
export type BodyType<BodyData> = BodyData

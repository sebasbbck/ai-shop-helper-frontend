import Axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { getToken } from '../../src/utils/token'

export const AXIOS_INSTANCE = Axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api/proxy'
      : process.env.NEXT_PUBLIC_BACKEND_URL,
})

// Auth and i18n handler
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined' ? getToken() : null

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
    data,
  }).then(({ data }) => data)

  return promise
}

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>

// Standard body type
export type BodyType<BodyData> = BodyData

// Or wrap the body type if processing data before sending
// export type BodyType<BodyData> = CamelCase<BodyData>;

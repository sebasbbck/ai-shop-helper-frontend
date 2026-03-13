import Axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { logout, refresh } from '../auth/auth'

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
      typeof window !== 'undefined' ? localStorage.getItem('token') : null

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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || (originalRequest as any)._retry) {
      return Promise.reject(error)
    }

    // If it's not already a refresh/logout attempt
    const isAuthRequest = 
      originalRequest.url?.match(/\/auth\/(login|refresh|logout)/) || 
      originalRequest.url?.includes('/login')

    if (error.response?.status === 401 && !isAuthRequest) {
      if (isRefreshing) {
        // Queue this request until the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
               originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      (originalRequest as any)._retry = true
      isRefreshing = true

      try {
        const { access_token } = await refresh();
        localStorage.setItem('token', access_token);
        if (originalRequest.headers) {
           originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        }
        
        processQueue(null, access_token);
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If refresh fails, wipe everything locally
        localStorage.removeItem('token');
        logout().catch(() => console.warn("Backend logout failed, but the access token has been cleared locally."));
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

// Or wrap the body type if processing data before sending
// export type BodyType<BodyData> = CamelCase<BodyData>;

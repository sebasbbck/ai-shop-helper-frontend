import Axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAccessToken } from "./token-store";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await Axios.post<{ access_token: string }>(
      "/api/v1/auth/refresh",
      undefined,
      { withCredentials: true },
    );
    setAccessToken(data.access_token);
    return data.access_token;
  } catch {
    setAccessToken(null);
    return null;
  }
};

export const ensureAccessToken = async (): Promise<string | null> => {
  const existing = getAccessToken();
  if (existing) {
    return existing;
  }
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const isAuthRequest = original?.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthRequest
    ) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const token = await refreshPromise;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return AXIOS_INSTANCE(original);
      }
    }
    return Promise.reject(error);
  },
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await AXIOS_INSTANCE({ ...config, ...options });
  return data;
};

export default customInstance;

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

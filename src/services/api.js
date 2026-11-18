
import axios from 'axios'

let accessToken = null
let refreshPromise = null

const REFRESH_TOKEN_KEY = 'marketplace_refresh_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Set access token for API requests.
 */
export const setAccessToken = (token) => {
  accessToken = token
}

/**
 * Clear current access token.
 */
export const clearAccessToken = () => {
  accessToken = null
}

/**
 * Save refresh token to local storage.
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  }
}

/**
 * Retrieve refresh token from local storage.
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Clear all authentication tokens.
 */
export const clearAuthTokens = () => {
  accessToken = null
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Determine whether a request should skip automatic refresh.
 */
const isAuthEndpoint = (url = '') => {
  return [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
  ].some((endpoint) => url.includes(endpoint))
}

/**
 * Refresh the current authentication session.
 *
 * Uses plain Axios to avoid triggering the response interceptor again.
 * Multiple requests share one refresh operation.
 */
const refreshSession = async () => {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      throw new Error('Refresh token tidak ditemukan.')
    }

    const response = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {
        refresh_token: refreshToken,
      },
      {
        timeout: 15000,
        headers: {
          Accept: 'application/json',
        },
      }
    )

    const authData = response.data?.data

    if (!authData?.access_token || !authData?.refresh_token) {
      throw new Error('Response refresh token tidak valid.')
    }

    setAccessToken(authData.access_token)
    setRefreshToken(authData.refresh_token)

    return authData.access_token
  })()

  try {
    return await refreshPromise
  } catch (error) {
    const status = error.response?.status

    // 401/422 means the refresh credential is no longer valid.
    if (status === 401 || status === 422) {
      clearAuthTokens()

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new Event('auth:session-expired')
        )
      }
    }

    throw error
  } finally {
    refreshPromise = null
  }
}

/**
 * Attach access token to outgoing API requests.
 */
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Automatically refresh expired access tokens.
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const newAccessToken = await refreshSession()

      originalRequest.headers = originalRequest.headers || {}

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
)

export default api

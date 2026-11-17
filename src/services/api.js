
import axios from 'axios'

let accessToken = null

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
 * Attach access token to every request.
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
 * Handle common API response errors.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn('Unauthorized: Authentication required.')
    }

    if (status === 403) {
      console.warn('Forbidden: Access denied.')
    }

    if (status === 422) {
      console.warn('Validation error.')
    }

    if (!error.response) {
      console.error('Network error or backend unavailable.')
    }

    return Promise.reject(error)
  }
)

export default api

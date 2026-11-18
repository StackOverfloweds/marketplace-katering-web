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

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default api
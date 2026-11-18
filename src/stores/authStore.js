
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  setAccessToken,
  clearAccessToken,
} from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => {
    return Boolean(accessToken.value)
  })

  /**
   * Save authentication data after successful login or registration.
   */
  const setAuthentication = (token, userData) => {
    accessToken.value = token
    user.value = userData

    setAccessToken(token)
  }

  /**
   * Clear authentication data from the application.
   */
  const clearAuthentication = () => {
    accessToken.value = null
    user.value = null

    clearAccessToken()
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    setAuthentication,
    clearAuthentication,
  }
})

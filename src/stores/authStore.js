
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  setAccessToken,
  clearAccessToken,
} from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  /**
   * Determine whether user is authenticated.
   */
  const isAuthenticated = computed(() => {
    return Boolean(accessToken.value)
  })

  /**
   * Set authentication data after successful login.
   */
  const setAuthentication = (token, userData = null) => {
    accessToken.value = token
    user.value = userData

    setAccessToken(token)
  }

  /**
   * Clear authentication data.
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

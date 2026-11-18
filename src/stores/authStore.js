
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAuthTokens,
} from '@/services/api'

import AuthService from '@/modules/auth/components/AuthService'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  const isReady = ref(false)
  const isInitializing = ref(false)

  let initializationPromise = null
  let sessionExpiredListenerRegistered = false

  const isAuthenticated = computed(() => {
    return Boolean(accessToken.value && user.value)
  })

  /**
   * Save authentication data after successful login or registration.
   */
  const setAuthentication = (
    token,
    userData,
    refreshToken
  ) => {
    accessToken.value = token
    user.value = userData

    setAccessToken(token)

    if (refreshToken) {
      setRefreshToken(refreshToken)
    }
  }

  /**
   * Clear authentication data from the application.
   */
  const clearAuthentication = () => {
    accessToken.value = null
    user.value = null

    clearAuthTokens()
  }

  /**
   * Register listener for expired authentication sessions.
   */
  const registerSessionListener = () => {
    if (
      sessionExpiredListenerRegistered ||
      typeof window === 'undefined'
    ) {
      return
    }

    window.addEventListener(
      'auth:session-expired',
      clearAuthentication
    )

    sessionExpiredListenerRegistered = true
  }

  /**
   * Restore authentication after browser reload.
   */
  const initializeAuth = async () => {
    if (isReady.value) {
      return
    }

    if (initializationPromise) {
      return initializationPromise
    }

    initializationPromise = (async () => {
      isInitializing.value = true
      registerSessionListener()

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          clearAuthentication()
          return
        }

        const response = await AuthService.refresh(refreshToken)
        const authData = response.data

        if (
          !authData?.access_token ||
          !authData?.refresh_token ||
          !authData?.user
        ) {
          throw new Error('Response autentikasi tidak valid.')
        }

        setAuthentication(
          authData.access_token,
          authData.user,
          authData.refresh_token
        )
      } catch (error) {
        console.error('Gagal memulihkan session:', error)

        // Clear credentials only when the server rejects them.
        const status = error.response?.status

        if (
          status === 401 ||
          status === 422
        ) {
          clearAuthentication()
        } else {
          // Network/server errors: keep refresh token for retry.
          accessToken.value = null
          user.value = null
          clearAuthTokens()
        }
      } finally {
        isReady.value = true
        isInitializing.value = false
        initializationPromise = null
      }
    })()

    return initializationPromise
  }

  /**
   * Logout the current authentication session.
   */
  const logout = async () => {
    try {
      if (accessToken.value) {
        await AuthService.logout()
      }
    } finally {
      clearAuthentication()
    }
  }

  return {
    accessToken,
    user,
    isReady,
    isInitializing,
    isAuthenticated,
    setAuthentication,
    clearAuthentication,
    initializeAuth,
    logout,
  }
})

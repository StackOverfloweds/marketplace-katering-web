
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loggingOut = ref(false)

const profile = computed(() => authStore.user?.profile || {})

const merchantName = computed(() => {
  return profile.value.company_name ||
    profile.value.full_name ||
    authStore.user?.username ||
    'Merchant'
})

/**
 * Logout merchant from the application.
 *
 * @returns {Promise<void>}
 */
const handleLogout = async () => {
  if (loggingOut.value) return

  loggingOut.value = true

  try {
    await authStore.logout()
    router.replace({ name: 'login' })
  } catch (error) {
    console.error('Logout gagal:', error)
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header
    class="flex min-h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3 sm:px-8"
  >
    <div>
      <h2 class="text-sm font-semibold text-gray-900 sm:text-base">
        Merchant Workspace
      </h2>

      <p class="hidden text-xs text-gray-500 sm:block">
        Kelola usaha katering Anda
      </p>
    </div>

    <div class="flex items-center gap-3 sm:gap-4">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-gray-900">
          {{ merchantName }}
        </p>

        <p class="text-xs text-gray-500">
          Merchant
        </p>
      </div>

      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600"
      >
        {{ merchantName.charAt(0).toUpperCase() }}
      </div>

      <button
        type="button"
        @click="handleLogout"
        :disabled="loggingOut"
        class="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
      >
        {{ loggingOut ? 'Logout...' : 'Logout' }}
      </button>
    </div>
  </header>
</template>

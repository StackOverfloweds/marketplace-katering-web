
<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)
const loggingOut = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const user = computed(() => authStore.user)

const userRole = computed(() => user.value?.role)

const displayName = computed(() => {
  const profile = user.value?.profile

  if (userRole.value === 'merchant') {
    return profile?.company_name || profile?.full_name || user.value?.username
  }

  return profile?.full_name || user.value?.username || 'Pengguna'
})

const isCustomer = computed(() => userRole.value === 'customer')
const isMerchant = computed(() => userRole.value === 'merchant')

/**
 * Close mobile navigation menu.
 */
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

/**
 * Logout the current user.
 */
const handleLogout = async () => {
  if (loggingOut.value) return

  loggingOut.value = true
  closeMobileMenu()

  try {
    await authStore.logout()
    router.replace('/login')
  } catch (error) {
    console.error('Logout gagal:', error)
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
    <nav class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

      <!-- Logo -->
      <RouterLink
        :to="isMerchant ? '/merchant/dashboard' : '/home'"
        class="flex items-center gap-2"
        @click="closeMobileMenu"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
          🍱
        </div>

        <div>
          <span class="block text-lg font-extrabold tracking-tight text-gray-900">
            Marketplace
          </span>
          <span class="-mt-1 block text-xs font-semibold text-orange-600">
            Katering
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation -->
      <div class="hidden items-center gap-7 md:flex">

        <!-- Guest -->
        <template v-if="!isAuthenticated">
          <RouterLink
            to="/home"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Beranda
          </RouterLink>
        </template>

        <!-- Customer -->
        <template v-else-if="isCustomer">
          <RouterLink
            to="/home"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Beranda
          </RouterLink>

          <RouterLink
            to="/orders"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Pesanan Saya
          </RouterLink>

          <RouterLink
            to="/profile"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Profil
          </RouterLink>
        </template>

        <!-- Merchant -->
        <template v-else-if="isMerchant">
          <RouterLink
            to="/merchant/dashboard"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            to="/merchant/menus"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Menu Catering
          </RouterLink>

          <RouterLink
            to="/merchant/orders"
            class="text-sm font-medium text-gray-600 transition hover:text-orange-600"
          >
            Pesanan Masuk
          </RouterLink>
        </template>

      </div>

      <!-- Desktop Authentication -->
      <div class="hidden items-center gap-3 md:flex">

        <!-- Guest -->
        <template v-if="!isAuthenticated">
          <RouterLink
            to="/login"
            class="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/register"
            class="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Daftar
          </RouterLink>
        </template>

        <!-- Authenticated -->
        <template v-else>
          <div class="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
              {{ displayName.charAt(0).toUpperCase() }}
            </div>

            <div class="max-w-40">
              <p class="truncate text-sm font-semibold text-gray-900">
                {{ displayName }}
              </p>

              <p class="text-xs capitalize text-gray-500">
                {{ userRole }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="handleLogout"
            :disabled="loggingOut"
            class="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <span>↪</span>
            {{ loggingOut ? 'Logout...' : 'Logout' }}
          </button>
        </template>

      </div>

      <!-- Mobile Menu Button -->
      <button
        type="button"
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation"
      >
        <svg
          v-if="!mobileMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

    </nav>

    <!-- Mobile Navigation -->
    <div
      v-if="mobileMenuOpen"
      class="border-t border-gray-100 bg-white px-4 py-4 md:hidden"
    >
      <div class="flex flex-col gap-1">

        <template v-if="!isAuthenticated">
          <RouterLink
            to="/home"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Beranda
          </RouterLink>

          <RouterLink
            to="/login"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/register"
            @click="closeMobileMenu"
            class="rounded-lg bg-orange-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-orange-700"
          >
            Daftar
          </RouterLink>
        </template>

        <template v-else-if="isCustomer">
          <div class="mb-3 border-b border-gray-100 px-3 pb-3">
            <p class="font-semibold text-gray-900">{{ displayName }}</p>
            <p class="text-xs capitalize text-gray-500">{{ userRole }}</p>
          </div>

          <RouterLink
            to="/home"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Beranda
          </RouterLink>

          <RouterLink
            to="/orders"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Pesanan Saya
          </RouterLink>

          <RouterLink
            to="/profile"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profil
          </RouterLink>

          <button
            type="button"
            @click="handleLogout"
            :disabled="loggingOut"
            class="mt-2 rounded-lg bg-red-50 px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {{ loggingOut ? 'Logout...' : 'Logout' }}
          </button>
        </template>

        <template v-else-if="isMerchant">
          <div class="mb-3 border-b border-gray-100 px-3 pb-3">
            <p class="font-semibold text-gray-900">{{ displayName }}</p>
            <p class="text-xs capitalize text-gray-500">{{ userRole }}</p>
          </div>

          <RouterLink
            to="/merchant/dashboard"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            to="/merchant/menus"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Menu Catering
          </RouterLink>

          <RouterLink
            to="/merchant/orders"
            @click="closeMobileMenu"
            class="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            Pesanan Masuk
          </RouterLink>

          <button
            type="button"
            @click="handleLogout"
            :disabled="loggingOut"
            class="mt-2 rounded-lg bg-red-50 px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {{ loggingOut ? 'Logout...' : 'Logout' }}
          </button>
        </template>

      </div>
    </div>
  </header>
</template>

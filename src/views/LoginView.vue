
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthService from '@/modules/auth/components/AuthService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  username: '',
  password: '',
})

/**
 * Redirect user according to their account role.
 */
const redirectByRole = (user) => {
  if (user.role === 'merchant') {
    router.replace('/merchant/dashboard')
    return
  }

  router.replace('/home')
}

/**
 * Submit login form.
 */
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await AuthService.login({
      username: form.value.username,
      password: form.value.password,
      device_name: 'Web Browser',
    })

    const authData = response.data
    const user = authData.user

    authStore.setAuthentication(
      authData.access_token,
      user
    )

    // Gunakan redirect hanya jika tujuan sesuai dengan role.
    const redirectPath = route.query.redirect

    if (typeof redirectPath === 'string') {
      const matchedRoute = router.resolve(redirectPath)
      const allowedRoles = matchedRoute.meta?.roles

      if (
        matchedRoute.matched.length > 0 &&
        (!allowedRoles || allowedRoles.includes(user.role))
      ) {
        router.replace(redirectPath)
        return
      }
    }

    redirectByRole(user)
  } catch (error) {
    console.error('Login error:', error)

    errorMessage.value =
      error.response?.data?.errors?.credentials?.[0] ||
      error.response?.data?.message ||
      'Username atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="mb-8 text-center">
        <RouterLink
          to="/home"
          class="text-xl font-extrabold tracking-tight text-orange-600"
        >
          Marketplace Katering
        </RouterLink>

        <h1 class="mt-6 text-3xl font-bold text-gray-900">
          Selamat Datang Kembali
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Login untuk melanjutkan aktivitas Anda.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

        <div
          v-if="errorMessage"
          class="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              v-model.trim="form.username"
              type="text"
              required
              autocomplete="username"
              placeholder="Masukkan username"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="Masukkan password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? 'Sedang Login...' : 'Login' }}
          </button>

        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Belum memiliki akun?

          <RouterLink
            to="/register"
            class="font-semibold text-orange-600 hover:text-orange-700"
          >
            Daftar sekarang
          </RouterLink>
        </div>

      </div>
    </div>
  </main>
</template>

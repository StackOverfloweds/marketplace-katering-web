
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthService from '@/modules/auth/components/AuthService'

const router = useRouter()
const authStore = useAuthStore()

const role = ref('customer')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({})

const form = ref({
  username: '',
  full_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',

  company_name: '',
  contact_person: '',
  address: '',
  city: '',
})

const isMerchant = computed(() => role.value === 'merchant')

/**
 * Change account type and clear previous validation errors.
 */
const selectRole = (selectedRole) => {
  role.value = selectedRole
  errors.value = {}
  errorMessage.value = ''
}

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
 * Submit registration form.
 */
const handleRegister = async () => {
  loading.value = true
  errors.value = {}
  errorMessage.value = ''

  try {
    const payload = {
      username: form.value.username,
      full_name: form.value.full_name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      role: role.value,
      device_name: 'Web Browser',
    }

    if (isMerchant.value) {
      payload.company_name = form.value.company_name
      payload.contact_person = form.value.contact_person
      payload.address = form.value.address
      payload.city = form.value.city
    }

    const response = await AuthService.register(payload)

    const authData = response.data
    const user = authData.user

    authStore.setAuthentication(
    authData.access_token,
    user,
    authData.refresh_token
  )

    redirectByRole(user)
  } catch (error) {
    console.error('Registration error:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
      errorMessage.value =
        error.response.data.message ||
        'Periksa kembali data registrasi Anda.'
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        'Registrasi gagal. Silakan coba kembali.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
    <div class="w-full max-w-2xl">

      <!-- Header -->
      <div class="mb-8 text-center">
        <RouterLink
          to="/home"
          class="text-xl font-extrabold tracking-tight text-orange-600"
        >
          Marketplace Katering
        </RouterLink>

        <h1 class="mt-6 text-3xl font-bold text-gray-900">
          Buat Akun Baru
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Bergabung dan temukan kemudahan layanan catering.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

        <!-- Role Selection -->
        <div class="mb-7">
          <label class="mb-3 block text-sm font-semibold text-gray-800">
            Saya ingin bergabung sebagai:
          </label>

          <div class="grid grid-cols-2 gap-3">

            <button
              type="button"
              @click="selectRole('customer')"
              :class="[
                'rounded-xl border-2 p-4 text-left transition',
                role === 'customer'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-200',
              ]"
            >
              <div class="mb-2 text-2xl">👤</div>

              <p class="font-bold text-gray-900">
                Customer
              </p>

              <p class="mt-1 text-xs text-gray-500">
                Saya ingin memesan catering.
              </p>
            </button>

            <button
              type="button"
              @click="selectRole('merchant')"
              :class="[
                'rounded-xl border-2 p-4 text-left transition',
                role === 'merchant'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-200',
              ]"
            >
              <div class="mb-2 text-2xl">🏪</div>

              <p class="font-bold text-gray-900">
                Merchant
              </p>

              <p class="mt-1 text-xs text-gray-500">
                Saya memiliki usaha catering.
              </p>
            </button>

          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">

          <!-- Personal Information -->
          <div>
            <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
              Informasi Pribadi
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Username
                </label>

                <input
                  v-model.trim="form.username"
                  type="text"
                  required
                  minlength="4"
                  maxlength="50"
                  autocomplete="username"
                  placeholder="Masukkan username"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.username" class="mt-1 text-xs text-red-500">
                  {{ errors.username[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>

                <input
                  v-model.trim="form.full_name"
                  type="text"
                  required
                  maxlength="150"
                  autocomplete="name"
                  placeholder="Nama lengkap"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.full_name" class="mt-1 text-xs text-red-500">
                  {{ errors.full_name[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  v-model.trim="form.email"
                  type="email"
                  required
                  maxlength="255"
                  autocomplete="email"
                  placeholder="nama@email.com"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                  {{ errors.email[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>

                <input
                  v-model.trim="form.phone"
                  type="tel"
                  required
                  maxlength="20"
                  autocomplete="tel"
                  placeholder="08xxxxxxxxxx"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
                  {{ errors.phone[0] }}
                </p>
              </div>

            </div>
          </div>

          <!-- Merchant Information -->
          <div v-if="isMerchant" class="border-t border-gray-100 pt-5">

            <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
              Informasi Usaha Catering
            </h2>

            <div class="space-y-4">

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama Usaha
                </label>

                <input
                  v-model.trim="form.company_name"
                  type="text"
                  required
                  maxlength="150"
                  placeholder="Contoh: Catering Sejahtera"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.company_name" class="mt-1 text-xs text-red-500">
                  {{ errors.company_name[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Contact Person
                </label>

                <input
                  v-model.trim="form.contact_person"
                  type="text"
                  required
                  maxlength="150"
                  placeholder="Nama penanggung jawab usaha"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.contact_person" class="mt-1 text-xs text-red-500">
                  {{ errors.contact_person[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Alamat Usaha
                </label>

                <textarea
                  v-model.trim="form.address"
                  required
                  rows="3"
                  placeholder="Masukkan alamat lengkap usaha"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                ></textarea>

                <p v-if="errors.address" class="mt-1 text-xs text-red-500">
                  {{ errors.address[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Kota
                </label>

                <input
                  v-model.trim="form.city"
                  type="text"
                  required
                  maxlength="100"
                  placeholder="Contoh: Samarinda"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.city" class="mt-1 text-xs text-red-500">
                  {{ errors.city[0] }}
                </p>
              </div>

            </div>
          </div>

          <!-- Password -->
          <div class="border-t border-gray-100 pt-5">

            <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
              Keamanan Akun
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  v-model="form.password"
                  type="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  placeholder="Minimal 8 karakter"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p v-if="errors.password" class="mt-1 text-xs text-red-500">
                  {{ errors.password[0] }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>

                <input
                  v-model="form.password_confirmation"
                  type="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  placeholder="Ulangi password"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? 'Memproses Registrasi...' : 'Buat Akun' }}
          </button>

        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Sudah memiliki akun?

          <RouterLink
            to="/login"
            class="font-semibold text-orange-600 hover:text-orange-700"
          >
            Login sekarang
          </RouterLink>
        </div>

      </div>
    </div>
  </main>
</template>

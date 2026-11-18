
<script setup>
import { onMounted, reactive, ref } from 'vue'
import MerchantProfileService from '@/modules/merchant/services/MerchantProfileService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const isEditing = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const profile = reactive({
  full_name: '',
  email: '',
  phone: '',
  company_name: '',
  contact_person: '',
  address: '',
  city: '',
  description: '',
})

const originalProfile = ref(null)

/**
 * Copy profile data into the form.
 *
 * @param {Object} data
 */
const setProfileData = (data) => {
  profile.full_name = data.full_name || ''
  profile.email = data.email || ''
  profile.phone = data.phone || ''
  profile.company_name = data.company_name || ''
  profile.contact_person = data.contact_person || ''
  profile.address = data.address || ''
  profile.city = data.city || ''
  profile.description = data.description || ''

  originalProfile.value = { ...profile }
}

/**
 * Fetch merchant profile from backend.
 */
const fetchProfile = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantProfileService.getProfile()

    if (!response?.success) {
      throw new Error(
        response?.message || 'Gagal mengambil profil usaha.',
      )
    }

    setProfileData(response.data)
  } catch (error) {
    console.error('Fetch profile error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat mengambil profil.'
  } finally {
    loading.value = false
  }
}

/**
 * Enable profile editing.
 */
const startEditing = () => {
  successMessage.value = ''
  errorMessage.value = ''
  isEditing.value = true
}

/**
 * Cancel profile editing and restore original values.
 */
const cancelEditing = () => {
  if (originalProfile.value) {
    Object.assign(profile, originalProfile.value)
  }

  errorMessage.value = ''
  successMessage.value = ''
  isEditing.value = false
}

/**
 * Validate merchant profile form.
 *
 * @returns {boolean}
 */
const validateForm = () => {
  if (!profile.company_name.trim()) {
    errorMessage.value = 'Nama usaha wajib diisi.'
    return false
  }

  if (!profile.full_name.trim()) {
    errorMessage.value = 'Nama pemilik atau penanggung jawab wajib diisi.'
    return false
  }

  if (!profile.email.trim()) {
    errorMessage.value = 'Email wajib diisi.'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errorMessage.value = 'Format email tidak valid.'
    return false
  }

  if (!profile.phone.trim()) {
    errorMessage.value = 'Nomor telepon wajib diisi.'
    return false
  }

  return true
}

/**
 * Save updated merchant profile.
 */
const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm() || saving.value) return

  saving.value = true

  try {
    const payload = {
      full_name: profile.full_name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      company_name: profile.company_name.trim(),
      contact_person: profile.contact_person.trim() || null,
      address: profile.address.trim() || null,
      city: profile.city.trim() || null,
      description: profile.description.trim() || null,
    }

    const response = await MerchantProfileService.updateProfile(payload)

    if (!response?.success) {
      throw new Error(
        response?.message || 'Gagal memperbarui profil usaha.',
      )
    }

    setProfileData(response.data)

    // Update profile in the current authentication state.
    if (authStore.user) {
      authStore.user = {
        ...authStore.user,
        profile: response.data,
      }
    }

    isEditing.value = false
    successMessage.value = 'Profil usaha berhasil diperbarui.'
  } catch (error) {
    console.error('Update profile error:', error)

    const responseData = error.response?.data

    if (responseData?.errors) {
      const firstError = Object.values(responseData.errors)[0]

      errorMessage.value = Array.isArray(firstError)
        ? firstError[0]
        : 'Periksa kembali data yang dimasukkan.'
    } else {
      errorMessage.value =
        responseData?.message ||
        error.message ||
        'Terjadi kesalahan saat menyimpan profil.'
    }
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">

    <!-- Page Header -->
    <section>
      <h1 class="text-2xl font-bold text-gray-900">
        Profil Usaha
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        Kelola informasi usaha katering Anda.
      </p>
    </section>

    <!-- Loading -->
    <div
      v-if="loading"
      class="rounded-2xl border border-gray-200 bg-white p-10 text-center"
    >
      <p class="text-sm text-gray-500">
        Memuat informasi profil...
      </p>
    </div>

    <template v-else>

      <!-- Notification -->
      <div
        v-if="successMessage"
        class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        role="status"
      >
        {{ successMessage }}
      </div>

      <div
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <!-- Profile Card -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <!-- Card Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6">
          <div>
            <h2 class="font-semibold text-gray-900">
              Informasi Usaha
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Informasi identitas dan kontak usaha katering.
            </p>
          </div>

          <div v-if="!isEditing">
            <button
              type="button"
              @click="startEditing"
              class="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Edit Profil
            </button>
          </div>

          <div v-else class="flex gap-2">
            <button
              type="button"
              @click="cancelEditing"
              :disabled="saving"
              class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              @click="saveProfile"
              :disabled="saving"
              class="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>

        <!-- Form -->
        <form
          class="space-y-6 p-6"
          @submit.prevent="saveProfile"
        >
          <!-- Business Name -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Nama Usaha
              <span class="text-red-500">*</span>
            </label>

            <input
              v-model="profile.company_name"
              type="text"
              maxlength="150"
              :readonly="!isEditing"
              placeholder="Masukkan nama usaha"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              :class="isEditing
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                : 'border-gray-100 bg-gray-50 text-gray-600'"
            />
          </div>

          <!-- Owner and Contact -->
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700">
                Nama Pemilik
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="profile.full_name"
                type="text"
                maxlength="150"
                :readonly="!isEditing"
                placeholder="Nama pemilik usaha"
                class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                :class="isEditing
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  : 'border-gray-100 bg-gray-50 text-gray-600'"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700">
                Penanggung Jawab
              </label>

              <input
                v-model="profile.contact_person"
                type="text"
                maxlength="150"
                :readonly="!isEditing"
                placeholder="Nama penanggung jawab"
                class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                :class="isEditing
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  : 'border-gray-100 bg-gray-50 text-gray-600'"
              />
            </div>
          </div>

          <!-- Email and Phone -->
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700">
                Email
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="profile.email"
                type="email"
                maxlength="255"
                :readonly="!isEditing"
                placeholder="email@example.com"
                class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                :class="isEditing
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  : 'border-gray-100 bg-gray-50 text-gray-600'"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700">
                Nomor Telepon
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="profile.phone"
                type="tel"
                maxlength="20"
                :readonly="!isEditing"
                placeholder="08xxxxxxxxxx"
                class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                :class="isEditing
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  : 'border-gray-100 bg-gray-50 text-gray-600'"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Alamat Usaha
            </label>

            <textarea
              v-model="profile.address"
              rows="3"
              :readonly="!isEditing"
              placeholder="Masukkan alamat lengkap usaha"
              class="w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition"
              :class="isEditing
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                : 'border-gray-100 bg-gray-50 text-gray-600'"
            ></textarea>
          </div>

          <!-- City -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Kota
            </label>

            <input
              v-model="profile.city"
              type="text"
              maxlength="100"
              :readonly="!isEditing"
              placeholder="Contoh: Balikpapan"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
              :class="isEditing
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                : 'border-gray-100 bg-gray-50 text-gray-600'"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Deskripsi Usaha
            </label>

            <textarea
              v-model="profile.description"
              rows="4"
              maxlength="1000"
              :readonly="!isEditing"
              placeholder="Ceritakan mengenai usaha katering Anda..."
              class="w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition"
              :class="isEditing
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                : 'border-gray-100 bg-gray-50 text-gray-600'"
            ></textarea>

            <p
              v-if="isEditing"
              class="mt-1 text-right text-xs text-gray-400"
            >
              {{ profile.description.length }}/1000 karakter
            </p>
          </div>

          <!-- Bottom Actions -->
          <div
            v-if="isEditing"
            class="flex justify-end gap-3 border-t border-gray-100 pt-6"
          >
            <button
              type="button"
              @click="cancelEditing"
              :disabled="saving"
              class="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </section>
    </template>
  </div>
</template>

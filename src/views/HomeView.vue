
<script setup>
import { ref, onMounted } from 'vue'
import HeroSearch from '@/components/dashboard/HeroSearch.vue'
import MerchantCard from '@/components/dashboard/MerchantCard.vue'
import MerchantService from '@/modules/merchant/services/MerchantService'

// Merchant
const merchants = ref([])
const loading = ref(false)
const errorMessage = ref('')

// Search
const searchKeyword = ref('')
const searchLocation = ref('')
const isSearchMode = ref(false)

// Pagination
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(12)
const totalMerchants = ref(0)

/**
 * Menyimpan data merchant dan informasi pagination.
 * Mendukung response pagination Laravel maupun response search custom.
 */
const setMerchantData = (response) => {
  const payload = response.data || {}

  merchants.value = Array.isArray(payload)
    ? payload
    : payload.data || []

  const pagination = response.meta || payload.meta || payload

  currentPage.value = pagination.current_page || 1
  lastPage.value = pagination.last_page || 1
  totalMerchants.value = pagination.total || 0
}

/**
 * Mengambil seluruh merchant tanpa filter pencarian.
 */
const fetchMerchants = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantService.getAll({
      per_page: perPage.value,
      page,
    })

    setMerchantData(response)
  } catch (error) {
    console.error('Gagal mengambil data merchant:', error)

    merchants.value = []
    errorMessage.value =
      error.response?.data?.message ||
      'Gagal mengambil daftar catering.'
  } finally {
    loading.value = false
  }
}

/**
 * Mengambil merchant berdasarkan pencarian.
 * Hanya dijalankan ketika pengguna melakukan search.
 */
const searchMerchants = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantService.search({
      search: searchKeyword.value,
      location: searchLocation.value,
      per_page: perPage.value,
      page,
    })

    setMerchantData(response)
  } catch (error) {
    console.error('Gagal melakukan pencarian merchant:', error)

    merchants.value = []
    errorMessage.value =
      error.response?.data?.message ||
      'Gagal mencari catering.'
  } finally {
    loading.value = false
  }
}

/**
 * Event ketika tombol Cari Katering ditekan.
 */
const handleSearch = (payload = {}) => {
  searchKeyword.value = (payload.search || '').trim()
  searchLocation.value = (payload.location || '').trim()

  // Jika kedua input kosong, tampilkan semua merchant.
  if (!searchKeyword.value && !searchLocation.value) {
    resetSearch()
    return
  }

  isSearchMode.value = true
  searchMerchants(1)
}

/**
 * Reset pencarian dan kembali menampilkan seluruh merchant.
 */
const resetSearch = () => {
  searchKeyword.value = ''
  searchLocation.value = ''
  isSearchMode.value = false

  fetchMerchants(1)
}

/**
 * Menangani perpindahan halaman sesuai mode.
 */
const changePage = (page) => {
  if (page < 1 || page > lastPage.value || loading.value) {
    return
  }

  if (isSearchMode.value) {
    searchMerchants(page)
  } else {
    fetchMerchants(page)
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

/**
 * Mengambil semua merchant ketika halaman pertama kali dibuka.
 */
onMounted(() => {
  fetchMerchants(1)
})
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <section class="bg-white">
      <HeroSearch
        @search="handleSearch"
        @reset="resetSearch"
      />
    </section>

    <!-- Merchant Listing -->
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
            Jelajahi Catering
          </p>

          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            {{ isSearchMode ? 'Hasil Pencarian Catering' : 'Pilihan Catering Terbaik' }}
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            {{
              isSearchMode
                ? 'Berikut catering yang sesuai dengan pencarian Anda.'
                : 'Temukan catering sesuai kebutuhan dan lokasi Anda.'
            }}
          </p>
        </div>

        <button
          v-if="isSearchMode"
          type="button"
          @click="resetSearch"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-orange-500 hover:text-orange-600"
        >
          Tampilkan Semua
        </button>
      </div>

      <!-- Informasi Filter -->
      <div
        v-if="isSearchMode"
        class="mb-6 rounded-xl border border-orange-100 bg-orange-50 p-4"
      >
        <p class="text-sm text-gray-700">
          Hasil pencarian

          <span v-if="searchKeyword" class="font-semibold">
            "{{ searchKeyword }}"
          </span>

          <span v-if="searchLocation">
            di <strong>{{ searchLocation }}</strong>
          </span>
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="item in 6"
          :key="item"
          class="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div class="h-48 bg-gray-200"></div>

          <div class="space-y-3 p-5">
            <div class="h-5 w-2/3 rounded bg-gray-200"></div>
            <div class="h-4 w-full rounded bg-gray-200"></div>
            <div class="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p class="font-medium text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="button"
          @click="isSearchMode ? searchMerchants(currentPage) : fetchMerchants(currentPage)"
          class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>

      <template v-else>
        <!-- Merchant Cards -->
        <div
          v-if="merchants.length > 0"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <MerchantCard
            v-for="merchant in merchants"
            :key="merchant.id"
            :merchant="merchant"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center"
        >
          <div class="mb-4 text-5xl">🔍</div>

          <h3 class="text-lg font-semibold text-gray-900">
            {{ isSearchMode ? 'Catering Tidak Ditemukan' : 'Belum Ada Catering' }}
          </h3>

          <p class="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {{
              isSearchMode
                ? 'Tidak ada catering yang sesuai dengan kata kunci atau lokasi tersebut.'
                : 'Saat ini belum ada catering yang tersedia.'
            }}
          </p>

          <button
            v-if="isSearchMode"
            type="button"
            @click="resetSearch"
            class="mt-6 rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Tampilkan Semua Catering
          </button>
        </div>

        <!-- Pagination -->
        <div
          v-if="merchants.length > 0 && lastPage > 1"
          class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row"
        >
          <p class="text-sm text-gray-500">
            Halaman {{ currentPage }} dari {{ lastPage }}
            ({{ totalMerchants }} merchant)
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="currentPage === 1 || loading"
              @click="changePage(currentPage - 1)"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <span class="px-3 text-sm font-semibold text-gray-900">
              {{ currentPage }}
            </span>

            <button
              type="button"
              :disabled="currentPage === lastPage || loading"
              @click="changePage(currentPage + 1)"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>

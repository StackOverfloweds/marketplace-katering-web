
<script setup>
import { ref, onMounted } from 'vue'

import MerchantService from '@/modules/merchants/services/MerchantService'

import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import HeroSearch from '@/components/dashboard/HeroSearch.vue'
import MerchantCard from '@/components/dashboard/MerchantCard.vue'

const merchants = ref([])

const loading = ref(false)
const errorMessage = ref('')

const search = ref('')
const location = ref('')

const currentPage = ref(1)
const lastPage = ref(1)
const totalMerchants = ref(0)

let requestId = 0



/**
 * Normalize API response into a consistent format.
 */
const normalizeResponse = (response) => {
  // Full Laravel JSON response:
  // response.data.data = merchant array
  const paginator = response?.data

  if (
    paginator &&
    !Array.isArray(paginator) &&
    Array.isArray(paginator.data)
  ) {
    return {
      merchants: paginator.data,
      currentPage: paginator.current_page || 1,
      lastPage: paginator.last_page || 1,
      total: paginator.total ?? paginator.data.length,
    }
  }

  // Custom JSON response:
  // response.data = merchant array
  if (Array.isArray(paginator)) {
    const meta = response.meta || {}

    return {
      merchants: paginator,
      currentPage: meta.current_page || 1,
      lastPage: meta.last_page || 1,
      total: meta.total ?? paginator.length,
    }
  }

  // In case the service returns paginator directly.
  if (Array.isArray(response?.data?.data)) {
    const data = response.data

    return {
      merchants: data.data,
      currentPage: data.current_page || 1,
      lastPage: data.last_page || 1,
      total: data.total ?? data.data.length,
    }
  }

  return {
    merchants: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
  }
}

/**
 * Fetch merchant listings from Laravel API.
 */
const fetchMerchants = async (page = 1) => {
  const currentRequestId = ++requestId

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantService.getAll({
      search: search.value,
      location: location.value,
      page,
      perPage: 12,
    })

    if (currentRequestId !== requestId) return

    console.log('FULL MERCHANT RESPONSE:', response)

    const result = normalizeResponse(response)

    merchants.value = result.merchants
    currentPage.value = result.currentPage
    lastPage.value = result.lastPage
    totalMerchants.value = result.total

    console.log('MERCHANT ARRAY:', merchants.value)
    console.log('MERCHANT ARRAY LENGTH:', merchants.value.length)

  } catch (error) {
    if (currentRequestId !== requestId) return

    console.error('Merchant API Error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      'Gagal mengambil data merchant. Silakan coba kembali.'

    merchants.value = []
    totalMerchants.value = 0

  } finally {
    if (currentRequestId === requestId) {
      loading.value = false
    }
  }
}

/**
 * Handle merchant search.
 */
const handleSearch = (payload = {}) => {
  search.value = payload.search || ''
  location.value = payload.location || ''

  fetchMerchants(1)
}

/**
 * Handle pagination.
 */
const changePage = (page) => {
  if (loading.value || page < 1 || page > lastPage.value) {
    return
  }

  fetchMerchants(page)
}

onMounted(() => {
  fetchMerchants()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main>
      <HeroSearch @search="handleSearch" />

      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">
            Temukan Catering Terbaik
          </h2>

          <p class="mt-2 text-gray-500">
            {{ totalMerchants }} merchant tersedia
          </p>
        </div>

        <div
          v-if="loading && merchants.length === 0"
          class="py-16 text-center text-gray-500"
        >
          Memuat data merchant...
        </div>

        <div
          v-else-if="errorMessage"
          class="rounded-xl bg-red-50 p-5 text-center text-red-700"
        >
          {{ errorMessage }}

          <button
            class="ml-2 font-semibold underline"
            @click="fetchMerchants(currentPage)"
          >
            Coba lagi
          </button>
        </div>

        <div
          v-else-if="merchants.length === 0"
          class="rounded-xl bg-white py-16 text-center"
        >
          <div class="mb-3 text-5xl">🔍</div>

          <h3 class="font-semibold text-gray-900">
            Merchant tidak ditemukan
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            Coba gunakan kata kunci pencarian lainnya.
          </p>
        </div>

        <template v-else>
          <div
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <MerchantCard
              v-for="merchant in merchants"
              :key="merchant.id"
              :merchant="merchant"
            />
          </div>

          <div
            v-if="lastPage > 1"
            class="mt-10 flex items-center justify-center gap-4"
          >
            <button
              :disabled="currentPage <= 1 || loading"
              class="rounded-lg border px-4 py-2 disabled:opacity-40"
              @click="changePage(currentPage - 1)"
            >
              Sebelumnya
            </button>

            <span class="text-sm text-gray-600">
              {{ currentPage }} / {{ lastPage }}
            </span>

            <button
              :disabled="currentPage >= lastPage || loading"
              class="rounded-lg border px-4 py-2 disabled:opacity-40"
              @click="changePage(currentPage + 1)"
            >
              Berikutnya
            </button>
          </div>
        </template>

      </section>
    </main>

    <Footer />
  </div>
</template>

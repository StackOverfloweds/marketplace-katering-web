
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MerchantService from '@/modules/merchants/services/MerchantService'
import { useAuthStore } from '@/stores/authStore'
import FormatHelper from '@/helpers/FormatHelper'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const merchant = ref(null)
const loading = ref(true)

/**
 * Load merchant detail.
 */
const fetchMerchant = async () => {
  loading.value = true

  try {
    merchant.value = await MerchantService.getBySlug(route.params.slug)
  } finally {
    loading.value = false
  }
}

/**
 * Handle ordering action.
 */
const handleOrder = () => {
  if (!authStore.isAuthenticated) {
    router.push({
      name: 'login',
      query: {
        redirect: route.fullPath,
      },
    })

    return
  }

  // Checkout module will be implemented later.
  router.push({
    name: 'merchant-detail',
    params: {
      slug: merchant.value.slug,
    },
    query: {
      action: 'order',
    },
  })
}

onMounted(fetchMerchant)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-100 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="font-extrabold text-slate-900">
          Katering<span class="text-orange-500">Ku</span>
        </RouterLink>

        <RouterLink to="/" class="text-sm font-semibold text-slate-600 hover:text-orange-500">
          ← Kembali ke Beranda
        </RouterLink>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse rounded-2xl bg-white p-10">
        <div class="h-40 rounded-xl bg-slate-100"></div>
        <div class="mt-5 h-6 w-1/2 rounded bg-slate-100"></div>
      </div>

      <div v-else-if="!merchant" class="rounded-2xl bg-white p-10 text-center">
        <p class="font-bold text-slate-800">Merchant tidak ditemukan.</p>
        <RouterLink to="/" class="mt-4 inline-block text-sm font-bold text-orange-500">
          Kembali ke beranda
        </RouterLink>
      </div>

      <div v-else class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div
          class="flex h-64 items-center justify-center bg-gradient-to-br text-9xl"
          :class="merchant.color"
        >
          {{ merchant.image }}
        </div>

        <div class="p-6 sm:p-10">
          <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p class="text-sm font-semibold text-orange-500">
                {{ merchant.city }}
              </p>

              <h1 class="mt-2 text-3xl font-extrabold text-slate-900">
                {{ merchant.name }}
              </h1>

              <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                {{ merchant.description }}
              </p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="category in merchant.categories"
                  :key="category"
                  class="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                >
                  {{ category }}
                </span>
              </div>
            </div>

            <div class="shrink-0">
              <p class="text-xs text-slate-400">Harga mulai</p>
              <p class="text-xl font-extrabold text-slate-900">
                {{ FormatHelper.currency(merchant.minimumPrice) }}
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-100 pt-6">
            <h2 class="text-lg font-bold text-slate-900">
              Menu dan pemesanan
            </h2>

            <p class="mt-2 text-sm text-slate-500">
              Detail menu merchant akan ditampilkan di bagian ini setelah
              integrasi API menu selesai.
            </p>

            <button
              @click="handleOrder"
              class="mt-5 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

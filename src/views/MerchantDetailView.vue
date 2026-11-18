
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

import MerchantService from '@/modules/merchant/services/MerchantService'
import MenuImage from '@/components/common/MenuImage.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import FormatHelper from '@/helpers/FormatHelper'

import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const cartStore = useCartStore()

const merchant = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const showLoginAlert = ref(false)

/**
 * Fetch merchant detail from Laravel API.
 */
const fetchMerchant = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantService.getById(
      route.params.merchantId,
    )

    merchant.value = response.data
  } catch (error) {
    console.error('Merchant Detail Error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      'Merchant tidak ditemukan.'

    merchant.value = null
  } finally {
    loading.value = false
  }
}

/**
 * Handle adding menu to order.
 *
 * @param {Object} menu
 */
const handleAddToOrder = (menu) => {
  if (!authStore.accessToken) {
    showLoginAlert.value = true
    return
  }

  const result = cartStore.addItem(menu, merchant.value)

  if (!result.success) {
    alert(result.message)
    return
  }

  alert(result.message)
}

/**
 * Redirect user to login page.
 */
const redirectToLogin = () => {
  showLoginAlert.value = false

  router.push({
    name: 'login',
    query: {
      redirect: route.fullPath,
    },
  })
}

/**
 * Close login notification.
 */
const closeLoginAlert = () => {
  showLoginAlert.value = false
}

watch(
  () => route.params.merchantId,
  () => fetchMerchant(),
)

onMounted(fetchMerchant)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      <!-- Loading -->
      <div
        v-if="loading"
        class="py-20 text-center text-gray-500"
      >
        Memuat informasi catering...
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMessage"
        class="rounded-2xl bg-white p-10 text-center"
      >
        <h2 class="text-lg font-bold text-gray-900">
          Merchant tidak ditemukan.
        </h2>

        <p class="mt-2 text-sm text-gray-500">
          {{ errorMessage }}
        </p>

        <RouterLink
          to="/"
          class="mt-5 inline-block font-semibold text-orange-600"
        >
          Kembali ke Beranda
        </RouterLink>
      </div>

      <template v-else-if="merchant">

        <!-- Merchant Header -->
        <section class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div
              class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-50"
            >
              <img
                v-if="merchant.logo"
                :src="merchant.logo"
                :alt="merchant.company_name || merchant.full_name"
                class="h-full w-full object-cover"
              />

              <span v-else class="text-5xl">
                🏪
              </span>
            </div>

            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ merchant.company_name || merchant.full_name }}
              </h1>

              <p class="mt-2 text-sm text-gray-500">
                📍 {{ merchant.city || 'Lokasi belum tersedia' }}
              </p>

              <p class="mt-3 text-sm text-gray-600">
                {{ merchant.description }}
              </p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="category in merchant.categories || []"
                  :key="category.id"
                  class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>

          </div>
        </section>

        <!-- Menu Section -->
        <section class="mt-10">

          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              Menu Catering
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              Pilihan menu dari
              {{ merchant.company_name || merchant.full_name }}
            </p>
          </div>

          <!-- Menu List -->
          <div
            v-if="merchant.menus?.length"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <article
              v-for="menu in merchant.menus"
              :key="menu.id"
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <!-- Menu Image -->
              <div class="p-3">
                <MenuImage
                  :src="menu.photo_url"
                  :alt="menu.name"
                />
              </div>

              <!-- Menu Information -->
              <div class="px-4 pb-4">

                <h3 class="font-semibold text-gray-900">
                  {{ menu.name }}
                </h3>

                <p class="mt-2 line-clamp-2 text-sm text-gray-500">
                  {{ menu.description || 'Menu pilihan dari katering kami.' }}
                </p>

                <!-- Price and Availability -->
                <div class="mt-4 flex items-center justify-between">
                  <span class="font-bold text-orange-600">
                    {{ FormatHelper.currency(menu.price) }}
                  </span>

                  <span
                    v-if="menu.is_available"
                    class="text-xs font-medium text-green-600"
                  >
                    Tersedia
                  </span>

                  <span
                    v-else
                    class="text-xs font-medium text-red-500"
                  >
                    Habis
                  </span>
                </div>

                <!-- Add to Order -->
                <button
                  type="button"
                  :disabled="!menu.is_available"
                  class="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  @click="handleAddToOrder(menu)"
                >
                  <span v-if="!authStore.accessToken">
                    Login untuk Memesan
                  </span>

                  <span v-else>
                    + Tambah ke Pesanan
                  </span>
                </button>

              </div>
            </article>
          </div>

          <!-- Empty Menu -->
          <div
            v-else
            class="rounded-2xl bg-white p-10 text-center text-gray-500"
          >
            <div class="mb-3 text-4xl">
              🍽️
            </div>

            Belum ada menu tersedia.
          </div>

        </section>
      </template>
    </main>

    <Footer />

    <!-- Login Required Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showLoginAlert"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          @click.self="closeLoginAlert"
        >
          <div
            class="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
          >

            <!-- Icon -->
            <div
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"
            >
              <span class="text-3xl">
                🔐
              </span>
            </div>

            <!-- Message -->
            <h3 class="mt-5 text-xl font-bold text-gray-900">
              Login Diperlukan
            </h3>

            <p class="mt-3 text-sm leading-relaxed text-gray-500">
              Silakan login terlebih dahulu untuk melakukan pemesanan
              menu catering ini.
            </p>

            <!-- Actions -->
            <div class="mt-7 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                class="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                @click="closeLoginAlert"
              >
                Nanti Saja
              </button>

              <button
                type="button"
                class="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                @click="redirectToLogin"
              >
                Login Sekarang
              </button>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>

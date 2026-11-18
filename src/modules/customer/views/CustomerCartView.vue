
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

/**
 * Format number into Indonesian Rupiah currency.
 *
 * @param {number} value
 * @returns {string}
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Calculate total price for a cart item.
 *
 * @param {Object} item
 * @returns {number}
 */
const itemSubtotal = (item) => {
  return Number(item.price) * item.quantity
}

/**
 * Check whether the cart contains items.
 *
 * @returns {boolean}
 */
const hasItems = computed(() => cartStore.items.length > 0)

/**
 * Navigate to merchant detail page.
 */
const continueShopping = () => {
  router.push('/')
}

/**
 * Navigate to checkout page.
 */
const goToCheckout = () => {
  if (!hasItems.value) return

  router.push({ name: 'customer-checkout' })
}

/**
 * Clear all cart items after user confirmation.
 */
const handleClearCart = () => {
  const confirmed = window.confirm(
    'Apakah Anda yakin ingin mengosongkan keranjang?',
  )

  if (confirmed) {
    cartStore.clearCart()
  }
}

/**
 * Remove an item from the cart after confirmation.
 *
 * @param {Object} item
 */
const handleRemoveItem = (item) => {
  const confirmed = window.confirm(
    `Hapus ${item.name} dari keranjang?`,
  )

  if (confirmed) {
    cartStore.removeItem(item.menuId)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <p class="text-sm font-medium text-orange-600">
          Marketplace Katering
        </p>

        <h1 class="mt-2 text-3xl font-bold text-gray-900">
          Keranjang Pesanan
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Periksa kembali menu dan jumlah pesanan Anda sebelum checkout.
        </p>
      </div>

      <!-- Empty Cart -->
      <div
        v-if="!hasItems"
        class="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm"
      >
        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l2.2 11.2a2 2 0 002 1.6h8.9a2 2 0 002-1.6L22 7H6"
            />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </div>

        <h2 class="mt-6 text-xl font-bold text-gray-900">
          Keranjang Anda masih kosong
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Silakan pilih menu katering terlebih dahulu untuk mulai membuat
          pesanan.
        </p>

        <button
          type="button"
          @click="continueShopping"
          class="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Jelajahi Merchant
        </button>
      </div>

      <!-- Cart Content -->
      <div
        v-else
        class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
      >
        <!-- Cart Items -->
        <section class="space-y-5 lg:col-span-2">
          <!-- Merchant Information -->
          <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                Merchant
              </p>

              <h2 class="mt-1 text-lg font-bold text-gray-900">
                {{ cartStore.merchantName }}
              </h2>
            </div>

            <span
              class="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600"
            >
              {{ cartStore.totalItems }} item
            </span>
          </div>

          <!-- Item List -->
          <div
            v-for="item in cartStore.items"
            :key="item.menuId"
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div class="flex flex-col gap-4 sm:flex-row">
              <!-- Menu Image -->
              <div
                class="h-28 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-32"
              >
                <img
                  v-if="item.photoUrl"
                  :src="item.photoUrl"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />

                <div
                  v-else
                  class="flex h-full items-center justify-center text-sm text-gray-400"
                >
                  Tidak ada foto
                </div>
              </div>

              <!-- Menu Information -->
              <div class="flex flex-1 flex-col justify-between gap-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      {{ item.name }}
                    </h3>

                    <p class="mt-1 text-sm text-gray-500">
                      {{ formatCurrency(item.price) }}
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="handleRemoveItem(item)"
                    class="text-sm font-medium text-red-500 transition hover:text-red-700"
                  >
                    Hapus
                  </button>
                </div>

                <div
                  class="flex flex-wrap items-center justify-between gap-3"
                >
                  <!-- Quantity Control -->
                  <div
                    class="inline-flex items-center overflow-hidden rounded-lg border border-gray-200"
                  >
                    <button
                      type="button"
                      @click="cartStore.decrementItem(item.menuId)"
                      class="flex h-9 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>

                    <span
                      class="min-w-10 px-2 text-center text-sm font-semibold text-gray-900"
                    >
                      {{ item.quantity }}
                    </span>

                    <button
                      type="button"
                      @click="cartStore.incrementItem(item.menuId)"
                      class="flex h-9 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>

                  <!-- Item Subtotal -->
                  <div class="text-right">
                    <p class="text-xs text-gray-400">
                      Subtotal
                    </p>

                    <p class="mt-1 font-bold text-gray-900">
                      {{ formatCurrency(itemSubtotal(item)) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Clear Cart -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="handleClearCart"
              class="text-sm font-medium text-red-500 transition hover:text-red-700"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </section>

        <!-- Order Summary -->
        <aside
          class="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-gray-900">
            Ringkasan Pesanan
          </h2>

          <div class="mt-6 space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">
                Total item
              </span>

              <span class="font-medium text-gray-900">
                {{ cartStore.totalItems }} item
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">
                Jumlah jenis menu
              </span>

              <span class="font-medium text-gray-900">
                {{ cartStore.items.length }} menu
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">
                Subtotal
              </span>

              <span class="font-medium text-gray-900">
                {{ formatCurrency(cartStore.subtotal) }}
              </span>
            </div>

            <div class="border-t border-dashed border-gray-200 pt-4">
              <div class="flex items-center justify-between gap-3">
                <span class="font-semibold text-gray-900">
                  Total Pesanan
                </span>

                <span class="text-xl font-bold text-orange-600">
                  {{ formatCurrency(cartStore.subtotal) }}
                </span>
              </div>

              <p class="mt-2 text-xs text-gray-400">
                Biaya pengiriman atau biaya tambahan lainnya, jika ada,
                akan diinformasikan pada tahap berikutnya.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="goToCheckout"
            class="mt-7 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Lanjutkan Checkout
          </button>

          <button
            type="button"
            @click="continueShopping"
            class="mt-3 w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Tambah Menu Lain
          </button>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import CustomerOrderService from '@/modules/customer/services/CustomerOrderService'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  delivery_date: '',
  delivery_address: '',
  notes: '',
})

/**
 * Get today's date in YYYY-MM-DD format.
 *
 * @returns {string}
 */
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const minDeliveryDate = computed(() => getTodayDate())

/**
 * Format currency into Indonesian Rupiah.
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
 * Navigate back to cart.
 */
const backToCart = () => {
  router.push({ name: 'customer-cart' })
}

/**
 * Submit checkout form and create order.
 */
const submitOrder = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (cartStore.isEmpty) {
    errorMessage.value = 'Keranjang pesanan masih kosong.'
    return
  }

  if (!form.value.delivery_date) {
    errorMessage.value = 'Tanggal pengiriman wajib diisi.'
    return
  }

  if (form.value.delivery_date < minDeliveryDate.value) {
    errorMessage.value = 'Tanggal pengiriman tidak boleh sebelum hari ini.'
    return
  }

  if (!form.value.delivery_address.trim()) {
    errorMessage.value = 'Alamat pengiriman wajib diisi.'
    return
  }

  if (loading.value) return

  loading.value = true

  try {
    const payload = {
      merchant_profile_id: cartStore.merchantProfileId,
      delivery_date: form.value.delivery_date,
      delivery_address: form.value.delivery_address.trim(),
      notes: form.value.notes.trim() || null,
      items: cartStore.getOrderItemsPayload(),
    }

    const response = await CustomerOrderService.createOrder(payload)

    if (!response?.success) {
      throw new Error(
        response?.message || 'Pesanan gagal dibuat.',
      )
    }

    const orderId = response.data?.id

    if (!orderId) {
      throw new Error(
        'Pesanan berhasil diproses, tetapi ID pesanan tidak ditemukan.',
      )
    }

    cartStore.clearCart()

    successMessage.value = 'Pesanan berhasil dibuat.'

    router.replace({
      name: 'customer-order-detail',
      params: { orderId },
    })
  } catch (error) {
    console.error('Checkout error:', error)

    const responseData = error.response?.data

    if (responseData?.errors) {
      const firstError = Object.values(responseData.errors)[0]
      errorMessage.value = Array.isArray(firstError)
        ? firstError[0]
        : 'Periksa kembali data pesanan Anda.'
    } else {
      errorMessage.value =
        responseData?.message ||
        error.message ||
        'Terjadi kesalahan saat membuat pesanan.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          type="button"
          @click="backToCart"
          class="mb-4 text-sm font-medium text-gray-500 hover:text-orange-600"
        >
          ← Kembali ke Keranjang
        </button>

        <p class="text-sm font-medium text-orange-600">
          Marketplace Katering
        </p>

        <h1 class="mt-2 text-3xl font-bold text-gray-900">
          Checkout Pesanan
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Lengkapi informasi pengiriman untuk menyelesaikan pesanan.
        </p>
      </div>

      <!-- Empty Cart -->
      <div
        v-if="cartStore.isEmpty"
        class="rounded-2xl border border-gray-200 bg-white p-10 text-center"
      >
        <h2 class="text-xl font-bold text-gray-900">
          Tidak ada item untuk checkout
        </h2>

        <p class="mt-2 text-sm text-gray-500">
          Silakan tambahkan menu ke keranjang terlebih dahulu.
        </p>

        <button
          type="button"
          @click="router.push({ name: 'customer-cart' })"
          class="mt-5 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Kembali ke Keranjang
        </button>
      </div>

      <div
        v-else
        class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
      >
        <!-- Checkout Form -->
        <section class="space-y-6 lg:col-span-2">
          <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-bold text-gray-900">
              Informasi Pengiriman
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Tentukan kapan dan ke mana pesanan akan dikirim.
            </p>

            <form
              class="mt-6 space-y-5"
              @submit.prevent="submitOrder"
            >
              <!-- Delivery Date -->
              <div>
                <label
                  for="delivery_date"
                  class="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Tanggal Pengiriman
                  <span class="text-red-500">*</span>
                </label>

                <input
                  id="delivery_date"
                  v-model="form.delivery_date"
                  type="date"
                  :min="minDeliveryDate"
                  required
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <!-- Delivery Address -->
              <div>
                <label
                  for="delivery_address"
                  class="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Alamat Pengiriman
                  <span class="text-red-500">*</span>
                </label>

                <textarea
                  id="delivery_address"
                  v-model="form.delivery_address"
                  rows="4"
                  maxlength="1000"
                  required
                  placeholder="Masukkan alamat lengkap pengiriman..."
                  class="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                ></textarea>

                <p class="mt-1 text-xs text-gray-400">
                  Pastikan alamat sudah lengkap dan mudah ditemukan.
                </p>
              </div>

              <!-- Notes -->
              <div>
                <label
                  for="notes"
                  class="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Catatan Pesanan
                </label>

                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  maxlength="1000"
                  placeholder="Contoh: Mohon dikirim sebelum pukul 11.00..."
                  class="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                ></textarea>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                {{ errorMessage }}
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{
                  loading
                    ? 'Memproses Pesanan...'
                    : 'Buat Pesanan'
                }}
              </button>
            </form>
          </div>
        </section>

        <!-- Order Summary -->
        <aside
          class="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-gray-900">
            Ringkasan Pesanan
          </h2>

          <div class="mt-5 border-b border-gray-100 pb-5">
            <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
              Merchant
            </p>

            <p class="mt-1 font-semibold text-gray-900">
              {{ cartStore.merchantName }}
            </p>
          </div>

          <div class="mt-5 space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.menuId"
              class="flex justify-between gap-3"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-900">
                  {{ item.name }}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  {{ item.quantity }} × {{ formatCurrency(item.price) }}
                </p>
              </div>

              <p class="whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ formatCurrency(item.price * item.quantity) }}
              </p>
            </div>
          </div>

          <div class="mt-5 space-y-3 border-t border-gray-100 pt-5">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">
                Total item
              </span>

              <span class="font-medium text-gray-900">
                {{ cartStore.totalItems }}
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

            <div class="flex justify-between gap-3 pt-2">
              <span class="font-semibold text-gray-900">
                Total Pesanan
              </span>

              <span class="text-lg font-bold text-orange-600">
                {{ formatCurrency(cartStore.subtotal) }}
              </span>
            </div>
          </div>

          <p class="mt-4 text-xs leading-relaxed text-gray-400">
            Harga akhir akan dihitung kembali oleh server berdasarkan
            harga menu yang tersimpan di database.
          </p>
        </aside>
      </div>
    </main>

    <Footer />
  </div>
</template>

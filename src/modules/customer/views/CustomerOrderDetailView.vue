
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomerOrderService from '@/modules/customer/services/CustomerOrderService'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)
const errorMessage = ref('')

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
  }).format(Number(value || 0))
}

/**
 * Format date into Indonesian date format.
 *
 * @param {string} value
 * @returns {string}
 */
const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

/**
 * Get order status label.
 *
 * @param {string} status
 * @returns {string}
 */
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    preparing: 'Sedang Diproses',
    ready: 'Siap Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return labels[status] || status
}

/**
 * Get order status badge class.
 *
 * @param {string} status
 * @returns {string}
 */
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    preparing: 'bg-indigo-50 text-indigo-700',
    ready: 'bg-purple-50 text-purple-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }

  return classes[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Fetch order detail from backend.
 */
const fetchOrderDetail = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await CustomerOrderService.getOrderDetail(
      route.params.orderId,
    )

    if (!response?.success) {
      throw new Error(
        response?.message || 'Gagal mengambil detail pesanan.',
      )
    }

    order.value = response.data
  } catch (error) {
    console.error('Fetch order detail error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat mengambil detail pesanan.'
  } finally {
    loading.value = false
  }
}

/**
 * Navigate to invoice detail.
 */
const openInvoice = () => {
  if (!order.value?.invoice?.id) return

  router.push({
    name: 'customer-invoice-detail',
    params: {
      invoiceId: order.value.invoice.id,
    },
  })
}

/**
 * Navigate back to customer orders.
 */
const backToOrders = () => {
  router.push({ name: 'customer-orders' })
}

onMounted(fetchOrderDetail)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        @click="backToOrders"
        class="mb-6 text-sm font-medium text-gray-500 hover:text-orange-600"
      >
        ← Kembali ke Pesanan Saya
      </button>

      <!-- Loading -->
      <div
        v-if="loading"
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center"
      >
        <p class="text-sm text-gray-500">
          Memuat detail pesanan...
        </p>
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMessage"
        class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p class="text-sm text-red-700">
          {{ errorMessage }}
        </p>

        <button
          type="button"
          @click="fetchOrderDetail"
          class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>

      <template v-else-if="order">
        <!-- Header -->
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-orange-600">
              Detail Pesanan
            </p>

            <h1 class="mt-2 text-3xl font-bold text-gray-900">
              {{ order.order_number }}
            </h1>

            <p class="mt-2 text-sm text-gray-500">
              Dibuat pada {{ formatDate(order.created_at) }}
            </p>
          </div>

          <span
            class="rounded-full px-4 py-2 text-sm font-semibold"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <!-- Main Detail -->
          <section class="space-y-6 lg:col-span-2">
            <!-- Merchant -->
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 class="font-bold text-gray-900">
                Informasi Merchant
              </h2>

              <p class="mt-3 text-lg font-semibold text-gray-900">
                {{
                  order.merchant_profile?.company_name ||
                  order.merchant_profile?.full_name ||
                  'Merchant'
                }}
              </p>

              <p class="mt-1 text-sm text-gray-500">
                {{ order.merchant_profile?.address || '-' }}
              </p>
            </div>

            <!-- Delivery -->
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 class="font-bold text-gray-900">
                Informasi Pengiriman
              </h2>

              <div class="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p class="text-xs text-gray-400">
                    Tanggal Pengiriman
                  </p>

                  <p class="mt-1 text-sm font-semibold text-gray-900">
                    {{ formatDate(order.delivery_date) }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-400">
                    Alamat Pengiriman
                  </p>

                  <p class="mt-1 text-sm font-semibold text-gray-900">
                    {{ order.delivery_address }}
                  </p>
                </div>
              </div>

              <div
                v-if="order.notes"
                class="mt-5 border-t border-gray-100 pt-4"
              >
                <p class="text-xs text-gray-400">
                  Catatan Pesanan
                </p>

                <p class="mt-1 text-sm text-gray-700">
                  {{ order.notes }}
                </p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 class="font-bold text-gray-900">
                Daftar Menu
              </h2>

              <div class="mt-5 divide-y divide-gray-100">
                <div
                  v-for="item in order.order_items || []"
                  :key="item.id"
                  class="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ item.menu_name }}
                    </p>

                    <p class="mt-1 text-sm text-gray-500">
                      {{ item.quantity }} × {{ formatCurrency(item.price) }}
                    </p>
                  </div>

                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Summary -->
          <aside class="space-y-5">
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 class="font-bold text-gray-900">
                Ringkasan Pembayaran
              </h2>

              <div class="mt-5 space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">
                    Subtotal
                  </span>

                  <span class="font-medium text-gray-900">
                    {{ formatCurrency(order.subtotal) }}
                  </span>
                </div>

                <div class="border-t border-gray-100 pt-4">
                  <div class="flex justify-between gap-3">
                    <span class="font-semibold text-gray-900">
                      Total
                    </span>

                    <span class="text-lg font-bold text-orange-600">
                      {{ formatCurrency(order.total) }}
                    </span>
                  </div>
                </div>
              </div>

              <button
                v-if="order.invoice?.id"
                type="button"
                @click="openInvoice"
                class="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Lihat Invoice
              </button>

              <div
                v-else
                class="mt-6 rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500"
              >
                Invoice belum tersedia.
              </div>
            </div>

            <!-- Invoice Information -->
            <div
              v-if="order.invoice"
              class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 class="font-bold text-gray-900">
                Informasi Invoice
              </h2>

              <div class="mt-4 space-y-3 text-sm">
                <div>
                  <p class="text-xs text-gray-400">
                    Nomor Invoice
                  </p>

                  <p class="mt-1 font-semibold text-gray-900">
                    {{ order.invoice.invoice_number }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-400">
                    Tanggal Invoice
                  </p>

                  <p class="mt-1 font-semibold text-gray-900">
                    {{ formatDate(order.invoice.invoice_date) }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-400">
                    Status Invoice
                  </p>

                  <p class="mt-1 font-semibold capitalize text-gray-900">
                    {{ order.invoice.status }}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </template>
    </main>

    <Footer />
  </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CustomerOrderService from '@/modules/customer/services/CustomerOrderService'

const router = useRouter()

const orders = ref([])
const loading = ref(false)
const errorMessage = ref('')
const selectedStatus = ref('all')

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Dikonfirmasi', value: 'confirmed' },
  { label: 'Diproses', value: 'preparing' },
  { label: 'Siap', value: 'ready' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

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
 * Get status badge class.
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
 * Get orders from backend.
 */
const fetchOrders = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await CustomerOrderService.getOrders()

    if (!response?.success) {
      throw new Error(response?.message || 'Gagal mengambil pesanan.')
    }

    const result = response.data

    // Support both paginated and non-paginated responses.
    orders.value = Array.isArray(result)
      ? result
      : result?.data || []
  } catch (error) {
    console.error('Fetch customer orders error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat mengambil pesanan.'
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }

  return orders.value.filter(
    (order) => order.status === selectedStatus.value,
  )
})

/**
 * Navigate to order detail.
 *
 * @param {string} orderId
 */
const openOrderDetail = (orderId) => {
  router.push({
    name: 'customer-order-detail',
    params: { orderId },
  })
}

/**
 * Navigate to invoice detail.
 *
 * @param {string} invoiceId
 */
const openInvoice = (invoiceId) => {
  router.push({
    name: 'customer-invoice-detail',
    params: { invoiceId },
  })
}

onMounted(fetchOrders)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm font-medium text-orange-600">
          Akun Customer
        </p>

        <h1 class="mt-2 text-3xl font-bold text-gray-900">
          Pesanan Saya
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Pantau status dan riwayat seluruh pesanan katering Anda.
        </p>
      </div>

      <!-- Status Filter -->
      <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          type="button"
          @click="selectedStatus = option.value"
          class="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition"
          :class="
            selectedStatus === option.value
              ? 'bg-orange-500 text-white'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
          "
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center"
      >
        <p class="text-sm text-gray-500">
          Memuat data pesanan...
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
          @click="fetchOrders"
          class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredOrders.length === 0"
        class="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center"
      >
        <div class="text-5xl">🛒</div>

        <h2 class="mt-5 text-xl font-bold text-gray-900">
          {{ orders.length === 0 ? 'Belum Ada Pesanan' : 'Pesanan Tidak Ditemukan' }}
        </h2>

        <p class="mt-2 text-sm text-gray-500">
          {{
            orders.length === 0
              ? 'Anda belum pernah membuat pesanan katering.'
              : 'Tidak ada pesanan dengan status tersebut.'
          }}
        </p>

        <button
          v-if="orders.length === 0"
          type="button"
          @click="router.push('/')"
          class="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Cari Katering
        </button>
      </div>

      <!-- Orders -->
      <div v-else class="space-y-5">
        <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <!-- Order Header -->
          <div
            class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4"
          >
            <div>
              <p class="text-xs text-gray-400">
                Nomor Pesanan
              </p>

              <p class="mt-1 font-bold text-gray-900">
                {{ order.order_number }}
              </p>
            </div>

            <span
              class="rounded-full px-3 py-1.5 text-xs font-semibold"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- Order Content -->
          <div class="p-5">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-xs text-gray-400">
                  Merchant
                </p>

                <h3 class="mt-1 font-semibold text-gray-900">
                  {{
                    order.merchant_profile?.company_name ||
                    order.merchant_profile?.full_name ||
                    'Merchant'
                  }}
                </h3>

                <p class="mt-2 text-sm text-gray-500">
                  Tanggal pengiriman:
                  {{ formatDate(order.delivery_date) }}
                </p>

                <p class="mt-1 text-sm text-gray-500">
                  {{ order.order_items?.length || 0 }} jenis menu
                </p>
              </div>

              <div class="text-right">
                <p class="text-xs text-gray-400">
                  Total Pesanan
                </p>

                <p class="mt-1 text-lg font-bold text-orange-600">
                  {{ formatCurrency(order.total) }}
                </p>
              </div>
            </div>

            <!-- Items Preview -->
            <div
              v-if="order.order_items?.length"
              class="mt-5 border-t border-gray-100 pt-4"
            >
              <div
                v-for="item in order.order_items.slice(0, 3)"
                :key="item.id"
                class="flex justify-between gap-3 py-1.5 text-sm"
              >
                <span class="text-gray-600">
                  {{ item.menu_name }} × {{ item.quantity }}
                </span>

                <span class="font-medium text-gray-800">
                  {{ formatCurrency(item.subtotal) }}
                </span>
              </div>

              <p
                v-if="order.order_items.length > 3"
                class="mt-2 text-xs text-gray-400"
              >
                +{{ order.order_items.length - 3 }} menu lainnya
              </p>
            </div>

            <!-- Actions -->
            <div
              class="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4"
            >
              <button
                v-if="order.invoice?.id"
                type="button"
                @click="openInvoice(order.invoice.id)"
                class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Lihat Invoice
              </button>

              <button
                type="button"
                @click="openOrderDetail(order.id)"
                class="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Detail Pesanan
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <Footer />
  </div>
</template>

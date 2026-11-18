
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomerInvoiceService from '@/modules/customer/services/CustomerInvoiceService'

const router = useRouter()

const invoices = ref([])
const loading = ref(false)
const errorMessage = ref('')
const selectedStatus = ref('all')

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Diterbitkan', value: 'issued' },
  { label: 'Dibayar', value: 'paid' },
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

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Get invoice status label.
 *
 * @param {string} status
 * @returns {string}
 */
const getStatusLabel = (status) => {
  const labels = {
    issued: 'Diterbitkan',
    paid: 'Dibayar',
    cancelled: 'Dibatalkan',
  }

  return labels[status] || status
}

/**
 * Get invoice status badge class.
 *
 * @param {string} status
 * @returns {string}
 */
const getStatusClass = (status) => {
  const classes = {
    issued: 'bg-blue-50 text-blue-700',
    paid: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }

  return classes[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Fetch customer invoices.
 */
const fetchInvoices = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await CustomerInvoiceService.getInvoices()

    if (!response?.success) {
      throw new Error(
        response?.message || 'Gagal mengambil data invoice.',
      )
    }

    const result = response.data

    invoices.value = Array.isArray(result)
      ? result
      : result?.data || []
  } catch (error) {
    console.error('Fetch invoices error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat mengambil invoice.'
  } finally {
    loading.value = false
  }
}

const filteredInvoices = computed(() => {
  if (selectedStatus.value === 'all') {
    return invoices.value
  }

  return invoices.value.filter(
    (invoice) => invoice.status === selectedStatus.value,
  )
})

/**
 * Navigate to invoice detail.
 *
 * @param {string} invoiceId
 */
const openInvoiceDetail = (invoiceId) => {
  router.push({
    name: 'customer-invoice-detail',
    params: { invoiceId },
  })
}

onMounted(fetchInvoices)
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
          Invoice Saya
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Lihat dan kelola seluruh invoice dari pesanan katering Anda.
        </p>
      </div>

      <!-- Filter -->
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
          Memuat invoice...
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
          @click="fetchInvoices"
          class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredInvoices.length === 0"
        class="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center"
      >
        <div class="text-5xl">📄</div>

        <h2 class="mt-5 text-xl font-bold text-gray-900">
          {{ invoices.length === 0 ? 'Belum Ada Invoice' : 'Invoice Tidak Ditemukan' }}
        </h2>

        <p class="mt-2 text-sm text-gray-500">
          {{
            invoices.length === 0
              ? 'Invoice akan muncul setelah Anda berhasil membuat pesanan.'
              : 'Tidak ada invoice dengan status tersebut.'
          }}
        </p>

        <button
          v-if="invoices.length === 0"
          type="button"
          @click="router.push({ name: 'customer-orders' })"
          class="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Lihat Pesanan Saya
        </button>
      </div>

      <!-- Invoice List -->
      <div v-else class="space-y-4">
        <article
          v-for="invoice in filteredInvoices"
          :key="invoice.id"
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs text-gray-400">
                Nomor Invoice
              </p>

              <h3 class="mt-1 font-bold text-gray-900">
                {{ invoice.invoice_number }}
              </h3>

              <p class="mt-3 text-sm text-gray-500">
                Pesanan:
                <span class="font-medium text-gray-700">
                  {{ invoice.order?.order_number || '-' }}
                </span>
              </p>

              <p class="mt-1 text-sm text-gray-500">
                Merchant:
                <span class="font-medium text-gray-700">
                  {{
                    invoice.order?.merchant_profile?.company_name ||
                    invoice.order?.merchant_profile?.full_name ||
                    'Merchant'
                  }}
                </span>
              </p>
            </div>

            <span
              class="rounded-full px-3 py-1.5 text-xs font-semibold"
              :class="getStatusClass(invoice.status)"
            >
              {{ getStatusLabel(invoice.status) }}
            </span>
          </div>

          <div
            class="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4"
          >
            <div>
              <p class="text-xs text-gray-400">
                Tanggal Invoice
              </p>

              <p class="mt-1 text-sm font-medium text-gray-700">
                {{ formatDate(invoice.invoice_date) }}
              </p>

              <p class="mt-3 text-xs text-gray-400">
                Total Invoice
              </p>

              <p class="mt-1 text-lg font-bold text-orange-600">
                {{ formatCurrency(invoice.total) }}
              </p>
            </div>

            <button
              type="button"
              @click="openInvoiceDetail(invoice.id)"
              class="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Detail Invoice
            </button>
          </div>
        </article>
      </div>
    </main>

    <Footer />
  </div>
</template>

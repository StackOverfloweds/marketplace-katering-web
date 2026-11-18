
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomerInvoiceService from '@/modules/customer/services/CustomerInvoiceService'

const route = useRoute()
const router = useRouter()

const invoice = ref(null)
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
 * Fetch invoice detail.
 */
const fetchInvoiceDetail = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await CustomerInvoiceService.getInvoiceDetail(
      route.params.invoiceId,
    )

    if (!response?.success) {
      throw new Error(
        response?.message || 'Gagal mengambil detail invoice.',
      )
    }

    invoice.value = response.data
  } catch (error) {
    console.error('Fetch invoice detail error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat mengambil detail invoice.'
  } finally {
    loading.value = false
  }
}

/**
 * Print invoice document.
 */
const printInvoice = () => {
  window.print()
}

/**
 * Navigate back to invoice list.
 */
const backToInvoices = () => {
  router.push({ name: 'customer-invoices' })
}

onMounted(fetchInvoiceDetail)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          @click="backToInvoices"
          class="text-sm font-medium text-gray-500 hover:text-orange-600"
        >
          ← Kembali ke Invoice Saya
        </button>

        <button
          v-if="invoice"
          type="button"
          @click="printInvoice"
          class="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Cetak Invoice
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center"
      >
        <p class="text-sm text-gray-500">
          Memuat detail invoice...
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
          @click="fetchInvoiceDetail"
          class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Invoice Document -->
      <article
        v-else-if="invoice"
        class="invoice-document rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10"
      >
        <!-- Invoice Header -->
        <div class="flex flex-wrap items-start justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-orange-600">
              Marketplace Katering
            </p>

            <h1 class="mt-3 text-3xl font-bold text-gray-900">
              INVOICE
            </h1>

            <p class="mt-2 text-sm text-gray-500">
              {{ invoice.invoice_number }}
            </p>
          </div>

          <div class="text-left sm:text-right">
            <span
              class="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700"
            >
              {{ getStatusLabel(invoice.status) }}
            </span>

            <p class="mt-4 text-xs text-gray-400">
              Tanggal Invoice
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ formatDate(invoice.invoice_date) }}
            </p>
          </div>
        </div>

        <!-- Parties -->
        <div class="grid gap-8 border-b border-gray-200 py-8 sm:grid-cols-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Ditagihkan Kepada
            </p>

            <h2 class="mt-3 font-bold text-gray-900">
              {{
                invoice.order?.customer_profile?.full_name ||
                'Customer'
              }}
            </h2>

            <p class="mt-2 text-sm text-gray-600">
              {{ invoice.order?.customer_profile?.email || '-' }}
            </p>

            <p class="mt-1 text-sm text-gray-600">
              {{ invoice.order?.customer_profile?.phone || '-' }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Merchant
            </p>

            <h2 class="mt-3 font-bold text-gray-900">
              {{
                invoice.order?.merchant_profile?.company_name ||
                invoice.order?.merchant_profile?.full_name ||
                'Merchant'
              }}
            </h2>

            <p class="mt-2 text-sm text-gray-600">
              {{ invoice.order?.merchant_profile?.address || '-' }}
            </p>
          </div>
        </div>

        <!-- Order Information -->
        <div class="grid gap-5 border-b border-gray-200 py-8 sm:grid-cols-2">
          <div>
            <p class="text-xs text-gray-400">
              Nomor Pesanan
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ invoice.order?.order_number || '-' }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-400">
              Tanggal Pengiriman
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ formatDate(invoice.order?.delivery_date) }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <p class="text-xs text-gray-400">
              Alamat Pengiriman
            </p>

            <p class="mt-1 text-sm font-semibold text-gray-900">
              {{ invoice.order?.delivery_address || '-' }}
            </p>
          </div>
        </div>

        <!-- Invoice Items -->
        <div class="py-8">
          <h2 class="mb-5 font-bold text-gray-900">
            Rincian Pesanan
          </h2>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[500px] text-left">
              <thead>
                <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                  <th class="pb-3 pr-4">Menu</th>
                  <th class="pb-3 px-4 text-center">Qty</th>
                  <th class="pb-3 px-4 text-right">Harga</th>
                  <th class="pb-3 pl-4 text-right">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in invoice.order?.order_items || []"
                  :key="item.id"
                  class="border-b border-gray-100"
                >
                  <td class="py-4 pr-4 text-sm font-medium text-gray-900">
                    {{ item.menu_name }}
                  </td>

                  <td class="px-4 py-4 text-center text-sm text-gray-600">
                    {{ item.quantity }}
                  </td>

                  <td class="px-4 py-4 text-right text-sm text-gray-600">
                    {{ formatCurrency(item.price) }}
                  </td>

                  <td class="py-4 pl-4 text-right text-sm font-semibold text-gray-900">
                    {{ formatCurrency(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals -->
        <div class="flex justify-end border-t border-gray-200 pt-6">
          <div class="w-full space-y-4 sm:max-w-sm">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">
                Subtotal
              </span>

              <span class="font-medium text-gray-900">
                {{ formatCurrency(invoice.subtotal) }}
              </span>
            </div>

            <div class="flex justify-between border-t border-gray-200 pt-4">
              <span class="font-bold text-gray-900">
                Total Invoice
              </span>

              <span class="text-xl font-bold text-orange-600">
                {{ formatCurrency(invoice.total) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div
          v-if="invoice.order?.notes"
          class="mt-8 rounded-xl bg-gray-50 p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Catatan Pesanan
          </p>

          <p class="mt-2 text-sm text-gray-700">
            {{ invoice.order.notes }}
          </p>
        </div>

        <!-- Footer -->
        <div class="mt-12 border-t border-gray-200 pt-6 text-center">
          <p class="text-sm font-semibold text-gray-800">
            Terima kasih telah menggunakan Marketplace Katering.
          </p>

          <p class="mt-2 text-xs text-gray-400">
            Dokumen ini diterbitkan secara elektronik.
          </p>
        </div>
      </article>
    </main>

    <Footer />
  </div>
</template>

<style>
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }

  body {
    background: white !important;
  }

  body * {
    visibility: hidden;
  }

  .invoice-document,
  .invoice-document * {
    visibility: visible;
  }

  .invoice-document {
    position: absolute;
    inset: 0;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
  }
}
</style>

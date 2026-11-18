
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MerchantInvoiceService from '../services/MerchantInvoiceService'

const route = useRoute()
const router = useRouter()

const invoices = ref([])
const selectedInvoice = ref(null)

const loading = ref(false)
const detailLoading = ref(false)
const errorMessage = ref('')

const search = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
})

const filteredInvoices = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return invoices.value

  return invoices.value.filter((invoice) => {
    return (
      invoice.invoice_number?.toLowerCase().includes(keyword) ||
      invoice.order?.order_number?.toLowerCase().includes(keyword) ||
      invoice.order?.customer_profile?.full_name?.toLowerCase().includes(keyword)
    )
  })
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

/**
 * Mengambil daftar invoice merchant.
 * @param {number} page
 */
const fetchInvoices = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantInvoiceService.getInvoices({
      per_page: pagination.value.per_page,
      page,
    })

    invoices.value = response.data?.data || []

    pagination.value = {
      current_page: response.data?.current_page || 1,
      last_page: response.data?.last_page || 1,
      total: response.data?.total || 0,
      per_page: response.data?.per_page || 10,
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil daftar invoice.'
  } finally {
    loading.value = false
  }
}

/**
 * Mengambil detail invoice.
 * @param {string} id
 */
const openInvoice = async (id) => {
  detailLoading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantInvoiceService.getInvoiceDetail(id)
    selectedInvoice.value = response.data
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil detail invoice.'
  } finally {
    detailLoading.value = false
  }
}

/**
 * Menutup detail invoice.
 */
const closeInvoice = () => {
  selectedInvoice.value = null
  router.replace({ query: {} })
}

/**
 * Mengganti halaman daftar invoice.
 * @param {number} page
 */
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return

  fetchInvoices(page)
}

/**
 * Mencetak invoice.
 */
const printInvoice = () => {
  window.print()
}

onMounted(async () => {
  await fetchInvoices()

  if (route.query.invoice) {
    await openInvoice(route.query.invoice)
  }
})
</script>

<template>
  <div class="space-y-6">
    <section>
      <h1 class="text-2xl font-bold text-gray-900">Invoice</h1>
      <p class="mt-1 text-sm text-gray-500">
        Lihat dan cetak invoice dari transaksi customer.
      </p>
    </section>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Total Invoice</p>
        <p class="mt-2 text-2xl font-bold text-gray-900">
          {{ pagination.total }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Total Nilai Invoice (halaman ini)</p>
        <p class="mt-2 text-2xl font-bold text-orange-600">
          {{ formatPrice(invoices.reduce((sum, item) => sum + Number(item.total || 0), 0)) }}
        </p>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 class="font-semibold text-gray-900">Daftar Invoice</h2>
          <p class="mt-1 text-xs text-gray-500">
            Invoice yang berkaitan dengan pesanan usaha Anda.
          </p>
        </div>

        <input
          v-model="search"
          type="search"
          placeholder="Cari invoice atau pesanan..."
          class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
        />
      </div>

      <div v-if="loading" class="p-12 text-center text-sm text-gray-500">
        Memuat invoice...
      </div>

      <div
        v-else-if="filteredInvoices.length === 0"
        class="p-12 text-center"
      >
        <div class="text-4xl">🧾</div>
        <p class="mt-3 font-medium text-gray-800">
          Invoice tidak ditemukan
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Invoice yang dibuat dari checkout customer akan muncul di sini.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[750px] text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-5 py-4">Nomor Invoice</th>
              <th class="px-5 py-4">Nomor Pesanan</th>
              <th class="px-5 py-4">Customer</th>
              <th class="px-5 py-4">Tanggal</th>
              <th class="px-5 py-4">Total</th>
              <th class="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="invoice in filteredInvoices"
              :key="invoice.id"
              class="hover:bg-gray-50"
            >
              <td class="px-5 py-4 font-semibold text-gray-900">
                {{ invoice.invoice_number }}
              </td>

              <td class="px-5 py-4 text-gray-600">
                {{ invoice.order?.order_number || '-' }}
              </td>

              <td class="px-5 py-4 text-gray-700">
                {{ invoice.order?.customer_profile?.full_name || '-' }}
              </td>

              <td class="px-5 py-4 text-gray-600">
                {{ formatDate(invoice.invoice_date) }}
              </td>

              <td class="px-5 py-4 font-semibold text-gray-900">
                {{ formatPrice(invoice.total) }}
              </td>

              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="rounded-lg bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100"
                  @click="openInvoice(invoice.id)"
                >
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 p-4">
        <p class="text-xs text-gray-500">
          Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="pagination.current_page <= 1 || loading"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
            @click="changePage(pagination.current_page - 1)"
          >
            Sebelumnya
          </button>

          <button
            type="button"
            :disabled="pagination.current_page >= pagination.last_page || loading"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
            @click="changePage(pagination.current_page + 1)"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </section>

    <!-- Invoice Detail Modal -->
    <div
      v-if="detailLoading || selectedInvoice"
      class="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      @click.self="closeInvoice"
    >
      <div class="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div v-if="detailLoading" class="p-12 text-center text-sm text-gray-500">
          Memuat detail invoice...
        </div>

        <template v-else-if="selectedInvoice">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                Detail Invoice
              </h2>
              <p class="mt-1 text-xs text-gray-500">
                {{ selectedInvoice.invoice_number }}
              </p>
            </div>

            <button
              type="button"
              class="text-2xl text-gray-400 hover:text-gray-700"
              @click="closeInvoice"
            >
              ×
            </button>
          </div>

          <div id="invoice-print-area" class="space-y-5">
            <div class="border-b border-gray-200 pb-5">
              <h3 class="text-2xl font-bold text-orange-600">
                KateringKu
              </h3>
              <p class="mt-1 text-sm text-gray-500">Invoice Pembelian</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs text-gray-500">Nomor Invoice</p>
                <p class="mt-1 font-semibold">
                  {{ selectedInvoice.invoice_number }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Tanggal Invoice</p>
                <p class="mt-1 font-semibold">
                  {{ formatDate(selectedInvoice.invoice_date) }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Customer</p>
                <p class="mt-1 font-semibold">
                  {{ selectedInvoice.order?.customer_profile?.full_name || '-' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Nomor Pesanan</p>
                <p class="mt-1 font-semibold">
                  {{ selectedInvoice.order?.order_number || '-' }}
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-y border-gray-200 text-left text-gray-500">
                    <th class="py-3">Menu</th>
                    <th class="py-3 text-center">Qty</th>
                    <th class="py-3 text-right">Harga</th>
                    <th class="py-3 text-right">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="item in selectedInvoice.order?.order_items || []"
                    :key="item.id"
                    class="border-b border-gray-100"
                  >
                    <td class="py-3 font-medium">{{ item.menu_name }}</td>
                    <td class="py-3 text-center">{{ item.quantity }}</td>
                    <td class="py-3 text-right">{{ formatPrice(item.price) }}</td>
                    <td class="py-3 text-right">{{ formatPrice(item.subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="ml-auto max-w-xs space-y-3 border-t border-gray-200 pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span>{{ formatPrice(selectedInvoice.subtotal) }}</span>
              </div>

              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-orange-600">
                  {{ formatPrice(selectedInvoice.total) }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-50"
              @click="closeInvoice"
            >
              Tutup
            </button>

            <button
              type="button"
              class="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              @click="printInvoice"
            >
              Cetak Invoice
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

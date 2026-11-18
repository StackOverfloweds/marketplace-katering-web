
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MerchantOrderService from '../services/MerchantOrderService'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)
const updating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const transitions = {
  pending: ['confirmed'],
  confirmed: ['preparing'],
  preparing: ['ready'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
}

const nextStatus = computed(() => {
  return transitions[order.value?.status] || []
})

const statusLabels = {
  pending: 'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  preparing: 'Sedang Diproses',
  ready: 'Siap Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

const statusClass = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-indigo-50 text-indigo-700',
  ready: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

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
    dateStyle: 'long',
  }).format(new Date(value))
}

/**
 * Mengambil detail pesanan.
 */
const fetchOrder = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantOrderService.getOrderDetail(
      route.params.orderId,
    )

    order.value = response.data
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil detail pesanan.'
  } finally {
    loading.value = false
  }
}

/**
 * Memperbarui status pesanan.
 * @param {string} status
 */
const changeStatus = async (status) => {
  if (!order.value || updating.value) return

  const confirmed = window.confirm(
    `Ubah status pesanan menjadi "${statusLabels[status]}"?`,
  )

  if (!confirmed) return

  updating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await MerchantOrderService.updateOrderStatus(order.value.id, status)

    successMessage.value = 'Status pesanan berhasil diperbarui.'
    await fetchOrder()
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal memperbarui status pesanan.'
  } finally {
    updating.value = false
  }
}

onMounted(fetchOrder)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        @click="router.push({ name: 'merchant-orders' })"
      >
        ← Kembali
      </button>

      <div>
        <h1 class="text-xl font-bold text-gray-900">Detail Pesanan</h1>
        <p class="text-xs text-gray-500">
          Informasi lengkap pesanan customer.
        </p>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="successMessage"
      class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
    >
      {{ successMessage }}
    </div>

    <div v-if="loading" class="rounded-2xl bg-white p-12 text-center text-sm text-gray-500">
      Memuat detail pesanan...
    </div>

    <template v-else-if="order">
      <section class="rounded-2xl border border-gray-200 bg-white p-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p class="text-xs text-gray-500">Nomor Pesanan</p>
            <h2 class="mt-1 text-xl font-bold text-gray-900">
              {{ order.order_number }}
            </h2>
            <p class="mt-1 text-xs text-gray-500">
              Dibuat {{ formatDate(order.created_at) }}
            </p>
          </div>

          <span
            class="w-fit rounded-full px-4 py-2 text-sm font-semibold"
            :class="statusClass[order.status]"
          >
            {{ statusLabels[order.status] || order.status }}
          </span>
        </div>

        <div class="mt-6 border-t border-gray-100 pt-5">
          <h3 class="text-sm font-semibold text-gray-900">
            Perbarui Status Pesanan
          </h3>

          <div v-if="nextStatus.length" class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="status in nextStatus"
              :key="status"
              type="button"
              :disabled="updating"
              class="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
              @click="changeStatus(status)"
            >
              {{ updating ? 'Memproses...' : statusLabels[status] }}
            </button>
          </div>

          <p v-else class="mt-2 text-sm text-gray-500">
            Tidak ada perubahan status yang tersedia.
          </p>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section class="space-y-6 xl:col-span-2">
          <div class="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 class="font-semibold text-gray-900">Item Pesanan</h3>

            <div class="mt-5 divide-y divide-gray-100">
              <div
                v-for="item in order.order_items || []"
                :key="item.id"
                class="flex items-start justify-between gap-4 py-4 first:pt-0"
              >
                <div>
                  <p class="font-semibold text-gray-900">
                    {{ item.menu_name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ item.quantity }} × {{ formatPrice(item.price) }}
                  </p>
                </div>

                <p class="font-semibold text-gray-900">
                  {{ formatPrice(item.subtotal) }}
                </p>
              </div>
            </div>

            <div class="mt-4 space-y-3 border-t border-gray-100 pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-medium">{{ formatPrice(order.subtotal) }}</span>
              </div>

              <div class="flex justify-between border-t border-gray-100 pt-3">
                <span class="font-semibold text-gray-900">Total</span>
                <span class="text-lg font-bold text-orange-600">
                  {{ formatPrice(order.total) }}
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 class="font-semibold text-gray-900">Informasi Pengiriman</h3>

            <div class="mt-4 space-y-3 text-sm">
              <div>
                <p class="text-gray-500">Tanggal Pengiriman</p>
                <p class="mt-1 font-medium text-gray-900">
                  {{ formatDate(order.delivery_date) }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Alamat Pengiriman</p>
                <p class="mt-1 font-medium text-gray-900">
                  {{ order.delivery_address }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Catatan Customer</p>
                <p class="mt-1 text-gray-900">
                  {{ order.notes || 'Tidak ada catatan.' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 class="font-semibold text-gray-900">Informasi Customer</h3>

            <div class="mt-4 space-y-3 text-sm">
              <div>
                <p class="text-gray-500">Nama</p>
                <p class="mt-1 font-medium text-gray-900">
                  {{ order.customer_profile?.full_name || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Email</p>
                <p class="mt-1 font-medium text-gray-900">
                  {{ order.customer_profile?.email || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Telepon</p>
                <p class="mt-1 font-medium text-gray-900">
                  {{ order.customer_profile?.phone || '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 class="font-semibold text-gray-900">Invoice</h3>

            <template v-if="order.invoice">
              <p class="mt-3 text-xs text-gray-500">Nomor Invoice</p>
              <p class="mt-1 font-semibold text-gray-900">
                {{ order.invoice.invoice_number }}
              </p>

              <p class="mt-3 text-xs text-gray-500">Tanggal Invoice</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ formatDate(order.invoice.invoice_date) }}
              </p>

              <button
                type="button"
                class="mt-5 w-full rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                @click="router.push({
                  name: 'merchant-invoices',
                  query: { invoice: order.invoice.id },
                })"
              >
                Lihat Invoice
              </button>
            </template>

            <p v-else class="mt-3 text-sm text-gray-500">
              Invoice belum tersedia.
            </p>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

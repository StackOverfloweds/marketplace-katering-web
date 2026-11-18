
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MerchantOrderService from '../services/MerchantOrderService'

const router = useRouter()

const orders = ref([])
const loading = ref(false)
const errorMessage = ref('')

const search = ref('')
const selectedStatus = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
})

const statusOptions = [
  { value: 'pending', label: 'Menunggu Konfirmasi' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'preparing', label: 'Sedang Diproses' },
  { value: 'ready', label: 'Siap Dikirim' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const keyword = search.value.trim().toLowerCase()

    const matchesSearch =
      !keyword ||
      order.order_number?.toLowerCase().includes(keyword) ||
      order.customer_profile?.full_name?.toLowerCase().includes(keyword)

    const matchesStatus =
      !selectedStatus.value || order.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const statusLabel = (status) => {
  return statusOptions.find((item) => item.value === status)?.label || status
}

const statusClass = (status) => {
  const classes = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    preparing: 'bg-indigo-50 text-indigo-700',
    ready: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }

  return classes[status] || 'bg-gray-100 text-gray-600'
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
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

/**
 * Mengambil daftar pesanan merchant.
 * @param {number} page
 */
const fetchOrders = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantOrderService.getOrders({
      per_page: pagination.value.per_page,
      page,
    })

    orders.value = response.data?.data || []

    pagination.value = {
      current_page: response.data?.current_page || 1,
      last_page: response.data?.last_page || 1,
      total: response.data?.total || 0,
      per_page: response.data?.per_page || 15,
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil daftar pesanan.'
  } finally {
    loading.value = false
  }
}

/**
 * Membuka halaman detail pesanan.
 * @param {string} id
 */
const openDetail = (id) => {
  router.push({
    name: 'merchant-order-detail',
    params: { orderId: id },
  })
}

/**
 * Mengganti halaman daftar pesanan.
 * @param {number} page
 */
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return

  fetchOrders(page)
}

onMounted(() => fetchOrders())
</script>

<template>
  <div class="space-y-6">
    <section>
      <h1 class="text-2xl font-bold text-gray-900">Pesanan Masuk</h1>
      <p class="mt-1 text-sm text-gray-500">
        Kelola pesanan customer dan pantau proses pengerjaannya.
      </p>
    </section>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Total Pesanan</p>
        <p class="mt-2 text-2xl font-bold text-gray-900">
          {{ pagination.total }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Pending (halaman ini)</p>
        <p class="mt-2 text-2xl font-bold text-amber-600">
          {{ orders.filter(item => item.status === 'pending').length }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Selesai (halaman ini)</p>
        <p class="mt-2 text-2xl font-bold text-green-600">
          {{ orders.filter(item => item.status === 'completed').length }}
        </p>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-200 bg-white p-5">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          v-model="search"
          type="search"
          placeholder="Cari nomor pesanan atau customer..."
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        />

        <select
          v-model="selectedStatus"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="">Semua status</option>
          <option
            v-for="status in statusOptions"
            :key="status.value"
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>

        <button
          type="button"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          @click="search = ''; selectedStatus = ''"
        >
          Reset Filter
        </button>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div class="border-b border-gray-100 p-5">
        <h2 class="font-semibold text-gray-900">Daftar Pesanan</h2>
        <p class="mt-1 text-xs text-gray-500">
          {{ filteredOrders.length }} pesanan pada halaman ini
        </p>
      </div>

      <div v-if="loading" class="p-12 text-center text-sm text-gray-500">
        Memuat pesanan...
      </div>

      <div
        v-else-if="filteredOrders.length === 0"
        class="p-12 text-center"
      >
        <div class="text-4xl">📦</div>
        <p class="mt-3 font-medium text-gray-800">
          Pesanan tidak ditemukan
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Pesanan customer akan muncul di halaman ini.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[800px] text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-5 py-4">Nomor Pesanan</th>
              <th class="px-5 py-4">Customer</th>
              <th class="px-5 py-4">Pengiriman</th>
              <th class="px-5 py-4">Total</th>
              <th class="px-5 py-4">Status</th>
              <th class="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-5 py-4">
                <p class="font-semibold text-gray-900">
                  {{ order.order_number }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ formatDate(order.created_at) }}
                </p>
              </td>

              <td class="px-5 py-4">
                <p class="font-medium text-gray-800">
                  {{ order.customer_profile?.full_name || '-' }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ order.customer_profile?.phone || '-' }}
                </p>
              </td>

              <td class="px-5 py-4 text-gray-600">
                {{ formatDate(order.delivery_date) }}
              </td>

              <td class="px-5 py-4 font-semibold text-gray-900">
                {{ formatPrice(order.total) }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
              </td>

              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="rounded-lg bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100"
                  @click="openDetail(order.id)"
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
  </div>
</template>

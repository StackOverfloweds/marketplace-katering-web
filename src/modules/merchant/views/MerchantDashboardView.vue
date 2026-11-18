
<script setup>
import { computed, onMounted, ref } from 'vue'
import MerchantOrderService from '@/modules/merchant/services/MerchantOrderService'
import MerchantMenuService from '@/modules/merchant/services/MerchantMenuService'

const orders = ref([])
const menus = ref([])

const loading = ref(true)
const errorMessage = ref('')

/**
 * Extract collection data from API response.
 *
 * Supports regular and Laravel paginated responses.
 *
 * @param {Object} response
 * @returns {Array}
 */
const extractCollection = (response) => {
  if (!response?.success) {
    throw new Error(response?.message || 'Gagal mengambil data.')
  }

  const result = response.data

  if (Array.isArray(result)) {
    return result
  }

  if (Array.isArray(result?.data)) {
    return result.data
  }

  return []
}

/**
 * Format currency into Indonesian Rupiah.
 *
 * @param {number|string} value
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
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Get merchant name from an order.
 *
 * @param {Object} order
 * @returns {string}
 */
const getCustomerName = (order) => {
  return order.customer_profile?.full_name ||
    order.customerProfile?.full_name ||
    order.customer_name ||
    'Customer'
}

/**
 * Load merchant dashboard data.
 */
const fetchDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const [orderResponse, menuResponse] = await Promise.all([
      MerchantOrderService.getOrders(),
      MerchantMenuService.getMyMenus(),
    ])

    orders.value = extractCollection(orderResponse)
    menus.value = extractCollection(menuResponse)
  } catch (error) {
    console.error('Fetch merchant dashboard error:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Gagal mengambil data dashboard.'
  } finally {
    loading.value = false
  }
}

/**
 * Count orders by status.
 */
const newOrdersCount = computed(() => {
  return orders.value.filter(
    (order) => order.status === 'pending',
  ).length
})

const processingOrdersCount = computed(() => {
  return orders.value.filter(
    (order) => ['confirmed', 'preparing'].includes(order.status),
  ).length
})

/**
 * Count available merchant menus.
 */
const activeMenusCount = computed(() => {
  return menus.value.filter(
    (menu) => menu.is_available === true || menu.is_available === 1,
  ).length
})

/**
 * Calculate revenue from completed orders only.
 */
const totalRevenue = computed(() => {
  return orders.value
    .filter((order) => order.status === 'completed')
    .reduce((total, order) => {
      return total + Number(order.total || 0)
    }, 0)
})

/**
 * Get latest merchant orders.
 */
const recentOrders = computed(() => {
  return [...orders.value]
    .sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
    .slice(0, 5)
})

/**
 * Calculate most ordered menus from order item snapshots.
 *
 * Cancelled orders are excluded.
 */
const bestSellingMenus = computed(() => {
  const menuMap = new Map()

  orders.value
    .filter((order) => order.status !== 'cancelled')
    .forEach((order) => {
      const orderItems = order.order_items || order.orderItems || []

      orderItems.forEach((item) => {
        const menuId = item.menu_id || item.menuId || item.menu_name

        if (!menuId) return

        const existing = menuMap.get(menuId) || {
          id: menuId,
          name: item.menu_name || item.name || 'Menu',
          quantity: 0,
          totalOrders: 0,
        }

        existing.quantity += Number(item.quantity || 0)
        existing.totalOrders += 1

        menuMap.set(menuId, existing)
      })
    })

  return [...menuMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
})

const statistics = computed(() => [
  {
    label: 'Pesanan Baru',
    value: newOrdersCount.value,
    description: 'Menunggu konfirmasi',
    icon: '🛍',
  },
  {
    label: 'Pesanan Diproses',
    value: processingOrdersCount.value,
    description: 'Sedang dikerjakan',
    icon: '⏳',
  },
  {
    label: 'Menu Aktif',
    value: activeMenusCount.value,
    description: 'Menu tersedia',
    icon: '🍱',
  },
  {
    label: 'Total Pendapatan',
    value: formatCurrency(totalRevenue.value),
    description: 'Total pesanan selesai',
    icon: '💰',
  },
])

onMounted(fetchDashboard)
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <section>
      <h1 class="text-2xl font-bold text-gray-900">
        Dashboard
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        Pantau aktivitas dan performa usaha katering Anda.
      </p>
    </section>

    <!-- Loading -->
    <div
      v-if="loading"
      class="rounded-2xl border border-gray-200 bg-white p-8 text-center"
    >
      <p class="text-sm text-gray-500">
        Memuat data dashboard...
      </p>
    </div>

    <!-- Error -->
    <div
      v-else-if="errorMessage"
      class="rounded-2xl border border-red-200 bg-red-50 p-5"
    >
      <p class="text-sm text-red-700">
        {{ errorMessage }}
      </p>

      <button
        type="button"
        @click="fetchDashboard"
        class="mt-3 text-sm font-semibold text-red-700 underline"
      >
        Coba lagi
      </button>
    </div>

    <template v-else>
      <!-- Statistics -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in statistics"
          :key="item.label"
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">
              {{ item.label }}
            </p>

            <span class="text-2xl">
              {{ item.icon }}
            </span>
          </div>

          <p class="mt-4 text-2xl font-bold text-gray-900">
            {{ item.value }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            {{ item.description }}
          </p>
        </div>
      </section>

      <!-- Recent Orders and Best Selling Menus -->
      <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <!-- Recent Orders -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-gray-900">
                Pesanan Terbaru
              </h2>

              <p class="mt-1 text-sm text-gray-500">
                Ringkasan pesanan yang masuk ke usaha Anda.
              </p>
            </div>

            <RouterLink
              :to="{ name: 'merchant-orders' }"
              class="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Lihat semua
            </RouterLink>
          </div>

          <div
            v-if="recentOrders.length === 0"
            class="py-14 text-center"
          >
            <div class="text-4xl">📦</div>

            <p class="mt-3 text-sm font-medium text-gray-700">
              Belum ada data pesanan
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Pesanan terbaru akan ditampilkan di sini.
            </p>
          </div>

          <div v-else class="mt-5 divide-y divide-gray-100">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-gray-900">
                  {{ order.order_number }}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  {{ getCustomerName(order) }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">
                  {{ formatCurrency(order.total) }}
                </p>

                <span
                  class="mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="{
                    'bg-yellow-50 text-yellow-700': order.status === 'pending',
                    'bg-blue-50 text-blue-700': order.status === 'confirmed',
                    'bg-indigo-50 text-indigo-700': order.status === 'preparing',
                    'bg-purple-50 text-purple-700': order.status === 'ready',
                    'bg-green-50 text-green-700': order.status === 'completed',
                    'bg-red-50 text-red-700': order.status === 'cancelled',
                  }"
                >
                  {{ order.status }}
                </span>
              </div>

              <RouterLink
                :to="{
                  name: 'merchant-order-detail',
                  params: { orderId: order.id },
                }"
                class="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Detail
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Best Selling Menus -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 class="font-semibold text-gray-900">
            Menu Terlaris
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Menu berdasarkan jumlah item yang dipesan.
          </p>

          <div
            v-if="bestSellingMenus.length === 0"
            class="py-14 text-center"
          >
            <div class="text-4xl">🍽️</div>

            <p class="mt-3 text-sm font-medium text-gray-700">
              Belum ada data menu
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Data menu terlaris akan ditampilkan di sini.
            </p>
          </div>

          <div v-else class="mt-5 space-y-4">
            <div
              v-for="(menu, index) in bestSellingMenus"
              :key="menu.id"
              class="flex items-center justify-between gap-3"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-bold text-orange-600"
                >
                  {{ index + 1 }}
                </div>

                <p class="truncate text-sm font-medium text-gray-800">
                  {{ menu.name }}
                </p>
              </div>

              <span class="shrink-0 text-xs font-semibold text-gray-500">
                {{ menu.quantity }} terjual
              </span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

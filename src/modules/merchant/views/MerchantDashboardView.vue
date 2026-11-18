
<script setup>
const statistics = [
  {
    label: 'Pesanan Baru',
    value: '0',
    description: 'Menunggu konfirmasi',
    icon: '🛍',
  },
  {
    label: 'Pesanan Diproses',
    value: '0',
    description: 'Sedang dikerjakan',
    icon: '⏳',
  },
  {
    label: 'Menu Aktif',
    value: '0',
    description: 'Menu tersedia',
    icon: '🍱',
  },
  {
    label: 'Total Pendapatan',
    value: 'Rp 0',
    description: 'Total pesanan selesai',
    icon: '💰',
  },
]
</script>

<template>
  <div class="space-y-8">
    <section>
      <h1 class="text-2xl font-bold text-gray-900">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Pantau aktivitas dan performa usaha katering Anda.
      </p>
    </section>

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
          <span class="text-2xl">{{ item.icon }}</span>
        </div>

        <p class="mt-4 text-2xl font-bold text-gray-900">
          {{ item.value }}
        </p>

        <p class="mt-1 text-xs text-gray-400">
          {{ item.description }}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-900">Pesanan Terbaru</h2>
            <p class="mt-1 text-sm text-gray-500">
              Ringkasan pesanan yang masuk ke usaha Anda.
            </p>
          </div>

          <RouterLink
            to="/merchant/orders"
            class="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Lihat semua
          </RouterLink>
        </div>

        <div class="py-14 text-center">
          <div class="text-4xl">📦</div>
          <p class="mt-3 text-sm font-medium text-gray-700">
            Belum ada data pesanan
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Pesanan terbaru akan ditampilkan di sini.
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 class="font-semibold text-gray-900">Menu Terlaris</h2>
        <p class="mt-1 text-sm text-gray-500">
          Menu dengan jumlah pesanan tertinggi.
        </p>

        <div class="py-14 text-center">
          <div class="text-4xl">🍽️</div>
          <p class="mt-3 text-sm font-medium text-gray-700">
            Belum ada data menu
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Data menu terlaris akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  {
    label: 'Dashboard',
    path: '/merchant/dashboard',
    icon: '▦',
  },
  {
    label: 'Kategori Menu',
    path: '/merchant/categories',
    icon: '▤',
  },
  {
    label: 'Menu Catering',
    path: '/merchant/menus',
    icon: '☷',
  },
  {
    label: 'Pesanan Masuk',
    path: '/merchant/orders',
    icon: '🛍',
  },
  {
    label: 'Invoice',
    path: '/merchant/invoices',
    icon: '▧',
  },
  {
    label: 'Profil Usaha',
    path: '/merchant/profile',
    icon: '♙',
  },
]

const isActive = (path) => {
  if (path === '/merchant/dashboard') {
    return route.path === path
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <aside class="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
    <div class="flex h-20 items-center gap-3 border-b border-gray-100 px-6">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
        🍱
      </div>

      <div>
        <h1 class="text-base font-bold text-gray-900">Katering</h1>
        <p class="text-xs text-gray-500">Merchant Panel</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6">
      <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Menu Utama
      </p>

      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
        :class="
          isActive(item.path)
            ? 'bg-orange-50 text-orange-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <span class="w-5 text-center text-lg">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-gray-100 p-4">
      <p class="text-xs text-gray-400">
        Marketplace Katering
      </p>
      <p class="mt-1 text-xs font-medium text-gray-600">
        Merchant Management
      </p>
    </div>
  </aside>
</template>

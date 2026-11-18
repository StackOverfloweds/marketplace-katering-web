
<script setup>
import { ref } from 'vue'
import MerchantSidebar from '../components/MerchantSidebar.vue'
import MerchantHeader from '../components/MerchantHeader.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block">
      <MerchantSidebar />
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-50 lg:hidden">
      <div
        class="absolute inset-0 bg-black/40"
        @click="sidebarOpen = false"
      />

      <div class="relative h-full w-64">
        <button
          class="absolute right-3 top-4 z-10 rounded-lg bg-white px-3 py-1 text-gray-600"
          @click="sidebarOpen = false"
        >
          ✕
        </button>

        <MerchantSidebar />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-center border-b border-gray-200 bg-white lg:hidden">
        <button
          class="px-5 py-4 text-xl text-gray-700"
          aria-label="Buka menu navigasi"
          @click="sidebarOpen = true"
        >
          ☰
        </button>

        <span class="text-sm font-semibold text-gray-900">
          Merchant Panel
        </span>
      </div>

      <MerchantHeader />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

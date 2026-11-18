<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-900">
        Merchant Dashboard
      </h1>

      <p class="mt-2 text-gray-500">
        Selamat datang, {{ authStore.user?.profile?.company_name || authStore.user?.profile?.full_name }}.
      </p>

      <p class="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-5 text-orange-700">
        Halaman pengelolaan merchant akan dikembangkan pada tahap berikutnya.
      </p>
    </div>
  </main>
</template>
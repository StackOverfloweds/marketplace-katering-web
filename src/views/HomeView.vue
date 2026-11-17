
<script setup>
const appName = import.meta.env.VITE_APP_NAME
const apiUrl = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 p-6">
    <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">

      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl text-white">
          🍱
        </div>

        <div>
          <h1 class="text-xl font-bold text-slate-800">
            {{ appName }}
          </h1>

          <p class="text-sm text-slate-500">
            Catering Marketplace
          </p>
        </div>
      </div>

      <div class="rounded-xl bg-green-50 p-4">
        <p class="font-semibold text-green-700">
          Vue Router berhasil berjalan!
        </p>

        <p class="mt-1 text-sm text-green-600">
          Vue 3 + Vite + JavaScript + Tailwind CSS
        </p>
      </div>

      <div class="mt-6">
        <p class="text-xs font-semibold uppercase text-slate-400">
          Backend API
        </p>

        <p class="mt-1 break-all text-sm text-slate-700">
          {{ apiUrl }}
        </p>
      </div>

    </div>
  </main>
</template>

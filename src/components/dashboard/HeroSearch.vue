
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const search = ref('')
const location = ref('')

/**
 * Submit merchant search.
 */
const handleSearch = () => {
  emit('search', {
    search: search.value.trim(),
    location: location.value.trim(),
  })
}

/**
 * Reset search filters.
 */
const handleReset = () => {
  search.value = ''
  location.value = ''

  emit('search', {
    search: '',
    location: '',
  })
}
</script>

<template>
  <section class="relative overflow-hidden bg-orange-50">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <div class="max-w-2xl">
        <span class="inline-flex rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold text-orange-600">
          Marketplace Katering Indonesia
        </span>

        <h1 class="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          Temukan Katering
          <span class="text-orange-500">Favoritmu.</span>
        </h1>

        <p class="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
          Temukan berbagai pilihan katering berdasarkan nama makanan,
          jenis katering, nama usaha, maupun lokasi.
        </p>

        <!-- Search Form -->
        <form
          class="mt-7 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
          @submit.prevent="handleSearch"
        >

          <!-- Keyword -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-800">
              Cari katering atau jenis makanan
            </label>

            <div class="flex items-center rounded-xl bg-gray-50 px-4 transition focus-within:ring-2 focus-within:ring-orange-300">
              <span class="mr-3 text-gray-400">🔍</span>

              <input
                v-model="search"
                type="search"
                placeholder="Contoh: Nasi Box, Ayam Geprek, Catering..."
                class="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            <p class="mt-1.5 text-xs text-gray-400">
              Cari berdasarkan nama menu, kategori, atau nama katering.
            </p>
          </div>

          <!-- Location -->
          <div class="mt-4">
            <label class="mb-2 block text-sm font-semibold text-gray-800">
              Lokasi katering
            </label>

            <div class="flex items-center rounded-xl bg-gray-50 px-4 transition focus-within:ring-2 focus-within:ring-orange-300">
              <span class="mr-3 text-gray-400">📍</span>

              <input
                v-model="location"
                type="text"
                placeholder="Contoh: Samarinda, Balikpapan..."
                class="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-5 flex gap-3">
            <button
              type="submit"
              class="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Cari Katering
            </button>

            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              @click="handleReset"
            >
              Reset
            </button>
          </div>

        </form>

        <!-- Search Suggestions -->
        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
          <span>✓ Banyak pilihan katering</span>
          <span>✓ Mudah menemukan menu</span>
          <span>✓ Pemesanan online</span>
        </div>
      </div>
    </div>
  </section>
</template>

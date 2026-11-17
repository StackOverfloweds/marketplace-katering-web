
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const keyword = ref('')
const location = ref('')

const submitSearch = () => {
  emit('search', {
    search: keyword.value.trim(),
    location: location.value.trim(),
  })
}

const clearSearch = () => {
  keyword.value = ''
  location.value = ''

  submitSearch()
}
</script>

<template>
  <section id="home" class="relative overflow-hidden bg-orange-50">
    <div class="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"></div>

    <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

      <div>
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold text-orange-700">
          <span class="h-2 w-2 rounded-full bg-orange-500"></span>
          Marketplace Katering Indonesia
        </div>

        <h1 class="max-w-xl text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Temukan Katering
          <span class="text-orange-500">Favoritmu.</span>
        </h1>

        <p class="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
          Temukan berbagai pilihan katering untuk kebutuhan harian,
          acara keluarga, kantor, hingga kebutuhan perusahaan.
        </p>

        <div class="mt-8 rounded-2xl border border-orange-100 bg-white p-3 shadow-xl shadow-orange-900/5 sm:p-4">
          <form @submit.prevent="submitSearch" class="space-y-3">
            <div>
              <label for="food-search" class="mb-2 block text-xs font-bold text-slate-700">
                Cari katering atau jenis makanan
              </label>

              <div class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-100 transition focus-within:ring-2 focus-within:ring-orange-400">
                <svg class="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" stroke-width="1.8"/>
                  <path d="m16 16 4 4" stroke-width="1.8" stroke-linecap="round"/>
                </svg>

                <input
                  id="food-search"
                  v-model="keyword"
                  type="search"
                  placeholder="Contoh: Nasi box, ayam bakar..."
                  class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label for="location-search" class="mb-2 block text-xs font-bold text-slate-700">
                Lokasi katering
              </label>

              <div class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-100 transition focus-within:ring-2 focus-within:ring-orange-400">
                <svg class="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke-width="1.8"/>
                  <circle cx="12" cy="10" r="2.5" stroke-width="1.8"/>
                </svg>

                <input
                  id="location-search"
                  v-model="location"
                  type="search"
                  placeholder="Contoh: Samarinda, Balikpapan..."
                  class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 pt-1 sm:flex-row">
              <button
                type="submit"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
              >
                Cari Katering
              </button>

              <button
                type="button"
                @click="clearSearch"
                class="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span>✓ Banyak pilihan katering</span>
          <span>✓ Mudah menemukan menu</span>
          <span>✓ Pemesanan online</span>
        </div>
      </div>

      <div class="relative hidden lg:block">
        <div class="absolute -left-8 top-10 z-10 rounded-2xl border border-white bg-white p-4 shadow-xl">
          <p class="text-xs text-slate-500">Pilihan makanan</p>
          <p class="mt-1 font-bold text-slate-900">Untuk semua kebutuhan</p>
          <p class="mt-1 text-xs text-orange-500">Harian hingga acara besar</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4 pt-12">
            <div class="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-200 to-amber-100 text-8xl shadow-lg">
              🍱
            </div>

            <div class="flex aspect-square items-center justify-center rounded-[2rem] bg-gradient-to-br from-green-200 to-emerald-100 text-7xl shadow-lg">
              🥗
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex aspect-square items-center justify-center rounded-[2rem] bg-gradient-to-br from-yellow-200 to-orange-100 text-7xl shadow-lg">
              🍗
            </div>

            <div class="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-gradient-to-br from-pink-200 to-rose-100 text-8xl shadow-lg">
              🍰
            </div>
          </div>
        </div>

        <div class="absolute -bottom-5 right-5 rounded-2xl border border-white bg-white px-5 py-3 shadow-xl">
          <p class="text-xs text-slate-500">Temukan pilihanmu</p>
          <p class="font-bold text-slate-900">Satu tempat, banyak katering.</p>
        </div>
      </div>
    </div>
  </section>
</template>

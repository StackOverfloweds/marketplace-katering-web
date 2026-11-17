
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenuOpen = ref(false)

const goTo = (section) => {
  mobileMenuOpen.value = false

  if (router.currentRoute.value.path !== '/') {
    router.push({ path: '/', hash: `#${section}` })
    return
  }

  document.getElementById(section)?.scrollIntoView({
    behavior: 'smooth',
  })
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

      <RouterLink to="/" class="flex items-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
          🍱
        </div>

        <span class="text-xl font-extrabold tracking-tight text-slate-900">
          Katering<span class="text-orange-500">Ku</span>
        </span>
      </RouterLink>

      <div class="hidden items-center gap-8 md:flex">
        <button @click="goTo('home')" class="text-sm font-medium text-slate-600 transition hover:text-orange-500">
          Beranda
        </button>

        <button @click="goTo('categories')" class="text-sm font-medium text-slate-600 transition hover:text-orange-500">
          Kategori
        </button>

        <button @click="goTo('merchants')" class="text-sm font-medium text-slate-600 transition hover:text-orange-500">
          Katering
        </button>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <RouterLink
          to="/login"
          class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Masuk
        </RouterLink>

        <RouterLink
          to="/register"
          class="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          Daftar
        </RouterLink>
      </div>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <div v-if="mobileMenuOpen" class="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
      <div class="flex flex-col gap-2">
        <button @click="goTo('home')" class="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
          Beranda
        </button>

        <button @click="goTo('categories')" class="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
          Kategori
        </button>

        <button @click="goTo('merchants')" class="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
          Katering
        </button>

        <div class="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          <RouterLink to="/login" class="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
            Masuk
          </RouterLink>

          <RouterLink to="/register" class="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white">
            Daftar
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

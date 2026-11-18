
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * Return visitor to the requested page after authentication.
 */
const handleLoginPlaceholder = () => {
  const redirect = route.query.redirect

  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    router.push(redirect)
    return
  }

  router.push('/')
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-orange-900/5">
      <RouterLink to="/" class="flex items-center justify-center gap-2">
        <span class="text-3xl">🍱</span>
        <span class="text-xl font-extrabold text-slate-900">
          Katering<span class="text-orange-500">Ku</span>
        </span>
      </RouterLink>

      <div class="mt-8 text-center">
        <h1 class="text-2xl font-extrabold text-slate-900">
          Selamat Datang
        </h1>

        <p class="mt-2 text-sm text-slate-500">
          Silakan masuk untuk melanjutkan pemesanan.
        </p>
      </div>

      <div class="mt-7 space-y-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Username
          </label>

          <input
            type="text"
            placeholder="Masukkan username"
            disabled
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Masukkan password"
            disabled
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </div>

        <div class="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
          Halaman ini masih berupa placeholder. Authentication API akan
          diintegrasikan pada tahap berikutnya.
        </div>

        <button
          @click="handleLoginPlaceholder"
          class="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Kembali ke halaman sebelumnya
        </button>
      </div>

      <p class="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?
        <RouterLink to="/register" class="font-bold text-orange-500">
          Daftar sekarang
        </RouterLink>
      </p>
    </div>
  </main>
</template>

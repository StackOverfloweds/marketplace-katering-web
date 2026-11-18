
<template>
    <footer class="bg-slate-950 text-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
  
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
  
          <div class="sm:col-span-2">
            <RouterLink to="/" class="inline-flex items-center gap-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
                🍱
              </div>
  
              <span class="text-xl font-extrabold">
                Katering<span class="text-orange-400">Ku</span>
              </span>
            </RouterLink>
  
            <p class="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Temukan berbagai pilihan katering untuk kebutuhan harian,
              acara keluarga, kantor, dan berbagai kegiatan lainnya.
            </p>
          </div>
  
          <div>
            <h3 class="font-bold">Navigasi</h3>
  
            <ul class="mt-4 space-y-3 text-sm text-slate-400">
              <li><RouterLink to="/" class="hover:text-orange-400">Beranda</RouterLink></li>
              <li><RouterLink to="/login" class="hover:text-orange-400">Masuk</RouterLink></li>
              <li><RouterLink to="/register" class="hover:text-orange-400">Daftar</RouterLink></li>
            </ul>
          </div>
  
          <div>
            <h3 class="font-bold">Informasi</h3>
  
            <ul class="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href="#" class="hover:text-orange-400">Tentang Kami</a></li>
              <li><a href="#" class="hover:text-orange-400">Cara Pemesanan</a></li>
              <li><a href="#" class="hover:text-orange-400">Bantuan</a></li>
            </ul>
          </div>
        </div>
  
        <div class="mt-10 border-t border-slate-800 pt-6">
          <p class="text-center text-xs text-slate-500">
            © {{ new Date().getFullYear() }} KateringKu. All rights reserved.
          </p>
        </div>
  
      </div>
    </footer>
  </template>
  
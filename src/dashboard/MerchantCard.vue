
<script setup>
import FormatHelper from '@/helpers/FormatHelper'

defineProps({
  merchant: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'order'])
</script>

<template>
  <article class="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">

    <div class="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-48" :class="merchant.color">
      <span class="text-7xl transition duration-300 group-hover:scale-110 sm:text-8xl">
        {{ merchant.image }}
      </span>

      <span
        v-if="merchant.isFeatured"
        class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-orange-600 shadow-sm"
      >
        REKOMENDASI
      </span>

      <span class="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
        ⭐ {{ merchant.rating }}
      </span>
    </div>

    <div class="p-4 sm:p-5">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h3 class="truncate text-base font-bold text-slate-900 sm:text-lg">
            {{ merchant.name }}
          </h3>

          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke-width="1.8"/>
              <circle cx="12" cy="10" r="2.5" stroke-width="1.8"/>
            </svg>
            {{ merchant.city }}
          </p>
        </div>
      </div>

      <p class="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 sm:text-sm">
        {{ merchant.description }}
      </p>

      <div class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="category in merchant.categories"
          :key="category"
          class="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700"
        >
          {{ category }}
        </span>
      </div>

      <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p class="text-[10px] text-slate-400">Mulai dari</p>
          <p class="text-sm font-extrabold text-slate-900">
            {{ FormatHelper.currency(merchant.minimumPrice) }}
          </p>
        </div>

        <span class="text-[10px] text-slate-400">
          {{ merchant.totalOrders }} pesanan
        </span>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          @click="$emit('view', merchant)"
          class="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
        >
          Lihat Etalase
        </button>

        <button
          @click="$emit('order', merchant)"
          class="rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
        >
          Pesan
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  computed: {
    FormatHelper() {
      return FormatHelper
    },
  },
}
</script>

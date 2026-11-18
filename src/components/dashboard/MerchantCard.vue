
<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import MenuImage from '@/components/common/MenuImage.vue'

const props = defineProps({
  merchant: {
    type: Object,
    required: true,
  },
})

const logoError = ref(false)

/**
 * Get merchant categories safely.
 */
const categories = computed(() => {
  return Array.isArray(props.merchant.categories)
    ? props.merchant.categories
    : []
})

/**
 * Get merchant menus safely.
 */
const menus = computed(() => {
  return Array.isArray(props.merchant.menus)
    ? props.merchant.menus.slice(0, 3)
    : []
})

/**
 * Format price to Indonesian Rupiah.
 *
 * @param {number|string} price
 * @returns {string}
 */
const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0)
}

/**
 * Reset logo error when logo source changes.
 */
watch(
  () => props.merchant.logo,
  () => {
    logoError.value = false
  },
)
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
  >

    <!-- Merchant Information -->
    <div class="p-5">
      <div class="flex items-start gap-3">

        <!-- Merchant Logo -->
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50"
        >
          <img
            v-if="merchant.logo && !logoError"
            :src="merchant.logo"
            :alt="merchant.company_name || merchant.full_name"
            class="h-full w-full object-cover"
            @error="logoError = true"
          />

          <!-- Default Merchant Icon -->
          <svg
            v-else
            class="h-8 w-8 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 10h18l-1.5-6h-15L3 10Z"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 10v10h14V10M9 20v-6h6v6"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"
            />
          </svg>
        </div>

        <!-- Merchant Details -->
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-lg font-bold text-gray-900">
            {{ merchant.company_name || merchant.full_name }}
          </h3>

          <!-- Location -->
          <p class="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <svg
              class="h-4 w-4 shrink-0 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
              />

              <circle cx="12" cy="10" r="2.5" />
            </svg>

            <span>
              {{ merchant.city || 'Lokasi belum tersedia' }}
            </span>
          </p>

          <!-- Merchant Statistics -->
          <p class="mt-1 text-xs text-gray-400">
            {{ merchant.active_categories_count || categories.length }} kategori
            ·
            {{ merchant.available_menus_count || menus.length }} menu
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="mt-3 line-clamp-2 text-sm text-gray-500">
        {{ merchant.description || 'Penyedia layanan katering.' }}
      </p>

      <!-- Categories -->
      <div
        v-if="categories.length"
        class="mt-3 flex flex-wrap gap-2"
      >
        <span
          v-for="category in categories"
          :key="category.id"
          class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
        >
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- Menu Photos -->
    <div class="border-t border-gray-100 p-5">
      <h4 class="mb-3 text-sm font-semibold text-gray-800">
        Menu Pilihan
      </h4>

      <div
        v-if="menus.length"
        class="grid grid-cols-3 gap-3"
      >
        <div
          v-for="menu in menus"
          :key="menu.id"
          class="min-w-0"
        >
          <MenuImage
            :src="menu.photo_url"
            :alt="menu.name"
          />

          <p class="mt-2 truncate text-xs font-medium text-gray-700">
            {{ menu.name }}
          </p>

          <p class="mt-1 text-xs font-semibold text-orange-600">
            {{ formatCurrency(menu.price) }}
          </p>
        </div>
      </div>

      <!-- Empty Menu -->
      <div
        v-else
        class="rounded-xl bg-gray-50 py-6 text-center"
      >
        <svg
          class="mx-auto h-9 w-9 text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h18v18H3zM8 3v18M16 3v18M3 8h18M3 16h18"
          />
        </svg>

        <p class="mt-2 text-xs text-gray-400">
          Belum ada menu ditampilkan
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-100 p-5">
      <RouterLink
        :to="{
          name: 'merchant-detail',
          params: {
            merchantId: merchant.id,
          },
        }"
        class="block w-full rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
      >
        Lihat Catering
      </RouterLink>
    </div>

  </article>
</template>


<script setup>
import MenuImage from '@/components/common/MenuImage.vue'
import FormatHelper from '@/helpers/FormatHelper'
import { RouterLink } from 'vue-router'
defineProps({
  merchant: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

    <!-- Merchant Information -->
    <div class="p-5">
      <div class="flex items-start gap-3">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">
          <img
            v-if="merchant.logo"
            :src="merchant.logo"
            :alt="merchant.company_name"
            class="h-full w-full object-cover"
          />

          <span v-else class="text-2xl">🏪</span>
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="truncate text-lg font-bold text-gray-900">
            {{ merchant.company_name || merchant.full_name }}
          </h3>

          <p class="mt-1 text-sm text-gray-500">
            📍 {{ merchant.city || 'Lokasi belum tersedia' }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            {{ merchant.active_categories_count }} kategori ·
            {{ merchant.available_menus_count }} menu
          </p>
        </div>
      </div>

      <p class="mt-3 line-clamp-2 text-sm text-gray-500">
        {{ merchant.description || 'Penyedia layanan katering.' }}
      </p>

      <!-- Categories -->
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="category in merchant.categories"
          :key="category.id"
          class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
        >
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- Menu Photos -->
    <div
      v-if="merchant.menus?.length"
      class="border-t border-gray-100 p-5"
    >
      <h4 class="mb-3 text-sm font-semibold text-gray-800">
        Menu Pilihan
      </h4>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="menu in merchant.menus"
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
            {{ FormatHelper.currency(menu.price) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-100 p-5">
      <RouterLink
        :to="{
          name: 'merchant-detail',
          params: { merchantId: merchant.id },
        }"
        class="block w-full rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Lihat Catering
      </RouterLink>
    </div>

  </article>
</template>

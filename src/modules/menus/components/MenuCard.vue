
<script setup>
import MenuImage from '@/components/common/MenuImage.vue'
import FormatHelper from '@/helpers/FormatHelper'

defineProps({
  menu: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
  >
    <MenuImage
      :src="menu.photo_url"
      :alt="menu.name"
    />

    <div class="p-4">
      <h3 class="font-semibold text-gray-900">
        {{ menu.name }}
      </h3>

      <p class="mt-1 line-clamp-2 text-sm text-gray-500">
        {{ menu.description }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="font-bold text-orange-600">
          {{ FormatHelper.currency(menu.price) }}
        </span>

        <span
          v-if="menu.is_available"
          class="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
        >
          Tersedia
        </span>

        <span
          v-else
          class="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
        >
          Habis
        </span>
      </div>
    </div>
  </article>
</template>

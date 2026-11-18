
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const profile = computed(() => authStore.user?.profile || {})

const merchantName = computed(() => {
  return profile.value.company_name || profile.value.full_name || 'Merchant'
})
</script>

<template>
  <header class="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
    <div>
      <h2 class="text-sm font-semibold text-gray-900 sm:text-base">
        Merchant Workspace
      </h2>
      <p class="hidden text-xs text-gray-500 sm:block">
        Kelola usaha katering Anda
      </p>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-gray-900">
          {{ merchantName }}
        </p>
        <p class="text-xs text-gray-500">Merchant</p>
      </div>

      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
        {{ merchantName.charAt(0).toUpperCase() }}
      </div>
    </div>
  </header>
</template>

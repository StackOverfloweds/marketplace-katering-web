<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'

const route = useRoute()

const isMerchantPage = computed(() => {
  return route.path.startsWith('/merchant')
})
</script>

<template>
  <Navbar v-if="!isMerchantPage" />
  <RouterView />
</template>
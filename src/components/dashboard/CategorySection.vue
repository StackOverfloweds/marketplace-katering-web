
<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: 'all',
  },
})

defineEmits(['select'])
</script>

<template>
  <section id="categories" class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-7 flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold tracking-widest text-orange-500 uppercase">
          Jelajahi pilihan
        </p>

        <h2 class="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Kategori Makanan
        </h2>

        <p class="mt-2 text-sm text-slate-500">
          Temukan katering sesuai makanan yang kamu inginkan.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="$emit('select', category.id)"
        class="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-3 text-center transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        :class="selectedCategory === category.id
          ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
          : 'border-slate-100 bg-white hover:border-orange-200'"
      >
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition group-hover:scale-110">
          {{ category.icon }}
        </span>

        <span
          class="text-xs font-semibold sm:text-sm"
          :class="selectedCategory === category.id ? 'text-orange-600' : 'text-slate-700'"
        >
          {{ category.name }}
        </span>
      </button>
    </div>
  </section>
</template>

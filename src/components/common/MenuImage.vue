
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    src: {
        type: String,
        default: null,
    },
    alt: {
        type: String,
        default: 'Foto menu',
    },
})

const hasError = ref(false)

/**
 * Reset status gambar ketika URL berubah.
 */
watch(
    () => props.src,
    () => {
        hasError.value = false
    }
)
</script>

<template>
    <div class="menu-image">
        <img
            v-if="src && src.trim() !== '' && !hasError"
            :src="src"
            :alt="alt"
            class="menu-image__photo"
            @error="hasError = true"
        />

        <div v-else class="menu-image__fallback">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
            </svg>

            <span>Foto belum tersedia</span>
        </div>
    </div>
</template>

<style scoped>
.menu-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 8px;
    background-color: #f3f4f6;
}

.menu-image__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.menu-image__fallback {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #9ca3af;
    background-color: #f3f4f6;
}

.menu-image__fallback span {
    font-size: 11px;
    text-align: center;
}
</style>

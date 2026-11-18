
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import MerchantMenuService from '../services/MerchantMenuService'
import MerchantCategoryService from '../services/MerchantCategoryService'

const menus = ref([])
const categories = ref([])

const loading = ref(false)
const saving = ref(false)
const deletingId = ref(null)

const showForm = ref(false)
const editingId = ref(null)

const searchInput = ref('')
const filters = reactive({
  search: '',
  category_id: '',
  is_available: '',
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 12,
})

const errorMessage = ref('')
const successMessage = ref('')

const selectedPhoto = ref(null)
const photoPreview = ref(null)
const existingPhoto = ref(null)
const photoInput = ref(null)

const form = reactive({
  category_id: '',
  name: '',
  description: '',
  price: '',
  is_available: true,
})

const activeCount = computed(() =>
  menus.value.filter((menu) => menu.is_available).length,
)

const inactiveCount = computed(() =>
  menus.value.filter((menu) => !menu.is_available).length,
)

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price || 0))
}

/**
 * Mengambil kategori aktif milik merchant.
 */
const fetchCategories = async () => {
  try {
    const response = await MerchantCategoryService.getMyCategories()
    categories.value = response.data || []
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil kategori.'
  }
}

/**
 * Mengambil daftar menu merchant.
 * @param {number} page
 */
const fetchMenus = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantMenuService.getMyMenus({
      search: filters.search || undefined,
      category_id: filters.category_id || undefined,
      is_available: filters.is_available === ''
        ? undefined
        : filters.is_available,
      per_page: pagination.per_page,
      page,
    })

    menus.value = response.data || []

    Object.assign(pagination, {
      current_page: response.meta?.current_page || 1,
      last_page: response.meta?.last_page || 1,
      total: response.meta?.total || 0,
      per_page: response.meta?.per_page || 12,
    })
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil daftar menu.'
  } finally {
    loading.value = false
  }
}

/**
 * Menjalankan pencarian menu.
 */
const handleSearch = () => {
  filters.search = searchInput.value.trim()
  fetchMenus(1)
}

/**
 * Mereset filter pencarian.
 */
const resetFilters = () => {
  searchInput.value = ''
  filters.search = ''
  filters.category_id = ''
  filters.is_available = ''

  fetchMenus(1)
}

/**
 * Mengganti halaman pagination.
 * @param {number} page
 */
const changePage = (page) => {
  if (page < 1 || page > pagination.last_page) return

  fetchMenus(page)
}

/**
 * Menghapus preview foto sementara.
 */
const clearPhotoPreview = () => {
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value)
  }

  photoPreview.value = null
  selectedPhoto.value = null
}

/**
 * Membersihkan seluruh form.
 */
const resetForm = () => {
  clearPhotoPreview()

  form.category_id = ''
  form.name = ''
  form.description = ''
  form.price = ''
  form.is_available = true

  editingId.value = null
  existingPhoto.value = null
}

/**
 * Membuka form tambah menu.
 */
const openCreateForm = () => {
  resetForm()
  errorMessage.value = ''
  successMessage.value = ''
  showForm.value = true
}

/**
 * Membuka form edit menu.
 * @param {Object} menu
 */
const openEditForm = (menu) => {
  resetForm()

  editingId.value = menu.id
  form.category_id = menu.category_id
  form.name = menu.name || ''
  form.description = menu.description || ''
  form.price = menu.price
  form.is_available = Boolean(menu.is_available)

  existingPhoto.value = menu.photo_url || null

  errorMessage.value = ''
  successMessage.value = ''
  showForm.value = true
}

/**
 * Menutup form.
 */
const closeForm = () => {
  showForm.value = false
  resetForm()
}

/**
 * Memilih foto menu dan membuat preview.
 * @param {Event} event
 */
const handlePhotoChange = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  errorMessage.value = ''

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Format foto harus JPG, PNG, atau WEBP.'
    event.target.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Ukuran foto maksimal 2 MB.'
    event.target.value = ''
    return
  }

  clearPhotoPreview()

  selectedPhoto.value = file
  photoPreview.value = URL.createObjectURL(file)
}

/**
 * Membuat payload FormData.
 * @returns {FormData}
 */
const buildPayload = () => {
  const payload = new FormData()

  payload.append('category_id', form.category_id)
  payload.append('name', form.name.trim())
  payload.append('description', form.description.trim())
  payload.append('price', String(form.price))
  payload.append('is_available', form.is_available ? '1' : '0')

  if (selectedPhoto.value) {
    payload.append('photo', selectedPhoto.value)
  }

  return payload
}

/**
 * Menyimpan menu baru atau memperbarui menu.
 */
const saveMenu = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.category_id) {
    errorMessage.value = 'Silakan pilih kategori menu.'
    return
  }

  if (!form.name.trim()) {
    errorMessage.value = 'Nama menu wajib diisi.'
    return
  }

  if (form.price === '' || Number(form.price) < 0 || !Number.isFinite(Number(form.price))) {
    errorMessage.value = 'Masukkan harga menu yang valid.'
    return
  }

  saving.value = true

  try {
    const payload = buildPayload()

    if (editingId.value) {
      await MerchantMenuService.updateMenu(editingId.value, payload)
      successMessage.value = 'Menu berhasil diperbarui.'
    } else {
      await MerchantMenuService.createMenu(payload)
      successMessage.value = 'Menu berhasil ditambahkan.'
    }

    closeForm()
    await fetchMenus(editingId.value ? pagination.current_page : 1)
  } catch (error) {
    const validationErrors = error.response?.data?.errors

    errorMessage.value = validationErrors
      ? Object.values(validationErrors).flat().join(' ')
      : error.response?.data?.message || 'Gagal menyimpan menu.'
  } finally {
    saving.value = false
  }
}

/**
 * Mengubah status ketersediaan menu.
 * @param {Object} menu
 */
const toggleAvailability = async (menu) => {
  errorMessage.value = ''
  successMessage.value = ''

  const payload = new FormData()
  payload.append('is_available', menu.is_available ? '0' : '1')

  try {
    await MerchantMenuService.updateMenu(menu.id, payload)

    successMessage.value = 'Ketersediaan menu berhasil diperbarui.'
    await fetchMenus(pagination.current_page)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengubah ketersediaan menu.'
  }
}

/**
 * Menghapus menu merchant.
 * @param {Object} menu
 */
const removeMenu = async (menu) => {
  const confirmed = window.confirm(
    `Apakah Anda yakin ingin menghapus menu "${menu.name}"?`,
  )

  if (!confirmed) return

  deletingId.value = menu.id
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await MerchantMenuService.deleteMenu(menu.id)

    successMessage.value = 'Menu berhasil dihapus.'

    const page = menus.value.length === 1 && pagination.current_page > 1
      ? pagination.current_page - 1
      : pagination.current_page

    await fetchMenus(page)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal menghapus menu.'
  } finally {
    deletingId.value = null
  }
}

/**
 * Mengubah URL foto relatif menjadi URL absolut backend.
 * @param {string|null} photoUrl
 * @returns {string|null}
 */
 const getPhotoUrl = (photoUrl) => {
  if (!photoUrl) return null

  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl
  }

  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const backendOrigin = new URL(apiUrl).origin

  return new URL(photoUrl, backendOrigin).href
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchMenus(),
  ])
})

onUnmounted(() => {
  clearPhotoPreview()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Heading -->
    <section class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Menu Catering
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola daftar menu, harga, kategori, dan ketersediaan.
        </p>
      </div>

      <button
        type="button"
        class="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        @click="openCreateForm"
      >
        + Tambah Menu
      </button>
    </section>

    <!-- Notifications -->
    <div
      v-if="successMessage"
      class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
    >
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage && !showForm"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <!-- Statistics -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Total Menu</p>
        <p class="mt-2 text-2xl font-bold text-gray-900">
          {{ pagination.total }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Menu Tersedia (halaman ini)</p>
        <p class="mt-2 text-2xl font-bold text-green-600">
          {{ activeCount }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Menu Tidak Tersedia (halaman ini)</p>
        <p class="mt-2 text-2xl font-bold text-gray-500">
          {{ inactiveCount }}
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="rounded-2xl border border-gray-200 bg-white p-5">
      <form
        class="grid grid-cols-1 gap-3 md:grid-cols-4"
        @submit.prevent="handleSearch"
      >
        <input
          v-model="searchInput"
          type="search"
          placeholder="Cari nama menu..."
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        />

        <select
          v-model="filters.category_id"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="">Semua kategori</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="filters.is_available"
          class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="">Semua ketersediaan</option>
          <option value="true">Tersedia</option>
          <option value="false">Tidak tersedia</option>
        </select>

        <div class="flex gap-2">
          <button
            type="submit"
            class="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Cari
          </button>

          <button
            type="button"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </form>
    </section>

    <!-- Menu List -->
    <section>
      <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Memuat daftar menu...
      </div>

      <div
        v-else-if="menus.length === 0"
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center"
      >
        <div class="text-5xl">🍱</div>
        <h2 class="mt-4 font-semibold text-gray-900">
          Belum ada menu
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Tambahkan menu catering pertama Anda.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="menu in menus"
          :key="menu.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div class="relative aspect-[16/10] bg-gray-100">
            <img
              v-if="menu.photo_url"
              :src="getPhotoUrl(menu.photo_url)"
              :alt="menu.name"
              class="h-full w-full object-cover"
            />

            <div
              v-else
              class="flex h-full items-center justify-center text-5xl"
            >
              🍽️
            </div>

            <span
              class="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold"
              :class="menu.is_available
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'"
            >
              {{ menu.is_available ? 'Tersedia' : 'Tidak tersedia' }}
            </span>
          </div>

          <div class="space-y-3 p-5">
            <div>
              <p class="text-xs font-medium text-orange-600">
                {{ menu.category?.name || 'Tanpa kategori' }}
              </p>

              <h3 class="mt-1 text-lg font-bold text-gray-900">
                {{ menu.name }}
              </h3>

              <p class="mt-1 line-clamp-2 text-sm text-gray-500">
                {{ menu.description || 'Tidak ada deskripsi.' }}
              </p>
            </div>

            <p class="text-lg font-bold text-gray-900">
              {{ formatPrice(menu.price) }}
            </p>

            <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                class="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                @click="openEditForm(menu)"
              >
                Edit
              </button>

              <button
                type="button"
                class="flex-1 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50"
                @click="toggleAvailability(menu)"
              >
                {{ menu.is_available ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>

              <button
                type="button"
                class="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                :disabled="deletingId === menu.id"
                @click="removeMenu(menu)"
              >
                {{ deletingId === menu.id ? '...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.last_page > 1"
        class="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
      >
        <p class="text-xs text-gray-500">
          Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="pagination.current_page <= 1"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
            @click="changePage(pagination.current_page - 1)"
          >
            Sebelumnya
          </button>

          <button
            type="button"
            :disabled="pagination.current_page >= pagination.last_page"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
            @click="changePage(pagination.current_page + 1)"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </section>

    <!-- Create / Edit Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      @click.self="closeForm"
    >
      <div class="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ editingId ? 'Edit Menu' : 'Tambah Menu' }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Lengkapi informasi menu catering.
            </p>
          </div>

          <button
            type="button"
            class="text-2xl text-gray-400 hover:text-gray-700"
            aria-label="Tutup"
            @click="closeForm"
          >
            ×
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="saveMenu">
          <!-- Photo -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Foto Menu
            </label>

            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:w-48">
                <img
                  v-if="photoPreview || existingPhoto"
                  :src="photoPreview || existingPhoto"
                  alt="Preview foto menu"
                  class="h-full w-full object-cover"
                />

                <span v-else class="text-4xl">🍽️</span>
              </div>

              <div class="flex-1">
                <input
                  ref="photoInput"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  class="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:font-semibold file:text-orange-600 hover:file:bg-orange-100"
                  @change="handlePhotoChange"
                />

                <p class="mt-2 text-xs text-gray-500">
                  Format JPG, JPEG, PNG, WEBP. Maksimal 2 MB.
                </p>

                <button
                  v-if="selectedPhoto"
                  type="button"
                  class="mt-3 text-xs font-medium text-red-600"
                  @click="clearPhotoPreview"
                >
                  Batalkan foto baru
                </button>
              </div>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Kategori <span class="text-red-500">*</span>
            </label>

            <select
              v-model="form.category_id"
              required
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            >
              <option value="" disabled>Pilih kategori</option>
              <option
                v-for="category in categories.filter(item => item.is_active)"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>

            <p
              v-if="categories.length === 0"
              class="mt-2 text-xs text-red-500"
            >
              Anda belum memiliki kategori. Buat kategori terlebih dahulu.
            </p>
          </div>

          <!-- Name -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Nama Menu <span class="text-red-500">*</span>
            </label>

            <input
              v-model="form.name"
              type="text"
              maxlength="150"
              required
              placeholder="Contoh: Paket Nasi Ayam Bakar"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Deskripsi
            </label>

            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Jelaskan isi dan detail menu..."
              class="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <!-- Price -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Harga (Rupiah) <span class="text-red-500">*</span>
            </label>

            <input
              v-model="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="25000"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <!-- Availability -->
          <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
            <input
              v-model="form.is_available"
              type="checkbox"
              class="h-4 w-4 accent-orange-500"
            />

            <span>
              <span class="block text-sm font-semibold text-gray-800">
                Menu tersedia
              </span>
              <span class="mt-1 block text-xs text-gray-500">
                Menu dapat ditampilkan dan dipesan customer.
              </span>
            </span>
          </label>

          <!-- Actions -->
          <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              :disabled="saving"
              @click="closeForm"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="saving || categories.filter(item => item.is_active).length === 0"
              class="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Menu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

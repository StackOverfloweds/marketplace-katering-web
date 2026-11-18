
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import MerchantCategoryService from '../services/MerchantCategoryService'

const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const deletingId = ref(null)
const search = ref('')
const showForm = ref(false)
const editingId = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  description: '',
  sort_order: 0,
})

const filteredCategories = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return categories.value

  return categories.value.filter((category) => {
    return (
      category.name?.toLowerCase().includes(keyword) ||
      category.description?.toLowerCase().includes(keyword)
    )
  })
})

const activeCount = computed(() => {
  return categories.value.filter((category) => category.is_active).length
})

const inactiveCount = computed(() => {
  return categories.value.length - activeCount.value
})

/**
 * Mengambil kategori milik merchant.
 */
const fetchCategories = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await MerchantCategoryService.getMyCategories()
    categories.value = response.data || []
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengambil data kategori.'
  } finally {
    loading.value = false
  }
}

/**
 * Mereset form kategori.
 */
const resetForm = () => {
  form.name = ''
  form.description = ''
  form.sort_order = 0
  editingId.value = null
}

/**
 * Membuka form tambah kategori.
 */
const openCreateForm = () => {
  resetForm()
  errorMessage.value = ''
  successMessage.value = ''
  showForm.value = true
}

/**
 * Membuka form edit kategori.
 * @param {Object} category
 */
const openEditForm = (category) => {
  editingId.value = category.id
  form.name = category.name || ''
  form.description = category.description || ''
  form.sort_order = category.sort_order ?? 0

  errorMessage.value = ''
  successMessage.value = ''
  showForm.value = true
}

/**
 * Menutup form kategori.
 */
const closeForm = () => {
  showForm.value = false
  resetForm()
}

/**
 * Menyimpan kategori baru atau perubahan kategori.
 */
const saveCategory = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = 'Nama kategori wajib diisi.'
    return
  }

  saving.value = true

  const payload = {
    name: form.name.trim(),
    description: form.description.trim() || null,
    sort_order: Number(form.sort_order),
  }

  try {
    if (editingId.value) {
      await MerchantCategoryService.updateCategory(editingId.value, payload)
      successMessage.value = 'Kategori berhasil diperbarui.'
    } else {
      await MerchantCategoryService.createCategory(payload)
      successMessage.value = 'Kategori berhasil ditambahkan.'
    }

    closeForm()
    await fetchCategories()
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal menyimpan kategori.'
  } finally {
    saving.value = false
  }
}

/**
 * Mengubah status aktif kategori.
 * @param {Object} category
 */
const toggleCategoryStatus = async (category) => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await MerchantCategoryService.updateCategory(category.id, {
      is_active: !category.is_active,
    })

    successMessage.value = 'Status kategori berhasil diperbarui.'
    await fetchCategories()
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Gagal mengubah status kategori.'
  }
}

/**
 * Menghapus kategori.
 * @param {Object} category
 */
const removeCategory = async (category) => {
  const confirmed = window.confirm(
    `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
  )

  if (!confirmed) return

  deletingId.value = category.id
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await MerchantCategoryService.deleteCategory(category.id)

    successMessage.value = 'Kategori berhasil dihapus.'
    await fetchCategories()
  } catch (error) {
    const status = error.response?.status

    if (status === 409) {
      errorMessage.value =
        error.response?.data?.message ||
        'Kategori tidak dapat dihapus karena masih digunakan oleh menu.'
    } else {
      errorMessage.value =
        error.response?.data?.message || 'Gagal menghapus kategori.'
    }
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="space-y-6">
    <!-- Page Heading -->
    <section class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Kategori Menu
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola kategori untuk mengelompokkan menu catering Anda.
        </p>
      </div>

      <button
        type="button"
        class="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        @click="openCreateForm"
      >
        + Tambah Kategori
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
        <p class="text-sm text-gray-500">Total Kategori</p>
        <p class="mt-2 text-2xl font-bold text-gray-900">
          {{ categories.length }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Kategori Aktif</p>
        <p class="mt-2 text-2xl font-bold text-green-600">
          {{ activeCount }}
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <p class="text-sm text-gray-500">Kategori Nonaktif</p>
        <p class="mt-2 text-2xl font-bold text-gray-500">
          {{ inactiveCount }}
        </p>
      </div>
    </section>

    <!-- Category List -->
    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div class="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-semibold text-gray-900">Daftar Kategori</h2>
          <p class="mt-1 text-xs text-gray-500">
            Kategori yang dimiliki oleh usaha Anda.
          </p>
        </div>

        <input
          v-model="search"
          type="search"
          placeholder="Cari kategori..."
          class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:max-w-xs"
        />
      </div>

      <div v-if="loading" class="p-12 text-center text-sm text-gray-500">
        Memuat data kategori...
      </div>

      <div
        v-else-if="filteredCategories.length === 0"
        class="p-12 text-center"
      >
        <div class="text-4xl">🏷️</div>

        <p class="mt-3 font-medium text-gray-800">
          {{ search ? 'Kategori tidak ditemukan' : 'Belum ada kategori' }}
        </p>

        <p class="mt-1 text-sm text-gray-500">
          {{ search
            ? 'Coba gunakan kata kunci lainnya.'
            : 'Tambahkan kategori pertama untuk menu catering Anda.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-5 py-4">Kategori</th>
              <th class="px-5 py-4">Deskripsi</th>
              <th class="px-5 py-4">Urutan</th>
              <th class="px-5 py-4">Status</th>
              <th class="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="category in filteredCategories"
              :key="category.id"
              class="hover:bg-gray-50"
            >
              <td class="px-5 py-4">
                <p class="font-semibold text-gray-900">
                  {{ category.name }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ category.slug }}
                </p>
              </td>

              <td class="max-w-xs px-5 py-4 text-gray-500">
                {{ category.description || '-' }}
              </td>

              <td class="px-5 py-4 text-gray-600">
                {{ category.sort_order }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="category.is_active
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'"
                >
                  {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    @click="openEditForm(category)"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-xs font-medium text-orange-600 hover:bg-orange-50"
                    @click="toggleCategoryStatus(category)"
                  >
                    {{ category.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                  </button>

                  <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    :disabled="deletingId === category.id"
                    @click="removeCategory(category)"
                  >
                    {{ deletingId === category.id ? 'Menghapus...' : 'Hapus' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
        Menampilkan {{ filteredCategories.length }} dari {{ categories.length }} kategori
      </div>
    </section>

    <!-- Create / Edit Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      @click.self="closeForm"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">
              {{ editingId ? 'Edit Kategori' : 'Tambah Kategori' }}
            </h2>
            <p class="mt-1 text-xs text-gray-500">
              Lengkapi informasi kategori menu.
            </p>
          </div>

          <button
            type="button"
            class="text-xl text-gray-400 hover:text-gray-700"
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

        <form class="space-y-4" @submit.prevent="saveCategory">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Nama Kategori <span class="text-red-500">*</span>
            </label>

            <input
              v-model="form.name"
              type="text"
              maxlength="150"
              required
              placeholder="Contoh: Paket Nasi Box"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Deskripsi
            </label>

            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Deskripsi kategori..."
              class="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Urutan Tampilan
            </label>

            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              required
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              :disabled="saving"
              @click="closeForm"
            >
              Batal
            </button>

            <button
              type="submit"
              class="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Kategori' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

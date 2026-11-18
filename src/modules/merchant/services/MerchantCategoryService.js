
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

/**
 * Mengambil seluruh kategori milik merchant yang sedang login.
 */
const getMyCategories = () => {
  return ApiHelper.get(API_ROUTES.CATEGORIES.MY)
}

/**
 * Membuat kategori baru.
 * @param {Object} payload
 */
const createCategory = (payload) => {
  return ApiHelper.post(API_ROUTES.CATEGORIES.BASE, payload)
}

/**
 * Memperbarui kategori berdasarkan ID.
 * @param {string} id
 * @param {Object} payload
 */
const updateCategory = (id, payload) => {
  return ApiHelper.patch(API_ROUTES.CATEGORIES.DETAIL(id), payload)
}

/**
 * Menghapus kategori berdasarkan ID.
 * @param {string} id
 */
const deleteCategory = (id) => {
  return ApiHelper.delete(API_ROUTES.CATEGORIES.DETAIL(id))
}

export default {
  getMyCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}

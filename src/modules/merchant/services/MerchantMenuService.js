
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

/**
 * Mengambil daftar menu milik merchant.
 * @param {Object} params
 */
const getMyMenus = (params = {}) => {
  return ApiHelper.get(API_ROUTES.MENUS.MY, params)
}

/**
 * Membuat menu baru.
 * @param {FormData} payload
 */
const createMenu = (payload) => {
  return ApiHelper.post(API_ROUTES.MENUS.BASE, payload)
}

/**
 * Memperbarui menu beserta foto jika diberikan.
 * Menggunakan method spoofing agar upload multipart terbaca Laravel.
 * @param {string} id
 * @param {FormData} payload
 */
const updateMenu = (id, payload) => {
  payload.append('_method', 'PATCH')

  return ApiHelper.post(
    API_ROUTES.MENUS.DETAIL(id),
    payload
  )
}

/**
 * Menghapus menu berdasarkan ID.
 * @param {string} id
 */
const deleteMenu = (id) => {
  return ApiHelper.delete(API_ROUTES.MENUS.DETAIL(id))
}

export default {
  getMyMenus,
  createMenu,
  updateMenu,
  deleteMenu,
}

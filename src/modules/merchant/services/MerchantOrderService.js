
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

/**
 * Mengambil daftar pesanan merchant.
 * @param {Object} params
 */
const getOrders = (params = {}) => {
  return ApiHelper.get(API_ROUTES.ORDERS.BASE, params)
}

/**
 * Mengambil detail pesanan berdasarkan ID.
 * @param {string} id
 */
const getOrderDetail = (id) => {
  return ApiHelper.get(API_ROUTES.ORDERS.DETAIL(id))
}

/**
 * Memperbarui status pesanan.
 * @param {string} id
 * @param {string} status
 */
const updateOrderStatus = (id, status) => {
  return ApiHelper.patch(
    API_ROUTES.ORDERS.UPDATE_STATUS(id),
    { status },
  )
}

export default {
  getOrders,
  getOrderDetail,
  updateOrderStatus,
}

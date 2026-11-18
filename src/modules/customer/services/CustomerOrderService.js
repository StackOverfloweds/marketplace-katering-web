
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

const CustomerOrderService = {
  /**
   * Get customer orders.
   *
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  getOrders(params = {}) {
    return ApiHelper.get(API_ROUTES.ORDERS.BASE, params)
  },

  /**
   * Get customer order detail.
   *
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  getOrderDetail(orderId) {
    return ApiHelper.get(API_ROUTES.ORDERS.DETAIL(orderId))
  },

  /**
   * Create a new customer order.
   *
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  createOrder(payload) {
    return ApiHelper.post(API_ROUTES.ORDERS.BASE, payload)
  },

  /**
   * Cancel a customer order.
   *
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  cancelOrder(orderId) {
    return ApiHelper.patch(API_ROUTES.ORDERS.CANCEL(orderId))
  },
}

export default CustomerOrderService

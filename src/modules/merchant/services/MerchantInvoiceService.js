
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

/**
 * Mengambil daftar invoice merchant.
 * @param {Object} params
 */
const getInvoices = (params = {}) => {
  return ApiHelper.get(API_ROUTES.INVOICES.BASE, params)
}

/**
 * Mengambil detail invoice.
 * @param {string} id
 */
const getInvoiceDetail = (id) => {
  return ApiHelper.get(API_ROUTES.INVOICES.DETAIL(id))
}

export default {
  getInvoices,
  getInvoiceDetail,
}

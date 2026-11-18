
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

const CustomerInvoiceService = {
  /**
   * Get all invoices belonging to the authenticated customer.
   *
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  getInvoices(params = {}) {
    return ApiHelper.get(API_ROUTES.INVOICES.BASE, params)
  },

  /**
   * Get invoice detail.
   *
   * @param {string} invoiceId
   * @returns {Promise<Object>}
   */
  getInvoiceDetail(invoiceId) {
    return ApiHelper.get(API_ROUTES.INVOICES.DETAIL(invoiceId))
  },
}

export default CustomerInvoiceService

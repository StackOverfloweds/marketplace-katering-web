
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

class MerchantService {
  /**
   * Get merchants with search filters and pagination.
   */
  static async getAll(params = {}) {
    const response = await ApiHelper.get(
      API_ROUTES.MERCHANTS.BASE,
      {
        search: params.search || undefined,
        location: params.location || undefined,
        category_id: params.categoryId || undefined,
        per_page: params.perPage || 12,
        page: params.page || 1,
      }
    )

    return response.data
  }

  /**
   * Get merchant detail.
   */
  static async getById(id) {
    const response = await ApiHelper.get(
      API_ROUTES.MERCHANTS.DETAIL(id)
    )

    return response.data
  }
}

export default MerchantService

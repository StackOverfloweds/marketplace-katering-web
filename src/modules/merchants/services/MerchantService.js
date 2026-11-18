
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

class MerchantService {
  /**
   * Get merchant listings with search and pagination.
   */
  static async getAll(params = {}) {
    return await ApiHelper.get(
      API_ROUTES.MERCHANTS.BASE,
      {
        search: params.search || undefined,
        location: params.location || undefined,
        category_id: params.categoryId || undefined,
        per_page: params.perPage || 12,
        page: params.page || 1,
      },
    )
  }

  /**
   * Get merchant detail by ID.
   */
  static async getById(id) {
    return await ApiHelper.get(
      API_ROUTES.MERCHANTS.DETAIL(id),
    )
  }
}

export default MerchantService

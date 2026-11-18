
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

class CategoryService {
  /**
   * Get all public active categories.
   */
  static async getAll(params = {}) {
    const response = await ApiHelper.get(
      API_ROUTES.CATEGORIES.BASE,
      params
    )

    return response.data
  }
}

export default CategoryService

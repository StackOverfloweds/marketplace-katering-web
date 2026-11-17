
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

class MenuService {
  /**
   * Get menu listings.
   */
  static async getAll(params = {}) {
    return await ApiHelper.get(
      API_ROUTES.MENUS.BASE,
      {
        category_id: params.categoryId || undefined,
        search: params.search || undefined,
        per_page: params.perPage || 12,
        page: params.page || 1,
      },
    )
  }

  /**
   * Get menu detail by ID.
   */
  static async getById(id) {
    return await ApiHelper.get(
      API_ROUTES.MENUS.DETAIL(id),
    )
  }
}

export default MenuService


import { merchants } from '../data/merchantMock'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

class MerchantService {
  /**
   * Get merchants with optional search filters.
   * Currently uses mock data.
   */
  static async getAll(params = {}) {
    await delay(300)

    const keyword = (params.search || '').toLowerCase().trim()
    const location = (params.location || '').toLowerCase().trim()
    const categoryId = params.categoryId || 'all'

    return merchants.filter((merchant) => {
      const matchesKeyword =
        !keyword ||
        merchant.name.toLowerCase().includes(keyword) ||
        merchant.description.toLowerCase().includes(keyword) ||
        merchant.categories.some((category) =>
          category.toLowerCase().includes(keyword)
        )

      const matchesLocation =
        !location ||
        merchant.city.toLowerCase().includes(location) ||
        merchant.address.toLowerCase().includes(location)

      const matchesCategory =
        categoryId === 'all' ||
        merchant.categoryIds.includes(categoryId)

      return matchesKeyword && matchesLocation && matchesCategory
    })
  }

  /**
   * Get featured merchants.
   */
  static async getFeatured() {
    await delay(200)

    return merchants.filter((merchant) => merchant.isFeatured)
  }

  /**
   * Get merchant detail by slug.
   */
  static async getBySlug(slug) {
    await delay(200)

    return merchants.find((merchant) => merchant.slug === slug) || null
  }
}

export default MerchantService

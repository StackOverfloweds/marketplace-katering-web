
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

const MerchantProfileService = {
  /**
   * Mengambil profil merchant yang sedang login.
   *
   * @returns {Promise<Object>}
   */
  getProfile() {
    return ApiHelper.get(API_ROUTES.PROFILE.BASE)
  },

  /**
   * Memperbarui profil merchant.
   *
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  updateProfile(payload) {
    return ApiHelper.patch(API_ROUTES.PROFILE.BASE, payload)
  },
}

export default MerchantProfileService

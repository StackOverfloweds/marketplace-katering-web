
import ApiHelper from '@/helpers/ApiHelper'
import API_ROUTES from '@/constants/apiRoutes'

const AuthService = {
  /**
   * Register a new customer or merchant account.
   */
  async register(payload) {
    return await ApiHelper.post(
      API_ROUTES.AUTH.REGISTER,
      payload
    )
  },

  /**
   * Authenticate user using username and password.
   */
  async login(payload) {
    return await ApiHelper.post(
      API_ROUTES.AUTH.LOGIN,
      payload
    )
  },

  /**
   * Refresh authentication tokens.
   */
  async refresh(refreshToken) {
    return await ApiHelper.post(
      API_ROUTES.AUTH.REFRESH,
      {
        refresh_token: refreshToken,
      }
    )
  },

  /**
   * Retrieve authenticated user information.
   */
  async me() {
    return await ApiHelper.get('/auth/me')
  },

  /**
   * Logout current authenticated session.
   */
  async logout() {
    return await ApiHelper.post(
      API_ROUTES.AUTH.LOGOUT
    )
  },
}

export default AuthService

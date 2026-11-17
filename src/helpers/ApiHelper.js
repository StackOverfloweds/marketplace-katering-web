
import api from '@/services/api'

class ApiHelper {
  /**
   * Send GET request.
   */
  static async get(url, params = {}, config = {}) {
    const response = await api.get(url, {
      ...config,
      params,
    })

    return response.data
  }

  /**
   * Send POST request.
   */
  static async post(url, data = {}, config = {}) {
    const response = await api.post(url, data, config)

    return response.data
  }

  /**
   * Send PUT request.
   */
  static async put(url, data = {}, config = {}) {
    const response = await api.put(url, data, config)

    return response.data
  }

  /**
   * Send PATCH request.
   */
  static async patch(url, data = {}, config = {}) {
    const response = await api.patch(url, data, config)

    return response.data
  }

  /**
   * Send DELETE request.
   */
  static async delete(url, config = {}) {
    const response = await api.delete(url, config)

    return response.data
  }

  /**
   * Upload file using multipart/form-data.
   */
  static async upload(url, formData, config = {}) {
    const response = await api.post(url, formData, config)

    return response.data
  }
}

export default ApiHelper

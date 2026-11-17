
/**
 * Extract response data from API response.
 */
export const getResponseData = (response) => {
    return response?.data ?? null
  }
  
  /**
   * Extract error message from API response.
   */
  export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
  
    if (error.response?.status === 401) {
      return 'Session expired. Please login again.'
    }
  
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.'
    }
  
    if (error.response?.status === 404) {
      return 'Data not found.'
    }
  
    if (error.response?.status === 422) {
      return 'Please check your input.'
    }
  
    if (!error.response) {
      return 'Unable to connect to the server.'
    }
  
    return 'Something went wrong. Please try again.'
  }
  
  /**
   * Extract validation errors from Laravel response.
   */
  export const getValidationErrors = (error) => {
    return error.response?.data?.errors ?? {}
  }
  
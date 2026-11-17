
class ValidationHelper {
    /**
     * Check whether value is empty.
     */
    static required(value) {
      return value !== null
        && value !== undefined
        && String(value).trim() !== ''
    }
  
    /**
     * Validate email format.
     */
    static email(value) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
      return pattern.test(value)
    }
  
    /**
     * Validate minimum string length.
     */
    static minLength(value, length) {
      return String(value ?? '').length >= length
    }
  
    /**
     * Validate maximum string length.
     */
    static maxLength(value, length) {
      return String(value ?? '').length <= length
    }
  
    /**
     * Validate numeric value.
     */
    static numeric(value) {
      return value !== '' && Number.isFinite(Number(value))
    }
  
    /**
     * Validate phone number.
     */
    static phone(value) {
      return /^[0-9+\-\s]{8,20}$/.test(value)
    }
  }
  
  export default ValidationHelper
  
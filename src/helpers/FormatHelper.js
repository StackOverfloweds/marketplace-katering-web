
class FormatHelper {
    /**
     * Format number into Indonesian Rupiah.
     */
    static currency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(Number(value) || 0)
    }
  
    /**
     * Format date into Indonesian date format.
     */
    static date(value) {
      if (!value) return '-'
  
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    }
  
    /**
     * Format date and time.
     */
    static dateTime(value) {
      if (!value) return '-'
  
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    }
  
    /**
     * Format number with Indonesian locale.
     */
    static number(value) {
      return new Intl.NumberFormat('id-ID').format(
        Number(value) || 0
      )
    }
  }
  
  export default FormatHelper
  
const API_ROUTES = {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
  
    MERCHANTS: {
      BASE: '/merchants',
      DETAIL: (id) => `/merchants/${id}`,
    },
  
    CATEGORIES: {
      BASE: '/categories',
      MY: '/categories/my',
      DETAIL: (id) => `/categories/${id}`,
    },
  
    MENUS: {
      BASE: '/menus',
      DETAIL: (id) => `/menus/${id}`,
    },
  
    ORDERS: {
      BASE: '/orders',
      DETAIL: (id) => `/orders/${id}`,
      CANCEL: (id) => `/orders/${id}/cancel`,
      UPDATE_STATUS: (id) => `/orders/${id}/status`,
    },
  
    INVOICES: {
      BASE: '/invoices',
      DETAIL: (id) => `/invoices/${id}`,
    },
  }
  
  export default API_ROUTES
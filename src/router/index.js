
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import MerchantLayout from '@/modules/merchant/layouts/MerchantLayout.vue'
import MerchantDashboardView from '@/modules/merchant/views/MerchantDashboardView.vue'

import MerchantOrderView from '@/modules/merchant/views/MerchantOrderView.vue'
import MerchantOrderDetailView from '@/modules/merchant/views/MerchantOrderDetailView.vue'
import MerchantInvoiceView from '@/modules/merchant/views/MerchantInvoiceView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Marketplace Katering',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      guestOnly: true,
    },
  },

  // Merchant workspace
  {
    path: '/merchant',
    component: MerchantLayout,
    meta: {
      requiresAuth: true,
      roles: ['merchant'],
    },
    children: [
      {
        path: 'dashboard',
        name: 'merchant-dashboard',
        component: MerchantDashboardView,
        meta: {
          title: 'Dashboard Merchant',
        },
      },
      {
        path: 'categories',
        name: 'merchant-categories',
        component: () => import('@/modules/merchant/views/MerchantCategoryView.vue'),
        meta: {
          title: 'Kategori Menu',
        },
      },
      {
        path: 'menus',
        name: 'merchant-menus',
        component: () => import('@/modules/merchant/views/MerchantMenuView.vue'),
        meta: {
          title: 'Menu Catering',
        },
      },
      {
        path: 'orders',
        name: 'merchant-orders',
        component: MerchantOrderView,
        meta: {
          title: 'Pesanan Masuk',
        },
      },
      {
        path: 'orders/:orderId',
        name: 'merchant-order-detail',
        component: MerchantOrderDetailView,
        meta: {
          title: 'Detail Pesanan',
        },
      },
      {
        path: 'invoices',
        name: 'merchant-invoices',
        component: MerchantInvoiceView,
        meta: {
          title: 'Invoice',
        },
      },
      {
        path: 'profile',
        name: 'merchant-profile',
        component: () =>
          import('@/modules/merchant/views/MerchantProfileView.vue'),
        meta: {
          title: 'Profil Usaha',
        },
      },
    ],
  },

  {
    path: '/customer',
    meta: {
      requiresAuth: true,
      roles: ['customer'],
    },
    children: [
      {
        path: 'cart',
        name: 'customer-cart',
        component: () =>
          import('@/modules/customer/views/CustomerCartView.vue'),
      },
      {
        path: 'checkout',
        name: 'customer-checkout',
        component: () =>
          import('@/modules/customer/views/CustomerCheckoutView.vue'),
      },
      {
        path: 'orders/:orderId',
        name: 'customer-order-detail',
        component: () =>
          import('@/modules/customer/views/CustomerOrderDetailView.vue'),
      },
      {
        path: 'orders',
        name: 'customer-orders',
        component: () =>
          import('@/modules/customer/views/CustomerOrdersView.vue'),
      },
      {
        path: 'invoices',
        name: 'customer-invoices',
        component: () =>
          import('@/modules/customer/views/CustomerInvoicesView.vue'),
      },
      {
        path: 'invoices/:invoiceId',
        name: 'customer-invoice-detail',
        component: () =>
          import('@/modules/customer/views/CustomerInvoiceDetailView.vue'),
      },
    ],
  },

  // Public merchant detail
  {
    path: '/merchant/:merchantId',
    name: 'merchant-detail',
    component: () => import('@/views/MerchantDetailView.vue'),
    meta: {
      title: 'Detail Catering',
    },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  await authStore.initializeAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.roles) {
    if (!authStore.isAuthenticated) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    if (!to.meta.roles.includes(authStore.user?.role)) {
      return authStore.user?.role === 'merchant'
        ? { name: 'merchant-dashboard' }
        : { path: '/' }
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return authStore.user?.role === 'merchant'
      ? { name: 'merchant-dashboard' }
      : { path: '/' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | KateringKu`
    : 'KateringKu'
})

export default router


import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

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
  {
    path: '/merchant/dashboard',
    name: 'merchant-dashboard',
    component: () => import('@/views/MerchantDashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['merchant'],
    },
  },
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

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (
    to.meta.roles &&
    !to.meta.roles.includes(authStore.user?.role)
  ) {
    return authStore.user?.role === 'merchant'
      ? { name: 'merchant-dashboard' }
      : { path: '/home' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return authStore.user?.role === 'merchant'
      ? { name: 'merchant-dashboard' }
      : { path: '/home' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | KateringKu`
    : 'KateringKu'
})

export default router

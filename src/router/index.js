import { createRouter, createWebHistory } from 'vue-router'

const constantRoutes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register.vue')
  },
  {
    path: '/forgot-password',
    name: 'forget',
    component: () => import('@/pages/forget_pass.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/pages/logout.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior (to, from, savedPosition) {
    // 返回滚动位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
  routes: constantRoutes
})

export default router

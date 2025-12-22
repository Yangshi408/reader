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
  },
  // 工具页面导航
  {
    path: '/tools',
    component: () => import('@/pages/tool/ToolsLayout.vue'), // 工具模块主布局
    children: [
      {
        path: '',
        name: 'ToolsList',
        component: () => import('@/pages/tool/ToolsList.vue') // 工具列表主页
      },
      {
        path: 'detail/:id',
        name: 'ToolDetail',
        component: () => import('@/pages/tool/ToolDetail.vue') // 工具详情页
      },
      {
        path: 'submit',
        name: 'ToolSubmit',
        component: () => import('@/pages/tool/ToolSubmit.vue') // 工具提交页
      }
    ]
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

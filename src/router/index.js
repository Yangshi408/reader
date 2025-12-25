import ToolDetail from '@/pages/tool/ToolDetail.vue'
import ToolsLayout from '@/pages/tool/ToolsLayout.vue'
import ToolsList from '@/pages/tool/ToolsList.vue'
import ToolSubmit from '@/pages/tool/ToolSubmit.vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'

const constantRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home.vue')
  },
  {
    path: '/profile',
    component: RouterView,
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/pages/per/profile.vue')
      }
    ]
  },
  {
    path: '/',
    component: RouterView,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/pages/log/login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/log/register.vue')
      },
      {
        path: 'forgot-password',
        name: 'forget',
        component: () => import('@/pages/log/forget_pass.vue')
      },
      {
        path: 'logout',
        name: 'logout',
        component: () => import('@/pages/log/logout.vue')
      }
    ]
  },
  // 工具页面导航
  {
    path: '/tools',
    component: ToolsLayout, // 工具模块主布局
    children: [
      {
        path: '',
        name: 'ToolsList',
        component: ToolsList // 工具列表主页
      },
      {
        path: 'detail/:id',
        name: 'ToolDetail',
        component: ToolDetail // 工具详情页
      },
      {
        path: 'submit',
        name: 'ToolSubmit',
        component: ToolSubmit // 工具提交页
      }
    ]
  },
  // 课程模块路由
  {
    path: '/courses',
    component: () => import('@/pages/course/CourseLayout.vue'),
    redirect: '/courses/list', // 默认跳转到列表页
    children: [
      {
        path: '', // 默认子路由
        name: 'CourseList',
        component: () => import('@/pages/course/CourseList.vue')
      },
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/pages/course/CourseList.vue'),
        meta: { title: '课程列表' }
      },
      {
        path: 'detail/:id',
        name: 'CourseDetail',
        component: () => import('@/pages/course/CourseDetail.vue'),
        meta: { title: '课程详情' }
      },
      {
        path: '/course/submit',
        name: 'CourseSubmit',
        component: () => import('@/pages/course/CourseSubmit.vue'),
        meta: { title: '资料上传' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior (to, from, savedPosition) {
    // 1. 如果是浏览器的前进/后退操作，使用保存的滚动位置
    if (savedPosition) {
      return savedPosition
    }
    // 2. 关键修改：如果路由名称相同（说明只是 query 或 params 变了，例如点击侧边栏切换学期）
    // 返回空对象 {} 表示"不改变滚动位置"
    // 这样 CourseList.vue 里的 scrollIntoView 才能平滑滚动，而不会先闪回顶部
    if (to.name === from.name) {
      return {}
    }
    // 3. 如果是跳转到完全不同的新页面，则滚动到顶部
    return { top: 0, left: 0 }
  },
  routes: constantRoutes
})

export default router

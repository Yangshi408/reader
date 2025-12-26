<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#f3f7fc] to-[#eef3f7] text-[#2d3748] font-sans">
    <aside :class="['fixed h-full bg-white/80 backdrop-blur-xl border-r border-white/50 z-50 transition-all duration-300 shadow-lg flex flex-col', isCollapsed ? 'w-16' : 'w-64']">
      <!-- Logo和收起按钮区域 -->
      <div class="h-20 flex items-center justify-between border-b border-gray-100 px-4 relative">
        <!-- Logo -->
        <div class="flex items-center justify-start w-30 h-21 relative">
          <div v-if="!isCollapsed" @click="router.push({name: 'home'})" class="absolute left-6 w-[125px] h-10 cursor-pointer"></div>
          <img v-if="!isCollapsed" src="@/assets/logo.png" alt="SoftLink Logo" class="w-full h-full object-cover ml-[-20px]" />
        </div>

        <!-- 收起/展开按钮 -->
        <button
          @click="toggleSidebar"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-600"
          :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'">
          <i :class="[isCollapsed ? 'fas fa-bars' : 'fas fa-angle-double-left']"></i>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-6 px-2 space-y-2">
        <!-- 其他导航项 -->
        <router-link to="/tools"
                     :class="['flex items-center rounded-lg transition-colors cursor-pointer text-decoration-none group',
                   isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3',
                   route.name === 'ToolsList' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50']">
          <i class="fas fa-layer-group group-hover:rotate-12 transition-transform"></i>
          <span v-if="!isCollapsed" class="ml-3 truncate">工具资源</span>
        </router-link>

        <div class="nav-group">
          <!-- 主要分类标题 -->
          <div :class="['flex items-center rounded-xl bg-blue-50 text-blue-600 font-bold cursor-default group', isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3']">
            <i class="fas fa-route group-hover:rotate-12 transition-transform"></i>
            <span v-if="!isCollapsed" class="ml-3 truncate">课程路线</span>
          </div>

          <!-- 学期子分类 -->
          <div v-if="!isCollapsed" class="ml-10 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
            <a v-for="semester in semesterCategories" :key="semester"
               href="javascript:void(0)"
               @click="handleScrollTo(semester)"
               class="block py-2 text-sm text-gray-500 hover:text-blue-600 transition-colors truncate">
              {{ semester }}
            </a>
          </div>
        </div>

        <router-link to="/projects"
                     :class="['flex items-center rounded-lg transition-colors cursor-pointer text-decoration-none group',
                   isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3',
                   route.name === 'ProjectList' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50']">
          <i class="fas fa-project-diagram group-hover:rotate-12 transition-transform"></i>
          <span v-if="!isCollapsed" class="ml-3 truncate">项目展示</span>
        </router-link>

        <!-- 返回上一级按钮 -->
        <div v-if="showBackButton"
             class="w-full px-2">
          <div
            @click="handleBack"
            :class="['flex items-center rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-600 font-medium cursor-pointer hover:bg-blue-100 hover:shadow-md transition-all group',
                     isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3']">
            <i class="fas fa-reply-all group-hover:rotate-12 transition-transform"></i>
            <span v-if="!isCollapsed" class="ml-3 truncate">返回上一级</span>
          </div>
        </div>
      </nav>

      <!-- 底部区域 -->
      <div class="mt-auto border-t border-gray-100 pt-2 px-2">
        <!-- 课程提交按钮 -->
        <router-link to="/course/submit"
                     :class="['flex items-center rounded-lg transition-colors cursor-pointer',
                   isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3',
                   route.name === 'CourseSubmit' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50']">
          <i class="fas fa-plus-circle"></i>
          <span v-if="!isCollapsed" class="ml-3 truncate">课程提交</span>
        </router-link>

        <!-- 版权信息 -->
        <div v-if="!isCollapsed" class="p-4 pt-2 text-xs text-center text-gray-400 border-t border-gray-100 mt-2">
          &copy; 2025 SoftLink Platform
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main :class="['flex-1 p-8 overflow-x-hidden transition-all duration-300', isCollapsed ? 'ml-16' : 'ml-64']">
      <!-- 业内子路由显示区域 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCoursesStore } from '@/store/courseStore'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const store = useCoursesStore()
const { categories } = storeToRefs(store)
const router = useRouter()
const route = useRoute()

// 侧边栏收起状态
const isCollapsed = ref(false)

// 学期分类
const semesterCategories = [
  '大一上', '大一下',
  '大二上', '大二下',
  '大三上', '大三下',
  '大四上', '大四下'
]

// 计算属性
const showBackButton = computed(() => {
  return route.name === 'CourseDetail' || route.name === 'CourseSubmit' || route.name !== 'CourseList'
})

// 方法
// 1.业内跳转逻辑
const handleScrollTo = (id) => {
  // 如果当前不在列表页，先跳转到列表页
  if (route.name !== 'CourseList') {
    router.push({ name: 'CourseList', hash: `#section-${id}` })
  } else {
    // 已经在列表页，直接滚动
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }
}

// 2.返回上一级
const handleBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'CourseList' })
  }
}

// 3. 切换侧边栏状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // 保存到localStorage，保存用户偏好
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
}

// 添加键盘快捷键：Ctrl+B 切换侧边栏
const handleKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault()
    toggleSidebar()
  }
}

// 检查localStorage中的侧边栏状态
onMounted(async () => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    isCollapsed.value = savedState === 'true'
  }

  window.addEventListener('keydown', handleKeyDown)

  // 如果分类数据为空，则获取课程列表
  if (categories.value.length === 0) {
    try {
      await store.fetchCourses({}, true)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
/* 使用独立的课程样式文件，不与ProjectLayout共用 */
@import '@/assets/css/courseIndex';

/* 应用课程特定的容器类 */
.course-container {
  min-height: 100vh;
  background: linear-gradient(135deg, $course-bg-gradient-start 0%, $course-bg-gradient-end 100%);
  color: $course-text-primary;
  font-family: $course-font-family;
}

/* 侧边栏 - 使用课程样式 */
aside {
  @extend .course-sidebar;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: $course-shadow-lg;

  &.w-16 {
    width: 4rem;
  }

  &.w-64 {
    width: 16rem;
  }
}

/* 主内容区域 */
main {
  flex: 1;
  padding: $course-spacing-xl;
  overflow-x: hidden;
  transition: margin-left $course-transition;

  &.ml-16 {
    margin-left: 4rem;
  }

  &.ml-64 {
    margin-left: 16rem;
  }
}

/* 侧边栏导航样式 */
nav .flex.items-center {
  &.bg-blue-50 {
    background: $course-gray-50;
    color: $course-primary;
  }

  &:hover {
    background: $course-gray-50;
    color: $course-primary;
  }
}

/* 返回按钮样式 */
.bg-gradient-to-r.from-blue-50.to-blue-100 {
  background: linear-gradient(to right, $course-gray-50, $course-gray-100);
  border-color: $course-border-color;
  color: $course-primary;

  &:hover {
    background: $course-gray-100;
    box-shadow: $course-shadow-md;
  }
}

/* 导航组样式 */
.nav-group {
  .flex.items-center.rounded-xl {
    &.bg-blue-50 {
      background: $course-gray-50;
      color: $course-primary;
      border: 1px solid $course-gray-200;

      i {
        color: $course-primary;
      }
    }
  }
}

/* 学期分类链接样式 */
.ml-10 a {
  color: $course-text-secondary;

  &:hover {
    color: $course-primary;
  }
}

/* 版权信息 */
.text-gray-400 {
  color: $course-text-tertiary;
}

/* 毛玻璃效果 */
.bg-white\/80 {
  background: rgba(255, 255, 255, 0.8);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  aside {
    &.w-64, &.w-16 {
      transform: translateX(-100%);

      &.mobile-open {
        transform: translateX(0);
      }
    }
  }

  main {
    &.ml-64, &.ml-16 {
      margin-left: 0;
    }
  }
}
</style>

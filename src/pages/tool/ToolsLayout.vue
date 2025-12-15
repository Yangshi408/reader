<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#f3f7fc] to-[#eef3f7] text-[#2d3748] font-sans">
    <aside class="w-64 fixed h-full bg-white/80 backdrop-blur-xl border-r border-white/50 z-50 transition-all shadow-lg flex flex-col">
      <div class="h-20 flex items-center justify-center border-b border-gray-100">
        <img src="@/assets/logo.png" alt="SoftLink Logo" class="w-full h-full object-contain" />
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div class="nav-group">
          <div class="flex items-center px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold cursor-default">
            <i class="fas fa-layer-group w-6"></i>
            <span>工具资源</span>
          </div>
          <div class="ml-10 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
            <a v-for="cat in categories" :key="cat"
               href="javascript:void(0)"
               @click="handleScrollTo(cat)"
               class="block py-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              {{ cat }}
            </a>
          </div>
        </div>

        <router-link to="/courses" class="nav-item">
          <i class="fas fa-route w-6"></i> 课程路线
        </router-link>
        <router-link to="/showcase" class="nav-item">
          <i class="fas fa-project-diagram w-6"></i> 项目展示
        </router-link>

        <!-- 返回上一页的按钮 -->
        <div v-if="showBackButton"
          class="absolute left-4 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
          @click="handleBack">
          <i class="fas fa-arrow-left text-lg"></i>
          返回上一级
        </div>
      </nav>

      <!-- 底部区域 -->
      <div class="mt-auto border-t border-gray-100 pt-2">
        <!-- 工具提交按钮 -->
        <router-link to="/tools/submit"
          class="flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2 my-1"
          active-class="bg-blue-50 text-blue-600 font-medium">
          <i class="fas fa-plus-circle w-6"></i>
          <span class="ml-3">工具提交</span>
        </router-link>

        <!-- 版权信息 -->
        <div class="p-4 pt-2 text-xs text-center text-gray-400 border-t border-gray-100 mt-2">
          &copy; 2025 SoftLink Platform
        </div>
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8 overflow-x-hidden">
      <!-- 顶部导航栏 -->

      <!-- 业内子路由显示区域，工具列表区域 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/store/toolsStore'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const store = useToolsStore()
const { categories } = storeToRefs(store)
const router = useRouter()
const route = useRoute()

// 计算属性
const showBackButton = computed(() => {
  return route.name === 'ToolDetail' || route.name === 'ToolSubmit' || route.name !== 'ToolsList'
})

// 方法
// 1.业内跳转逻辑
const handleScrollTo = (id) => {
  // 如果当前不在列表页，先跳转到列表页
  if (route.name !== 'ToolsList') {
    router.push({ name: 'ToolsList', hash: `#section-${id}` })
  } else {
    // 已经在列表页，直接滚动
    const el = document.getElementById(`section-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 2.返回上一级
const handleBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'ToolsList' })
  }
}
</script>

<style scoped>
@import '../../index.css';

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
}
.nav-item:hover, .nav-item.active {
  background: white;
  color: #0066ff;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

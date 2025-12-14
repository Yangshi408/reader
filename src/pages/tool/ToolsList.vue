<template>
  <div class="space-y-8 relative">
    <header class="flex justify-between items-center sticky top-0 z-40 py-4 glass-header rounded-2xl px-6 mb-8">
      <!-- 头部搜索框 -->
      <div class="relative w-full max-w-xl group">
        <input
          v-model="searchInput"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="搜索想要的神器..."
          class="w-full h-12 pl-12 pr-4 rounded-full bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm group-hover:shadow-md"
        >
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        <div v-if="hasSearched" class="absolute top-14 left-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm animate-slide-down">
          <i class="fas fa-info-circle mr-2"></i>
          "{{ searchInput }}" 的搜索结果如下：
          <span class="ml-2 text-xs text-blue-400 cursor-pointer hover:underline" @click="clearSearch">清除搜索</span>
        </div>
      </div>
      <!-- 筛选和用户菜单保持不变 -->
      <div class="flex items-center gap-6">
        <div class="relative" ref="filterRef">
          <button @click="showFilter = !showFilter" class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <i class="fas fa-sliders-h"></i> 筛选
          </button>
          <div v-if="showFilter" class="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 z-50 animate-pop-in">
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">排序方式</h4>
              <div class="flex gap-2">
                <button v-for="sort in ['最新', '最热', '评分']" :key="sort"
                  @click="activeSort = sort"
                  :class="['px-3 py-1 rounded-md text-sm border', activeSort === sort ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-200']">
                  {{ sort }}
                </button>
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">标签筛选 (多选)</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in ['开源', '免费', 'Mac', 'Win', 'Web']" :key="tag"
                   @click="toggleTag(tag)"
                   :class="['cursor-pointer px-2 py-1 rounded text-xs transition-colors', activeTags.includes(tag) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="relative" ref="avatarRef">
          <div v-if="user.isLogin" @click="showUserMenu = !showUserMenu" class="cursor-pointer relative">
            <img :src="user.avatar" class="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform object-cover">
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <button v-else @click="goToLogin" class="btn-primary-outline">登录</button>
          <div v-if="showUserMenu && user.isLogin" class="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-pop-in">
            <a href="#" class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"><i class="fas fa-user mr-2"></i>个人中心</a>
            <a href="#" class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"><i class="fas fa-key mr-2"></i>修改密码</a>
            <div class="h-px bg-gray-100 my-1"></div>
            <a href="#" class="block px-4 py-2 text-red-500 hover:bg-red-50"><i class="fas fa-sign-out-alt mr-2"></i>安全退出</a>
          </div>
        </div>
      </div>
    </header>
    <div v-if="!toolsList.length" class="text-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
      <p>资源加载中...</p>
    </div>
    <div v-else class="space-y-12 pb-20">
      <section
        v-for="category in filteredCategories"
        :key="category"
        :id="`section-${category}`"
        class="scroll-mt-32"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 class="text-xl font-bold text-gray-800">{{ category }}</h2>
          <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ getToolsByCategory(category).length }}
          </span>
        </div>
        <!-- 修改网格容器 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="tool in getToolsByCategory(category)"
            :key="tool.id"
            class="tool-card-container relative"
            @mouseenter="handleMouseEnter(tool.id)"
            @mouseleave="handleMouseLeave(tool.id)"
          >
            <!-- 卡片内容 -->
            <div
              class="tool-card group relative bg-white/60 hover:bg-white backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 cursor-pointer"
              @click="goToDetail(tool.id)"
            >
              <div class="flex items-center gap-4 mb-3">
                <img :src="tool.logo" class="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" alt="logo">
                <div class="overflow-hidden">
                  <h3 class="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{{ tool.name }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span><i class="far fa-eye"></i> {{ tool.views }}</span>
                    <span><i class="far fa-star"></i> {{ tool.stars }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-500 leading-relaxed line-clamp-2 h-10">
                {{ tool.desc }}
              </p>
            </div>
            <!-- 提示框 -->
            <div
              v-if="activeToolId === tool.id"
              class="tooltip-absolute animate-pop-in"
            >
              <div class="absolute -top-1 left-8 w-2 h-2 bg-gray-800 rotate-45"></div>
              {{ tool.fullDesc }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<!-- 修改 ToolsList.vue 的 script 部分 -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToolsStore } from '@/store/toolsStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const router = useRouter()
const toolsStore = useToolsStore()

// 使用storeToRefs来保持响应式
const {
  toolsList,
  categories,
  user,
  // isLoading,
  searchResults
} = storeToRefs(toolsStore)

const searchInput = ref('')
const hasSearched = ref(false)
const showFilter = ref(false)
const showUserMenu = ref(false)
const activeSort = ref('最新')
const activeTags = ref([])
const activeToolId = ref(null)
const tooltipTimers = ref({})

const TOOLTIP_DELAY = 500

onMounted(() => {
  toolsStore.fetchTools({}, true)
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  Object.values(tooltipTimers.value).forEach(timerId => {
    if (timerId) clearTimeout(timerId)
  })
})

const handleMouseEnter = (toolId) => {
  if (tooltipTimers.value[toolId]) {
    clearTimeout(tooltipTimers.value[toolId])
  }
  tooltipTimers.value[toolId] = setTimeout(() => {
    activeToolId.value = toolId
  }, TOOLTIP_DELAY)
}

const handleMouseLeave = (toolId) => {
  if (tooltipTimers.value[toolId]) {
    clearTimeout(tooltipTimers.value[toolId])
    tooltipTimers.value[toolId] = null
  }
  activeToolId.value = null
}

// 搜索功能
const handleSearch = async () => {
  const query = searchInput.value.trim()
  if (query) {
    hasSearched.value = true
    try {
      await toolsStore.searchTools(query)
    } catch (error) {
      ElMessage.error('搜索失败')
    }
  }
}

const clearSearch = () => {
  searchInput.value = ''
  hasSearched.value = false
  searchResults.value = []
}

const toggleTag = (tag) => {
  const index = activeTags.value.indexOf(tag)
  if (index > -1) {
    activeTags.value.splice(index, 1)
  } else {
    activeTags.value.push(tag)
  }
}

const getToolsByCategory = (cat) => {
  if (hasSearched.value && searchResults.value.length > 0) {
    return searchResults.value.filter(t => t.category === cat)
  }
  return toolsList.value.filter(t => t.category === cat)
}

const filteredCategories = computed(() => {
  // 如果有搜索结果，只显示包含搜索结果的分类
  if (hasSearched.value && searchResults.value.length > 0) {
    const cats = [...new Set(searchResults.value.map(t => t.category))]
    return categories.value.filter(cat => cats.includes(cat))
  }
  return categories.value
})

const goToDetail = async (id) => {
  if (tooltipTimers.value[id]) {
    clearTimeout(tooltipTimers.value[id])
    tooltipTimers.value[id] = null
  }
  activeToolId.value = null
  router.push({ name: 'ToolDetail', params: { id } })
}

// ***********************************需要修改：将当前页面的路径当作参数传递，使得登录成功后可以跳转回当前页面
const goToLogin = () => {
  router.push({ name: 'Login' })
}

// const handleLogout = async () => {
//   try {
//     await store.logout()
//     showUserMenu.value = false
//     ElMessage.success('已退出登录')
//   } catch (error) {
//     ElMessage.error('退出登录失败')
//   }
// }

// 辅助：关闭下拉菜单
const filterRef = ref(null)
const avatarRef = ref(null)
const closeDropdowns = (e) => {
  if (filterRef.value && !filterRef.value.contains(e.target)) showFilter.value = false
  if (avatarRef.value && !avatarRef.value.contains(e.target)) showUserMenu.value = false
}
</script>

<style scoped>
.glass-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.btn-primary-outline {
  padding: 0.5rem 1.5rem;
  border: 1px solid #0066ff;
  color: #0066ff;
  border-radius: 999px;
  font-weight: 600;
  transition: all 0.3s;
}
.btn-primary-outline:hover {
  background: #0066ff;
  color: white;
}

.animate-pop-in {
  animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* 现代浏览器支持 */
  display: -webkit-box;
  display: -moz-box;
  display: -ms-box;
  display: box;
  line-clamp: 2;
}

/* 卡片容器样式 */
.tool-card-container {
  position: relative;
  z-index: 1;
}

.tool-card-container:hover {
  z-index: 50;
}

/* 提示框样式 */
.tooltip-absolute {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  margin: 0 10px;
  padding: 16px;
  background: #1f2937;
  color: white;
  font-size: 12px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  pointer-events: none;
  backdrop-filter: none;
}

/* 如果需要更平滑的动画 */
.tooltip-absolute {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tool-card-container:hover .tooltip-absolute {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s; /* 与JS延迟保持一致 */
}
</style>

<template>
  <div class="space-y-8 relative min-h-screen pb-20">
    <header
      class="flex justify-between items-center sticky top-0 z-40 py-4 glass-header rounded-2xl px-6 mb-8 transition-all duration-300"
    >
      <div>
        <router-link
          to="/home"
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <i class="fas fa-home"></i> 主页
        </router-link>
      </div>

      <div class="relative w-full max-w-2xl group mx-4">
        <div class="search-bar-container">

          <div class="engine-wrapper" ref="engineRef">
            <div class="engine-trigger" @click.stop="engineMenuOpen = !engineMenuOpen">
              <span>{{ currentEngineName }}</span>
              <i :class="['fas fa-chevron-down arrow-icon', { 'rotate': engineMenuOpen }]"></i>
            </div>

            <transition name="fade">
              <div v-if="engineMenuOpen" class="engine-dropdown">
                <div
                  v-for="e in engines"
                  :key="e.value"
                  class="engine-option"
                  :class="{ 'selected': searchEngine === e.value }"
                  @click.stop="selectEngine(e.value)"
                >
                  {{ e.name }}
                  <i v-if="searchEngine === e.value" class="fas fa-check check-icon"></i>
                </div>
              </div>
            </transition>
          </div>

          <input
            v-model="searchInput"
            @keydown.enter="handleSearch"
            @input="handleInputChange"
            type="text"
            :placeholder="searchEngine === 'local' ? '搜索课程名称、教师...' : `在 ${currentEngineName} 中搜索...`"
            class="search-input-field"
          >

          <div class="search-action">
            <i v-if="!isSearching" @click="handleSearch" class="fas fa-search hover:text-blue-500 cursor-pointer transition-colors"></i>
            <i v-else class="fas fa-spinner fa-spin text-blue-500"></i>
          </div>
        </div>

        <div v-if="hasSearched && !isSearching && searchEngine === 'local'"
             class="absolute top-16 left-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm animate-slide-down z-10">
          <i class="fas fa-info-circle mr-2"></i>
          "{{ searchInput }}" 的搜索结果如下：
          <span class="ml-2 text-xs text-blue-400 cursor-pointer hover:underline" @click="clearSearch">清除搜索</span>
        </div>
      </div>

      <!-- 用户菜单 -->
      <div class="relative" ref="avatarRef">

        <!-- 头像按钮 -->
        <div @click="showUserMenu = !showUserMenu" class="cursor-pointer relative group">

          <!-- 情况 1: 已登录 且 有头像图片 -->
          <template v-if="isAuthenticated && userInfo?.avatar">
            <img
              :src="userInfo.avatar"
              class="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform object-cover"
              alt="User Avatar"
            >
            <!-- 在线状态绿点 -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </template>

          <!-- 情况 2: 已登录 但 无头像图片 (显示 "我") -->
          <template v-else-if="isAuthenticated">
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-blue-600 to-purple-600">
              {{ userInitial }}
            </div>
            <!-- 在线状态绿点 -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </template>

          <!-- 情况 3: 游客 (显示 "游") -->
          <template v-else>
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-red-400 to-orange-400">
              {{ userInitial }}
            </div>
          </template>

        </div>

        <!-- 下拉菜单 -->
        <div v-if="showUserMenu"
             class="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-pop-in overflow-hidden">

          <!-- 已登录菜单内容 -->
          <template v-if="isAuthenticated">
            <div class="px-4 py-3 border-b border-gray-50">
              <p class="text-sm font-bold text-gray-800 truncate">{{ userInfo?.nickname || userInfo?.username || '用户' }}</p>
              <p class="text-xs text-gray-400 truncate">已登录</p>
            </div>
            <router-link to="/profile" class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <i class="fas fa-user mr-2 text-blue-500"></i>个人中心
            </router-link>
            <div class="h-px bg-gray-100 my-1"></div>
            <p @click="handleLogout" class="cursor-pointer px-4 py-3 text-red-500 hover:bg-red-50 transition-colors">
              <i class="fas fa-sign-out-alt mr-2"></i>退出登录
            </p>
          </template>

          <!-- 游客菜单内容 -->
          <template v-else>
            <div class="px-4 py-3 text-xs text-gray-400 bg-gray-50 border-b border-gray-100 cursor-default">
              当前身份：游客
            </div>
            <router-link to="/profile" class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <i class="fas fa-user mr-2 text-blue-500"></i>个人中心
            </router-link>
            <div class="h-px bg-gray-100 my-1"></div>
            <div @click="goToLogin" class="block px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-colors">
              <i class="fas fa-sign-in-alt mr-2"></i>返回登录
            </div>
          </template>
        </div>
      </div>
    </header>

    <div class="flex justify-center mb-8">
      <div class="flex flex-wrap gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/60 shadow-sm">
        <button
          v-for="type in courseTypes"
          :key="type"
          class="px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          :class="
            activeType === type
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-gray-600 hover:bg-white hover:text-blue-600'
          "
          @click="activeType = type"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <div class="space-y-16">
      <div
        v-for="semesterItem in groupedCourses"
        :key="semesterItem.key"
        :id="`section-${semesterItem.key}`"
        class="relative scroll-target"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 class="text-xl font-bold text-gray-800 tracking-tight">
            {{ semesterItem.name }}
          </h2>
          <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
            {{ semesterItem.list.length }} 门课程
          </span>
        </div>

        <div
          v-if="semesterItem.list.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="course in semesterItem.list"
            :key="course.id"
            class="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            @click="goToDetail(course.id)"
          >
            <div
              class="absolute top-0 left-0 w-full h-1.5"
              :style="{ backgroundColor: getColorConfig(course.type).bar }"
            ></div>

            <div class="flex justify-between items-start mb-4">
              <span
                class="text-[10px] px-2 py-0.5 rounded-md font-bold border"
                :style="{
                  color: getColorConfig(course.type).text,
                  backgroundColor: getColorConfig(course.type).bg,
                  borderColor: getColorConfig(course.type).border
                }"
              >
                {{ course.type }}
              </span>
              <span class="text-xs text-gray-400 font-mono">{{ course.code }}</span>
            </div>

            <h3
              class="font-bold text-gray-800 text-lg mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors"
              :title="course.name"
            >
              {{ course.name }}
            </h3>

            <div class="flex items-center text-sm text-gray-500 mb-5 gap-3">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-chalkboard-teacher text-gray-300"></i>
                <span>{{ course.teacher }}</span>
              </div>
              <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>{{ course.credit }} 学分</span>
            </div>

            <div
              class="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400"
            >
              <div class="flex gap-4">
                <span class="flex items-center gap-1 hover:text-blue-500">
                  <i class="far fa-file-alt"></i> {{ course.resources }} 资料
                </span>
                <span class="flex items-center gap-1 hover:text-red-500">
                  <i class="far fa-star"></i> {{ course.likes }}
                </span>
              </div>
              <i
                class="fas fa-arrow-right opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500"
              ></i>
            </div>
          </div>
        </div>

        <div
          v-else
          class="h-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm"
        >
          本学期暂无相关课程
        </div>
      </div>

      <div
        v-if="groupedCourses.every((g) => g.list.length === 0)"
        class="text-center py-20"
      >
        <div class="text-gray-400 mb-4">
          没有找到匹配的课程
        </div>
        <button class="text-blue-600 text-sm hover:underline" @click="resetFilter">
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useStore()

// --- 1. 用户信息 (Vuex) ---
const userInfo = computed(() => store.getters.userInfo || {})
const isAuthenticated = computed(() => store.getters.isLoggedIn)

// --- 2. 搜索逻辑状态 ---
const searchInput = ref('')
const searchEngine = ref('local') // 默认使用本站搜索
const isSearching = ref(false)
const hasSearched = ref(false)
const engineMenuOpen = ref(false)
const engineRef = ref(null)

// 搜索引擎定义
const engines = [
  { name: '本站', value: 'local' },
  { name: '百度', value: 'baidu' },
  { name: '谷歌', value: 'google' },
  { name: '必应', value: 'bing' }
]

// 计算当前引擎名称
const currentEngineName = computed(() => {
  const engine = engines.find(e => e.value === searchEngine.value)
  return engine ? engine.name : '本站'
})

// 选择引擎
const selectEngine = (value) => {
  searchEngine.value = value
  engineMenuOpen.value = false
  // 如果输入框有值，切换引擎后立即触发搜索
  if (searchInput.value) {
    handleSearch()
  }
}

const userInitial = computed(() => {
  // 1. 游客显示 '游'
  if (!isAuthenticated.value) return '游'

  // 2. 已登录（但没图片的情况）显示 '我'
  return '我'
})

// 执行搜索
const handleSearch = () => {
  if (!(searchInput.value || '').trim()) {
    if (searchEngine.value === 'local') {
      // 本站搜索清空时，重置状态
      hasSearched.value = false
    }
    return
  }

  if (searchEngine.value === 'local') {
    // 模拟本站搜索加载效果
    isSearching.value = true
    hasSearched.value = false // 先重置结果状态

    setTimeout(() => {
      isSearching.value = false
      hasSearched.value = true
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  } else {
    // 外部搜索
    let url = ''
    const query = encodeURIComponent(searchInput.value)
    switch (searchEngine.value) {
      case 'baidu':
        url = `https://www.baidu.com/s?wd=${query}`
        break
      case 'google':
        url = `https://www.google.com/search?q=${query}`
        break
      case 'bing':
        url = `https://cn.bing.com/search?q=${query}`
        break
    }
    window.open(url, '_blank')
  }
}

// 监听输入变化
const handleInputChange = () => {
  if (searchEngine.value === 'local' && !searchInput.value) {
    hasSearched.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchInput.value = ''
  hasSearched.value = false
}

// --- 3. 课程列表与筛选 ---
const activeType = ref('全部')
const courseTypes = ['全部', '公必', '专必', '专选', '公选']
const showUserMenu = ref(false)
const avatarRef = ref(null)

const resetFilter = () => {
  searchInput.value = ''
  hasSearched.value = false
  activeType.value = '全部'
}

const goToDetail = (courseId) => {
  router.push({ name: 'CourseDetail', params: { id: courseId } })
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}

const handleLogout = async () => {
  try {
    await store.dispatch('logout')  // 调用 Vuex 的 logout action
    showUserMenu.value = false
    ElMessage.success('已退出登录')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

// 点击外部关闭弹窗
const closeDropdowns = (e) => {
  if (avatarRef.value && !avatarRef.value.contains(e.target)) {
    showUserMenu.value = false
  }
  if (engineRef.value && !engineRef.value.contains(e.target)) {
    engineMenuOpen.value = false
  }
}

// --- 4. Mock 数据与分组 ---
const colorMap = {
  公必: { bar: '#a855f7', text: '#9333ea', bg: '#f3e8ff', border: '#e9d5ff' },
  专必: { bar: '#3b82f6', text: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
  专选: { bar: '#14b8a6', text: '#0d9488', bg: '#ccfbf1', border: '#99f6e4' },
  公选: { bar: '#f97316', text: '#ea580c', bg: '#ffedd5', border: '#fed7aa' }
}

const getColorConfig = (type) => colorMap[type] || { bar: '#9ca3af', text: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' }

const semesterMap = {
  '1-1': '大一上', '1-2': '大一下', '2-1': '大二上', '2-2': '大二下',
  '3-1': '大三上', '3-2': '大三下', '4-1': '大四上', '4-2': '大四下'
}
const reverseSemesterMap = Object.entries(semesterMap).reduce((acc, [k, v]) => { acc[v] = k; return acc }, {})

const mockCourses = [
  { id: 101, name: '高等数学 I', code: 'MATH1001', semester: '1-1', type: '公必', teacher: '张老师', credit: 5.0, resources: 12, likes: 45 },
  { id: 102, name: '程序设计基础', code: 'CS1001', semester: '1-1', type: '专必', teacher: '李老师', credit: 4.0, resources: 28, likes: 102 },
  { id: 103, name: '思想道德修养', code: 'POLIO1001', semester: '1-1', type: '公必', teacher: '王老师', credit: 2.0, resources: 5, likes: 10 },
  { id: 104, name: '当代文化研究', code: 'PUB1001', semester: '1-1', type: '公选', teacher: '张老师', credit: 2.0, resources: 5, likes: 80 },
  { id: 201, name: '高等数学 II', code: 'MATH1002', semester: '1-2', type: '公必', teacher: '张老师', credit: 5.0, resources: 15, likes: 38 },
  { id: 202, name: '线性代数', code: 'MATH1003', semester: '1-2', type: '公必', teacher: '赵老师', credit: 3.0, resources: 20, likes: 88 },
  { id: 203, name: '离散数学', code: 'CS1002', semester: '1-2', type: '专必', teacher: '钱老师', credit: 4.0, resources: 35, likes: 150 },
  { id: 204, name: '体育2', code: 'PE1002', semester: '1-2', type: '公必', teacher: '张老师', credit: 1.0, resources: 5, likes: 180 },
  { id: 301, name: '数据结构与算法', code: 'CS2001', semester: '2-1', type: '专必', teacher: '孙老师', credit: 5, resources: 56, likes: 230 },
  { id: 302, name: '计算机组成原理', code: 'CS2002', semester: '2-1', type: '专必', teacher: '周老师', credit: 4.0, resources: 30, likes: 95 },
  { id: 303, name: 'Python应用开发', code: 'CS2005', semester: '2-1', type: '专选', teacher: '吴老师', credit: 2.0, resources: 18, likes: 67 },
  { id: 401, name: '操作系统', code: 'CS2003', semester: '2-2', type: '专必', teacher: '郑老师', credit: 4.0, resources: 42, likes: 180 },
  { id: 402, name: '计算机网络', code: 'CS2004', semester: '2-2', type: '专必', teacher: '冯老师', credit: 4.0, resources: 38, likes: 160 },
  { id: 501, name: '计算机网络', code: 'CS3001', semester: '3-1', type: '专必', teacher: '马老师', credit: 3.0, resources: 18, likes: 120 },
  { id: 502, name: '数据库系统概论', code: 'CS3002', semester: '3-1', type: '专必', teacher: '刘老师', credit: 3.5, resources: 25, likes: 140 },
  { id: 601, name: '软件工程导论', code: 'CS3003', semester: '3-2', type: '专选', teacher: '毛老师', credit: 2.0, resources: 22, likes: 80 },
  { id: 701, name: '人工智能导论', code: 'CS4001', semester: '4-1', type: '专选', teacher: '林老师', credit: 2.0, resources: 15, likes: 90 },
  { id: 702, name: '毕业设计', code: 'CS4002', semester: '4-2', type: '专必', teacher: '何老师', credit: 6.0, resources: 10, likes: 50 }
]

// 计算属性：过滤逻辑
const filteredList = computed(() => {
  return mockCourses.filter((course) => {
    const keyword = String(searchInput.value || '').toLowerCase()
    // 只有在是本站搜索且有输入时，才进行关键词过滤
    const matchKeyword = (searchEngine.value === 'local' && keyword)
      ? (course.name.toLowerCase().includes(keyword) || course.teacher.includes(keyword))
      : true // 如果不是本站搜索或无输入，则不过滤关键词

    const matchType = activeType.value === '全部' || course.type === activeType.value
    return matchKeyword && matchType
  })
})

const groupedCourses = computed(() => {
  const order = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2']
  const groupsObj = {}
  order.forEach(k => groupsObj[k] = [])
  filteredList.value.forEach(c => {
    if (groupsObj[c.semester]) groupsObj[c.semester].push(c)
  })
  return order.map(k => ({ key: k, name: semesterMap[k], list: groupsObj[k] }))
    .sort((a, b) => {
      if (a.list.length > 0 && b.list.length === 0) return -1
      if (a.list.length === 0 && b.list.length > 0) return 1
      return 0
    })
})

const scrollToSemester = (val) => {
  if (!val) return
  const target = Object.keys(semesterMap).includes(val) ? val : reverseSemesterMap[val]
  if (!target) return
  nextTick(() => {
    const el = document.getElementById(`section-${target}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

watch(() => route.query.semester, (val) => val && scrollToSemester(val), { immediate: true })

onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))
</script>

<style scoped>
@import '@/assets/css/index.css';

.glass-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

/* ================== 搜索栏样式 ================== */
.search-bar-container {
  display: flex;
  align-items: center;
  height: 48px;
  background: white;
  border-radius: 99px; /* 圆角 */
  border: 1px solid #e5e7eb; /* gray-200 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding-right: 16px; /* 右侧图标间距 */
}

/* 悬停/聚焦效果 */
.group:hover .search-bar-container,
.search-bar-container:focus-within {
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

/* 引擎选择容器 */
.engine-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #f3f4f6;
  padding: 0 16px;
  margin-right: 8px;
}

/* 引擎触发器 */
.engine-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4b5563; /* gray-600 */
  white-space: nowrap;
  user-select: none;
  transition: color 0.2s;
}

.engine-trigger:hover {
  color: #3b82f6;
}

.arrow-icon {
  font-size: 10px;
  color: #9ca3af;
  transition: transform 0.3s;
}
.arrow-icon.rotate {
  transform: rotate(180deg);
  color: #3b82f6;
}

/* 引擎下拉菜单 */
.engine-dropdown {
  position: absolute;
  top: 120%;
  left: 0;
  width: 120px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 6px;
  z-index: 100;
  border: 1px solid #f3f4f6;
  animation: popIn 0.2s ease-out;
}

.engine-option {
  padding: 8px 12px;
  font-size: 13px;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  transition: all 0.2s;
}

.engine-option:hover {
  background: #eff6ff; /* blue-50 */
  color: #3b82f6;
}

.engine-option.selected {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 600;
}

.check-icon {
  font-size: 10px;
}

/* 输入框 */
.search-input-field {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #1f2937;
  width: 100%;
}

.search-input-field::placeholder {
  color: #9ca3af;
}

/* 右侧图标 */
.search-action {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 16px;
}

.scroll-target { scroll-margin-top: 140px; }

/* 动画定义 */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}
</style>

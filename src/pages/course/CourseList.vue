<template>
  <div class="space-y-8 relative min-h-screen pb-20">
    <!-- 顶部导航栏 -->
    <header class="flex justify-between items-center sticky top-0 z-40 py-4 glass-header rounded-2xl px-6 mb-8">
      <!-- 主页按钮 -->
      <div>
        <router-link
          to="/home"
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <i class="fas fa-home"></i> 主页
        </router-link>
      </div>

      <!-- 中间：搜索栏 -->
      <div class="relative w-full max-w-2xl group mx-4">
        <div class="search-bar-container">
          <!-- 搜索引擎选择器（课程页面固定为"本站"） -->
          <div class="engine-wrapper">
            <div class="engine-trigger cursor-default">
              <span>课程</span>
            </div>
          </div>

          <!-- 输入框 -->
          <input
            v-model="searchKeyword"
            @keydown.enter="handleSearch"
            @input="handleInputChange"
            type="text"
            placeholder="搜索课程名称、教师..."
            class="search-input-field"
          />

          <!-- 右侧图标区域 -->
          <div class="search-action">
            <i v-if="!isSearching" class="fas fa-search text-gray-400 group-hover:text-blue-500 transition-colors"></i>
            <i v-else class="fas fa-spinner fa-spin text-blue-500"></i>
          </div>
        </div>

        <!-- 搜索成功后的提示框 -->
        <div
          v-if="hasSearched && !isSearching"
          class="absolute top-16 left-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm animate-slide-down z-10"
        >
          <i class="fas fa-info-circle mr-2"></i>
          "{{ searchKeyword }}" 的搜索结果如下：
          <span class="ml-2 text-xs text-blue-400 cursor-pointer hover:underline" @click="clearSearch">
            清除搜索
          </span>
        </div>

        <!-- 搜索时的加载动画 -->
        <div
          v-if="isSearching"
          class="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-20 animate-fade-in"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center space-x-1 mb-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-wave" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-wave" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-wave" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-wave" style="animation-delay: 0.3s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-wave" style="animation-delay: 0.4s"></div>
            </div>
            <p class="text-sm text-gray-600 font-medium">正在搜索 "{{ searchKeyword }}"...</p>
          </div>
        </div>
      </div>

      <!-- 用户菜单 -->
      <div class="flex items-center gap-6">
        <!-- 类型筛选按钮 -->
        <div class="relative" ref="filterRef">
          <button
            @click="showFilter = !showFilter"
            class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <i class="fas fa-sliders-h"></i> 筛选
          </button>

          <!-- 筛选下拉菜单 -->
          <div
            v-if="showFilter"
            class="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 z-50 animate-pop-in"
          >
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">课程类型</h4>
            <div class="space-y-1">
              <button
                v-for="type in courseTypes"
                :key="type"
                @click="selectCourseType(type)"
                :class="[
                  'w-full px-3 py-2 rounded-md text-sm text-left transition-all duration-200',
                  activeType === type
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ type }}
                <i v-if="activeType === type" class="fas fa-check float-right mt-0.5"></i>
              </button>
            </div>
            <div class="h-px bg-gray-100 my-3"></div>
            <button
              @click="resetFilter"
              class="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <i class="fas fa-redo mr-2"></i>重置筛选
            </button>
          </div>
        </div>

        <!-- 用户头像菜单（已修改为渐变背景） -->
        <div class="relative" ref="avatarRef">
          <div @click="showUserMenu = !showUserMenu" class="cursor-pointer relative group">
            <template v-if="isAuthenticated && userInfo?.avatar">
              <!-- 已登录且有头像 -->
              <img
                :src="userInfo.avatar"
                class="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform object-cover"
                alt="User Avatar"
              />
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </template>

            <template v-else-if="isAuthenticated">
              <!-- 已登录但无头像，显示渐变背景和用户首字母 -->
              <div class="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-blue-600 to-purple-600">
                {{ userInitial }}
              </div>
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </template>

            <template v-else>
              <!-- 未登录，显示游客渐变背景 -->
              <div class="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-red-400 to-orange-400">
                {{ userInitial }}
              </div>
            </template>
          </div>

          <!-- 下拉菜单 -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-pop-in overflow-hidden"
          >
            <template v-if="isAuthenticated">
              <div class="px-4 py-3 border-b border-gray-50">
                <p class="text-sm font-bold text-gray-800 truncate">{{ userInfo?.nickname || userInfo?.username || '用户' }}</p>
                <p class="text-xs text-gray-400 truncate">已登录</p>
              </div>
              <router-link
                to="/profile"
                class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <i class="fas fa-user mr-2 text-blue-500"></i>个人中心
              </router-link>
              <a
                href="#"
                class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <i class="fas fa-key mr-2 text-blue-500"></i>修改密码
              </a>
              <div class="h-px bg-gray-100 my-1"></div>
              <p
                @click="handleLogout"
                class="cursor-pointer px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>退出登录
              </p>
            </template>

            <template v-else>
              <div class="px-4 py-3 text-xs text-gray-400 bg-gray-50 border-b border-gray-100 cursor-default">
                当前身份：游客
              </div>
              <router-link
                to="/profile"
                class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <i class="fas fa-user mr-2 text-blue-500"></i>个人中心
              </router-link>
              <div class="h-px bg-gray-100 my-1"></div>
              <div @click="goToLogin" class="block px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-colors">
                <i class="fas fa-sign-in-alt mr-2"></i>返回登录
              </div>
            </template>
          </div>
        </div>
      </div>
    </header>

    <div class="space-y-16">
      <div
        v-for="(group, semesterKey) in groupedCourses"
        :key="semesterKey"
        :id="`section-${semesterKey}`"
        class="relative scroll-target"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 class="text-xl font-bold text-gray-800 tracking-tight">
            {{ semesterMap[semesterKey] }}
          </h2>
          <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
            {{ group.length }} 门课程
          </span>
        </div>

        <div
          v-if="group.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="course in group"
            :key="course.id"
            @click="goToDetail(course.id)"
            class="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
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
        v-if="Object.values(groupedCourses).every((g) => g.length === 0)"
        class="text-center py-20"
      >
        <div class="text-gray-400 mb-4">没有找到匹配的课程</div>
        <button @click="resetFilter" class="text-blue-600 text-sm hover:underline">
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToolsStore } from '@/store/toolsStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const toolsStore = useToolsStore()
const { userInfo, isAuthenticated } = storeToRefs(toolsStore)

const userInitial = computed(() => {
  if (!isAuthenticated.value) return '游'
  if (userInfo.value?.nickname) return userInfo.value.nickname.charAt(0)
  if (userInfo.value?.username) return userInfo.value.username.charAt(0)
  return '我'
})

// 搜索相关状态
const searchKeyword = ref('')
const hasSearched = ref(false)
const isSearching = ref(false)
const searchTimeout = ref(null)

// 筛选状态
const activeType = ref('全部')
const showFilter = ref(false)
const showUserMenu = ref(false)
const courseTypes = ['全部', '公必', '专必', '专选', '公选']

// 筛选相关的refs
const filterRef = ref(null)
const avatarRef = ref(null)

// 颜色配置（保持不变）
const colorMap = {
  公必: {
    bar: '#a855f7',
    text: '#9333ea',
    bg: '#f3e8ff',
    border: '#e9d5ff'
  },
  专必: {
    bar: '#3b82f6',
    text: '#2563eb',
    bg: '#dbeafe',
    border: '#bfdbfe'
  },
  专选: {
    bar: '#14b8a6',
    text: '#0d9488',
    bg: '#ccfbf1',
    border: '#99f6e4'
  },
  公选: {
    bar: '#f97316',
    text: '#ea580c',
    bg: '#ffedd5',
    border: '#fed7aa'
  }
}

const getColorConfig = (type) => {
  return (
    colorMap[type] || {
      bar: '#9ca3af',
      text: '#6b7280',
      bg: '#f3f4f6',
      border: '#e5e7eb'
    }
  )
}

// Mock 数据（保持不变）
const semesterMap = {
  '1-1': '大一上',
  '1-2': '大一下',
  '2-1': '大二上',
  '2-2': '大二下',
  '3-1': '大三上',
  '3-2': '大三下',
  '4-1': '大四上',
  '4-2': '大四下'
}

// 反向映射
const reverseSemesterMap = Object.entries(semesterMap).reduce((acc, [key, val]) => {
  acc[val] = key
  return acc
}, {})

// 模拟课程数据
const mockCourses = [
  {
    id: 101,
    name: '高等数学 I',
    code: 'MATH1001',
    semester: '1-1',
    type: '公必',
    teacher: '张老师',
    credit: 5.0,
    resources: 12,
    likes: 45
  },
  {
    id: 102,
    name: '程序设计基础',
    code: 'CS1001',
    semester: '1-1',
    type: '专必',
    teacher: '李老师',
    credit: 4.0,
    resources: 28,
    likes: 102
  },
  {
    id: 103,
    name: '思想道德修养',
    code: 'POLI1001',
    semester: '1-1',
    type: '公必',
    teacher: '王老师',
    credit: 2.0,
    resources: 5,
    likes: 10
  },
  {
    id: 104,
    name: '当代文化研究',
    code: 'PUB1001',
    semester: '1-1',
    type: '公选',
    teacher: '张老师',
    credit: 2.0,
    resources: 5,
    likes: 80
  },
  {
    id: 201,
    name: '高等数学 II',
    code: 'MATH1002',
    semester: '1-2',
    type: '公必',
    teacher: '张老师',
    credit: 5.0,
    resources: 15,
    likes: 38
  },
  {
    id: 202,
    name: '线性代数',
    code: 'MATH1003',
    semester: '1-2',
    type: '公必',
    teacher: '赵老师',
    credit: 3.0,
    resources: 20,
    likes: 88
  },
  {
    id: 203,
    name: '离散数学',
    code: 'CS1002',
    semester: '1-2',
    type: '专必',
    teacher: '钱老师',
    credit: 4.0,
    resources: 35,
    likes: 150
  },
  {
    id: 204,
    name: '体育2',
    code: 'PE1002',
    semester: '1-2',
    type: '公必',
    teacher: '张老师',
    credit: 1.0,
    resources: 5,
    likes: 180
  },
  {
    id: 301,
    name: '数据结构与算法',
    code: 'CS2001',
    semester: '2-1',
    type: '专必',
    teacher: '孙老师',
    credit: 5,
    resources: 56,
    likes: 230
  },
  {
    id: 302,
    name: '计算机组成原理',
    code: 'CS2002',
    semester: '2-1',
    type: '专必',
    teacher: '周老师',
    credit: 4.0,
    resources: 30,
    likes: 95
  },
  {
    id: 303,
    name: 'Python应用开发',
    code: 'CS2005',
    semester: '2-1',
    type: '专选',
    teacher: '吴老师',
    credit: 2.0,
    resources: 18,
    likes: 67
  },
  {
    id: 401,
    name: '操作系统',
    code: 'CS2003',
    semester: '2-2',
    type: '专必',
    teacher: '郑老师',
    credit: 4.0,
    resources: 42,
    likes: 180
  },
  {
    id: 402,
    name: '计算机网络',
    code: 'CS2004',
    semester: '2-2',
    type: '专必',
    teacher: '冯老师',
    credit: 4.0,
    resources: 38,
    likes: 160
  },
  {
    id: 501,
    name: '计算机网络',
    code: 'CS3001',
    semester: '3-1',
    type: '专必',
    teacher: '马老师',
    credit: 3.0,
    resources: 18,
    likes: 120
  },
  {
    id: 502,
    name: '数据库系统概论',
    code: 'CS3002',
    semester: '3-1',
    type: '专必',
    teacher: '刘老师',
    credit: 3.5,
    resources: 25,
    likes: 140
  },
  {
    id: 601,
    name: '软件工程导论',
    code: 'CS3003',
    semester: '3-2',
    type: '专选',
    teacher: '毛老师',
    credit: 2.0,
    resources: 22,
    likes: 80
  },
  {
    id: 701,
    name: '人工智能导论',
    code: 'CS4001',
    semester: '4-1',
    type: '专选',
    teacher: '林老师',
    credit: 2.0,
    resources: 15,
    likes: 90
  },
  {
    id: 702,
    name: '毕业设计',
    code: 'CS4002',
    semester: '4-2',
    type: '专必',
    teacher: '何老师',
    credit: 6.0,
    resources: 10,
    likes: 50
  }
]

// 4. 计算属性
const filteredList = computed(() => {
  return mockCourses.filter((course) => {
    const matchKeyword =
      course.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      course.teacher.includes(searchKeyword.value)
    const matchType = activeType.value === '全部' || course.type === activeType.value
    return matchKeyword && matchType
  })
})

const groupedCourses = computed(() => {
  const groups = {
    '1-1': [],
    '1-2': [],
    '2-1': [],
    '2-2': [],
    '3-1': [],
    '3-2': [],
    '4-1': [],
    '4-2': []
  }
  filteredList.value.forEach((course) => {
    if (groups[course.semester]) {
      groups[course.semester].push(course)
    }
  })
  return groups
})

// 搜索处理函数
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    hasSearched.value = true
    // 触发搜索逻辑
    performSearch()
  }
}

const handleInputChange = () => {
  if (searchKeyword.value.trim()) {
    // 防抖搜索
    clearTimeout(searchTimeout.value)
    isSearching.value = true

    searchTimeout.value = setTimeout(() => {
      hasSearched.value = true
      isSearching.value = false
      // 这里可以添加实际的搜索逻辑
    }, 500)
  } else {
    hasSearched.value = false
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  hasSearched.value = false
  isSearching.value = false
}

const selectCourseType = (type) => {
  activeType.value = type
  showFilter.value = false
}

const resetFilter = () => {
  activeType.value = '全部'
  searchKeyword.value = ''
  hasSearched.value = false
  showFilter.value = false
}

const goToDetail = (courseId) => {
  router.push({ name: 'CourseDetail', params: { id: courseId } })
}

// 登录相关逻辑
const goToLogin = () => {
  router.push({ name: 'Login' })
}

const handleLogout = async () => {
  try {
    await toolsStore.logout()
    showUserMenu.value = false
    ElMessage.success('已退出登录')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

const closeDropdowns = (e) => {
  if (filterRef.value && !filterRef.value.contains(e.target)) showFilter.value = false
  if (avatarRef.value && !avatarRef.value.contains(e.target)) showUserMenu.value = false
}

// 滚动控制逻辑
const scrollToSemester = (queryValue) => {
  if (!queryValue) return

  const targetKey =
    Object.keys(semesterMap).includes(queryValue)
      ? queryValue
      : reverseSemesterMap[queryValue]

  if (!targetKey) return

  nextTick(() => {
    const element = document.getElementById(`section-${targetKey}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 监听路由参数变化
watch(
  () => route.query.semester,
  (newVal) => {
    if (newVal) {
      scrollToSemester(newVal)
    }
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/index';

.glass-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.search-bar-container {
  display: flex;
  align-items: center;
  height: 48px;
  background: white;
  border-radius: 99px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding-right: 16px;
}

.group:hover .search-bar-container,
.search-bar-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.engine-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #f3f4f6;
  padding: 0 16px;
  margin-right: 8px;
}

.engine-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
  user-select: none;
  transition: color 0.2s;
}

.engine-trigger:hover {
  color: #3b82f6;
}

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

.search-action {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 16px;
}

/* 动画效果 */
.animate-pop-in {
  animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-wave {
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes wave {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 保持原有的其他样式 */
.scroll-target {
  scroll-margin-top: 140px;
}
</style>

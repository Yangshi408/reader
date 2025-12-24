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

      <div class="relative w-full max-w-xl group mx-4">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索课程名称、教师..."
          class="w-full h-12 pl-4 pr-12 rounded-full bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm group-hover:shadow-md"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2">
          <i class="fas fa-search text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="relative" ref="avatarRef">
          <div
            v-if="isAuthenticated"
            @click="showUserMenu = !showUserMenu"
            class="cursor-pointer relative"
          >
            <img
              :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'"
              class="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform object-cover"
              alt="Avatar"
            />
            <div
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            ></div>
          </div>

          <button v-else @click="goToLogin" class="btn-primary-outline text-sm">
            登录
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu && isAuthenticated"
              class="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <i class="fas fa-user mr-2"></i>个人中心
              </router-link>
              <a
                href="#"
                class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <i class="fas fa-key mr-2"></i>修改密码
              </a>
              <div class="h-px bg-gray-100 my-1"></div>
              <p
                @click="handleLogout"
                class="cursor-pointer px-4 py-2 text-red-500 hover:bg-red-50"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>退出登录
              </p>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <div class="flex justify-center mb-8">
      <div class="flex flex-wrap gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/60 shadow-sm">
        <button
          v-for="type in courseTypes"
          :key="type"
          @click="activeType = type"
          class="px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          :class="
            activeType === type
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-gray-600 hover:bg-white hover:text-blue-600'
          "
        >
          {{ type }}
        </button>
      </div>
    </div>

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
// 引入 Tools Store 以复用用户状态
import { useToolsStore } from '@/store/toolsStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const toolsStore = useToolsStore()
const { userInfo, isAuthenticated } = storeToRefs(toolsStore)

// 1. 筛选状态
const searchKeyword = ref('')
const activeType = ref('全部')
const courseTypes = ['全部', '公必', '专必', '专选', '公选']
const showUserMenu = ref(false)
const avatarRef = ref(null)

// 2. 颜色配置
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

// 3. Mock 数据
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

// 5. 交互逻辑
const resetFilter = () => {
  searchKeyword.value = ''
  activeType.value = '全部'
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
  if (avatarRef.value && !avatarRef.value.contains(e.target)) {
    showUserMenu.value = false
  }
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

<style scoped>
/* 复用部分 ToolsList 的样式 */
@import '../../index.css';

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

.scroll-target {
  scroll-margin-top: 140px;
}
</style>

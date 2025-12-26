<template>
  <div class="space-y-8 relative">
    <header class="flex justify-between items-center sticky top-0 z-40 py-4 course-glass-header rounded-2xl px-6 mb-8">
      <!-- 主页按钮 -->
      <div>
        <router-link to="/home" class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
          <i class="fas fa-home"></i> 主页
        </router-link>
      </div>

      <!-- 中间：搜索栏 -->
      <div class="relative w-full max-w-2xl group">
        <div class="course-search-bar">
          <!-- 1. 自定义搜索引擎选择器 -->
          <div class="course-search-bar__filter" ref="engineRef">
            <div class="course-search-bar__filter-trigger" @click.stop="engineMenuOpen = !engineMenuOpen">
              <span>{{ currentEngineName }}</span>
              <i :class="['fas fa-chevron-down', { 'rotate': engineMenuOpen }]" class="transition-transform duration-200"></i>
            </div>

            <!-- 下拉菜单 -->
            <div v-if="engineMenuOpen" class="course-search-bar__filter-dropdown">
              <div
                v-for="e in engines"
                :key="e.value"
                class="course-search-bar__filter-option"
                :class="{ 'selected': searchEngine === e.value }"
                @click.stop="selectEngine(e.value)"
              >
                {{ e.name }}
                <i v-if="searchEngine === e.value" class="fas fa-check"></i>
              </div>
            </div>
          </div>

          <!-- 2. 输入框 -->
          <input
            v-model="searchInput"
            @keydown.enter="handleSearch"
            @input="handleInputChange"
            type="text"
            placeholder="搜索感兴趣的课程..."
            class="course-search-bar__input"
          >

          <!-- 3. 右侧图标区域 (搜索/加载) -->
          <div class="course-search-bar__action">
            <i v-if="!isSearching" @click="handleSearch" class="fas fa-search hover:text-blue-500 cursor-pointer transition-colors"></i>
            <i v-else class="fas fa-spinner fa-spin text-blue-500"></i>
          </div>
        </div>

        <!-- 搜索成功后的提示框 -->
        <div v-if="hasSearched && !isSearching && searchEngine === 'local'"
             class="absolute top-16 left-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm course-animate--slide-down z-10">
          <i class="fas fa-info-circle mr-2"></i>
          "{{ searchInput }}" 的搜索结果如下：
          <span class="ml-2 text-xs text-blue-400 cursor-pointer hover:underline" @click="clearSearch">清除搜索</span>
        </div>

        <!-- 搜索时的加载动画 -->
        <div v-if="isSearching && searchEngine === 'local'"
             class="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-20 course-animate--fade-in">
          <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center space-x-1 mb-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full course-animate--wave" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full course-animate--wave" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full course-animate--wave" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full course-animate--wave" style="animation-delay: 0.3s"></div>
              <div class="w-2 h-2 bg-blue-500 rounded-full course-animate--wave" style="animation-delay: 0.4s"></div>
            </div>
            <p class="text-sm text-gray-600 font-medium">正在搜索 "{{ searchInput }}"...</p>
          </div>
        </div>
      </div>

      <!-- 筛选和用户菜单 -->
      <div class="flex items-center gap-6">
        <div class="relative" ref="filterRef">
          <button @click="showFilter = !showFilter"
                  class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <i class="fas fa-sliders-h"></i> 筛选
          </button>
          <div v-if="showFilter" class="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 z-50 course-animate--pop-in max-h-[70vh] overflow-y-auto">
            <!-- 排序 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">排序方式</h4>
              <div class="flex gap-2">
                <button v-for="sort in ['最新', '最热', '评分最高']" :key="sort" @click="coursesStore.toggleSort(sort)"
                        :class="['px-3 py-1 rounded-md text-sm border', activeFilters.sort === sort ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-200']">
                  {{ sort }}
                </button>
              </div>
            </div>

            <!-- 难度等级 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">难度等级</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="level in ['入门', '初级', '中级', '高级']" :key="level" @click="coursesStore.toggleLevel(level)"
                        :class="['px-3 py-1 rounded-md text-sm border', activeFilters.levels.includes(level) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-600 border-gray-200']">
                  {{ level }}
                </button>
              </div>
            </div>

            <!-- 学期分类 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">学期分类</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="semester in semesterCategories" :key="semester" @click="coursesStore.toggleCategory(semester)"
                        :class="['px-3 py-1 rounded-md text-sm border', activeFilters.categories.includes(semester) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-600 border-gray-200']">
                  {{ semester }}
                </button>
              </div>
            </div>

            <!-- 课程类型 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">课程类型</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="type in ['视频课程', '图文教程', '直播课', '专栏']" :key="type" @click="coursesStore.toggleType(type)"
                        :class="['px-3 py-1 rounded-md text-sm border', activeFilters.types.includes(type) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-600 border-gray-200']">
                  {{ type }}
                </button>
              </div>
            </div>

            <!-- 标签 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                标签筛选 (多选)
                <button
                  @click="clearTagFilters"
                  v-if="activeFilters.tags.length > 0"
                  class="ml-2 text-xs text-blue-500 hover:text-blue-700"
                >
                  清除
                </button>
              </h4>

              <div class="course-tag-selector__search mb-3">
                <i class="fas fa-search text-xs"></i>
                <input
                  v-model="tagFilterSearch"
                  type="text"
                  placeholder="搜索标签..."
                  class="text-sm"
                />
              </div>

              <div class="course-tag-selector__container">
                <div class="course-tag-selector__container-content">
                  <div class="course-tag-selector__tags">
                    <div
                      v-for="tag in filteredTags"
                      :key="tag.id"
                      @click="coursesStore.toggleTag(tag.id)"
                      :class="[
                        'course-tag-selector__tag',
                        activeFilters.tags.includes(tag.id)
                          ? 'course-tag-selector__tag--selected'
                          : 'course-tag-selector__tag--unselected'
                      ]"
                    >
                      <span>{{ tag.name }}</span>
                      <i
                        v-if="activeFilters.tags.includes(tag.id)"
                        class="fas fa-check text-xs"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户菜单 - 与ProjectList相同的头像逻辑 -->
        <div class="relative" ref="avatarRef">
          <div @click="showUserMenu = !showUserMenu" class="course-avatar-container">
            <template v-if="isAuthenticated && userInfo?.avatar">
              <img
                :src="userInfo.avatar"
                class="course-avatar course-avatar--authenticated-img"
                alt="用户头像"
              />
              <div class="course-avatar__online-status"></div>
            </template>

            <template v-else-if="isAuthenticated">
              <div class="course-avatar course-avatar--authenticated-default">
                {{ userInitial }}
              </div>
              <div class="course-avatar__online-status"></div>
            </template>

            <template v-else>
              <div class="course-avatar course-avatar--guest">
                {{ userInitial }}
              </div>
            </template>
          </div>

          <!-- 下拉菜单 -->
          <div v-if="showUserMenu"
               class="course-avatar-dropdown course-animate--pop-in">

            <template v-if="isAuthenticated">
              <div class="course-avatar-dropdown__header">
                <p>{{ userInfo?.nickname || userInfo?.username || '用户' }}</p>
                <p>已登录</p>
              </div>
              <router-link to="/profile" class="course-avatar-dropdown__item">
                <i class="fas fa-user"></i>个人中心
              </router-link>
              <div class="course-avatar-dropdown__divider"></div>
              <div @click="handleLogout" class="course-avatar-dropdown__item logout">
                <i class="fas fa-sign-out-alt"></i>退出登录
              </div>
            </template>

            <template v-else>
              <div class="course-avatar-dropdown__header">
                <p>游客</p>
                <p>当前身份：游客</p>
              </div>
              <router-link to="/profile" class="course-avatar-dropdown__item">
                <i class="fas fa-user"></i>个人中心
              </router-link>
              <div class="course-avatar-dropdown__divider"></div>
              <div @click="goToLogin" class="course-avatar-dropdown__item login">
                <i class="fas fa-sign-in-alt"></i>返回登录
              </div>
            </template>
          </div>
        </div>
      </div>
    </header>

    <div v-if="!coursesList.length" class="text-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
      <p>课程加载中...</p>
    </div>
    <div v-else class="space-y-12 pb-20">
      <section v-for="semester in filteredSemesters" :key="semester" :id="`section-${semester}`" class="course-scroll-mt-32">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 class="text-xl font-bold text-gray-800">{{ semester }}</h2>
          <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ getCoursesBySemester(semester).length }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in getCoursesBySemester(semester)" :key="course.id" class="course-card-container relative"
               @mouseenter="handleMouseEnter(course.id)" @mouseleave="handleMouseLeave(course.id)">

            <!-- 课程卡片 - 使用course-card样式 -->
            <div
              class="course-card group"
              @click="goToDetail(course.id)">

              <!-- 课程封面 -->
              <div class="relative h-40 mb-4 rounded-xl overflow-hidden">
                <img :src="course.cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute top-3 left-3">
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-bold text-white',
                    course.level === '入门' ? 'bg-blue-500' :
                    course.level === '初级' ? 'bg-blue-600' :
                    course.level === '中级' ? 'bg-blue-700' : 'bg-blue-800'
                  ]">
                    {{ course.level }}
                  </span>
                </div>
                <div class="absolute bottom-3 right-3">
                  <span class="px-2 py-1 rounded text-xs font-bold bg-black/60 text-white">
                    {{ course.duration }}
                  </span>
                </div>
              </div>

              <!-- 课程信息 -->
              <div class="mb-3">
                <h3 class="course-card__title">{{ course.name }}</h3>
                <p class="course-line-clamp-2 text-sm text-gray-500 leading-relaxed h-10 mt-2">
                  {{ course.description }}
                </p>
              </div>

              <!-- 讲师信息 -->
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <img :src="course.teacherAvatar" class="w-6 h-6 rounded-full">
                  <span>{{ course.teacherName }}</span>
                </div>
                <div class="flex items-center gap-1 text-yellow-500">
                  <i class="fas fa-star"></i>
                  <span>{{ course.rating }}</span>
                </div>
              </div>

              <!-- 课程数据 -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div class="course-card__stats">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-users"></i>
                    {{ course.students }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="far fa-eye"></i>
                    {{ course.views }}
                  </span>
                </div>
                <div class="text-blue-600 font-bold">
                  {{ course.isFree ? '免费' : `¥${course.price}` }}
                </div>
              </div>
            </div>

            <!-- 提示框 -->
            <div v-if="activeCourseId === course.id" class="course-tooltip course-animate--pop-in">
              <div class="absolute -top-1 left-8 w-2 h-2 bg-gray-800 rotate-45"></div>
              {{ course.fullDescription || course.description }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCoursesStore } from '@/store/courseStore'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const coursesStore = useCoursesStore()

const {
  coursesList,
  userInfo,
  activeFilters,
  searchResults,
  isAuthenticated,
  tags
} = storeToRefs(coursesStore)

// 搜索引擎配置
const engines = [
  { name: '本站', value: 'local' },
  { name: '慕课网', value: 'https://www.imooc.com/search/?words=' },
  { name: '网易云课堂', value: 'https://study.163.com/courses?keyword=' },
  { name: 'B站', value: 'https://search.bilibili.com/all?keyword=' }
]
const searchEngine = ref('local')
const engineMenuOpen = ref(false)

const currentEngineName = computed(() => {
  const engine = engines.find(e => e.value === searchEngine.value)
  return engine ? engine.name : '本站'
})

const userInitial = computed(() => {
  if (!isAuthenticated.value) return '游'
  return userInfo.value?.nickname?.charAt(0) ||
    userInfo.value?.username?.charAt(0) ||
    '我'
})

// 学期分类
const semesterCategories = [
  '大一上', '大一下',
  '大二上', '大二下',
  '大三上', '大三下',
  '大四上', '大四下'
]

// 变量声明
const searchInput = ref('')
const hasSearched = ref(false)
const isSearching = ref(false)
const showFilter = ref(false)
const showUserMenu = ref(false)
const activeCourseId = ref(null)
const engineRef = ref(null)
const tooltipTimers = ref({})
const tagFilterSearch = ref('')
const filterRef = ref(null)
const avatarRef = ref(null)
const TOOLTIP_DELAY = 500

// 计算属性
const filteredTags = computed(() => {
  const searchTerm = tagFilterSearch.value.toLowerCase()
  const tagList = tags.value || []
  if (searchTerm) {
    return tagList.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm) ||
      tag.id.toLowerCase().includes(searchTerm)
    )
  }
  return tagList.slice(0, 20)
})

const filteredSemesters = computed(() => {
  if (hasSearched.value && searchResults.value.length > 0) {
    const semesters = [...new Set(searchResults.value.map(c => c.semester || c.category))]
    return semesterCategories.filter(semester => semesters.includes(semester))
  }

  // 如果没有搜索，显示所有有课程的学期
  const semestersWithCourses = [...new Set(coursesList.value.map(c => c.semester || c.category))]
  return semesterCategories.filter(semester => semestersWithCourses.includes(semester))
})

// 方法
const selectEngine = (value) => {
  searchEngine.value = value
  engineMenuOpen.value = false
}

const handleMouseEnter = (courseId) => {
  if (tooltipTimers.value[courseId]) {
    clearTimeout(tooltipTimers.value[courseId])
  }
  tooltipTimers.value[courseId] = setTimeout(() => {
    activeCourseId.value = courseId
  }, TOOLTIP_DELAY)
}

const handleMouseLeave = (courseId) => {
  if (tooltipTimers.value[courseId]) {
    clearTimeout(tooltipTimers.value[courseId])
    tooltipTimers.value[courseId] = null
  }
  activeCourseId.value = null
}

const handleSearch = async () => {
  const query = searchInput.value.trim()
  if (!query) return

  if (searchEngine.value !== 'local') {
    window.open(searchEngine.value + encodeURIComponent(query), '_blank')
    searchInput.value = ''
    return
  }

  isSearching.value = true
  try {
    await coursesStore.searchCourses(query)
    hasSearched.value = true
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    isSearching.value = false
  }
}

const handleInputChange = () => {
  if (searchEngine.value === 'local') {
    hasSearched.value = false
  }
}

const clearSearch = () => {
  searchInput.value = ''
  hasSearched.value = false
  searchResults.value = []
}

const clearTagFilters = () => {
  activeFilters.value.tags = []
}

const getCoursesBySemester = (semester) => {
  let list = []
  if (hasSearched.value) {
    if (searchResults.value.length > 0) {
      list = searchResults.value?.filter(c => (c.semester || c.category) === semester)
      return filterCourseList(list)
    } else {
      return list
    }
  }
  list = coursesList.value?.filter(c => (c.semester || c.category) === semester)
  return filterCourseList(list)
}

const filterCourseList = (list) => {
  // 排序
  if (activeFilters.value.sort === '最新') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (activeFilters.value.sort === '最热') {
    list.sort((a, b) => b.views - a.views)
  } else if (activeFilters.value.sort === '评分最高') {
    list.sort((a, b) => b.rating - a.rating)
  }

  // 难度等级筛选
  if (activeFilters.value.levels.length > 0) {
    list = list?.filter(item => activeFilters.value.levels.includes(item.level))
  }

  // 学期筛选
  if (activeFilters.value.categories.length > 0) {
    list = list?.filter(item => activeFilters.value.categories.includes(item.semester || item.category))
  }

  // 课程类型筛选
  if (activeFilters.value.types.length > 0) {
    list = list?.filter(item => activeFilters.value.types.includes(item.type))
  }

  // 标签筛选
  if (activeFilters.value.tags.length > 0) {
    list = list?.filter(item => activeFilters.value.tags.every(tag => item.tags.includes(tag)))
  }

  return list
}

const goToDetail = async (id) => {
  if (tooltipTimers.value[id]) {
    clearTimeout(tooltipTimers.value[id])
    tooltipTimers.value[id] = null
  }
  activeCourseId.value = null
  coursesStore.addCourseView(id)
  router.push({ name: 'CourseDetail', params: { id } })
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}

const handleLogout = async () => {
  try {
    await coursesStore.logout()
    showUserMenu.value = false
    ElMessage.success('已退出登录')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

const closeDropdowns = (e) => {
  if (filterRef.value && !filterRef.value.contains(e.target)) showFilter.value = false
  if (avatarRef.value && !avatarRef.value.contains(e.target)) showUserMenu.value = false
  if (engineRef.value && !engineRef.value.contains(e.target)) engineMenuOpen.value = false
}

// 监听器
import { watch } from 'vue'
watch(() => route.query, (newQuery) => {
  if (newQuery.tagId) {
    const tagId = newQuery.tagId
    if (!activeFilters.value.tags.includes(tagId)) {
      coursesStore.clearTags()
      coursesStore.toggleTag(tagId)
    }

    if (newQuery.tagName) {
      ElMessage.success(`已筛选标签: ${newQuery.tagName}`)
    }
  }
}, { immediate: true })

// 生命周期函数
onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  Object.values(tooltipTimers.value).forEach(timerId => {
    if (timerId) clearTimeout(timerId)
  })
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
/* 复用部分 ToolsList 的样式 */
@import '@/assets/css/index.css';

  .course-tooltip {
    @extend .course-tooltip;

    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: 8px;
      width: 8px;
      height: 8px;
      background: $course-gray-800;
      transform: rotate(45deg);
    }
  }
}

/* 毛玻璃头部 */
.course-glass-header {
  @extend .course-glass-header;
}

/* 搜索栏使用课程模块的 */
.course-search-bar {
  @extend .course-search-bar;

  &__filter {
    @extend .course-search-bar__filter;

    &-dropdown {
      @extend .course-search-bar__filter-dropdown;
    }
  }

  &__input {
    @extend .course-search-bar__input;
  }

  &__action {
    @extend .course-search-bar__action;
  }
}

/* 下拉菜单使用课程模块的 */
.course-dropdown {
  @extend .course-dropdown;

  &__header {
    @extend .course-dropdown__header;
  }

  &__item {
    @extend .course-dropdown__item;
  }

  &__divider {
    @extend .course-dropdown__divider;
  }
}

/* 标签选择器使用课程模块的 */
.course-tag-selector {
  &__search {
    @extend .course-tag-selector__search;
  }

  &__container {
    @extend .course-tag-selector__container;

    &-content {
      @extend .course-tag-selector__container-content;
    }
  }

  &__tags {
    @extend .course-tag-selector__tags;
  }

  &__tag {
    @extend .course-tag-selector__tag;

    &--selected {
      @extend .course-tag-selector__tag--selected;
    }

    &--unselected {
      @extend .course-tag-selector__tag--unselected;
    }
  }
}

/* 文本截断 */
.course-line-clamp-2 {
  @extend .course-line-clamp-2;
}

/* 滚动边距 */
.course-scroll-mt-32 {
  scroll-margin-top: 8rem;
}

/* 头像样式 */
.w-10.h-10.rounded-full {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
}
</style>

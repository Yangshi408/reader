<template>
  <div v-if="course && !isLoading" class="course-container course-animate--fade-in max-w-5xl mx-auto">
    <!-- 课程信息区域 -->
    <div class="course-detail-card mb-8">
      <div class="course-detail-card__content">
        <!-- 课程头部 -->
        <div class="course-detail-card__header">
          <!-- 课程图标区域 -->
          <div class="course-detail-card__icon">
            <img :src="course.cover" class="w-full h-full object-contain" alt="课程封面">
          </div>

          <!-- 课程基本信息 -->
          <div class="flex-1">
            <!-- 课程元标签 -->
            <div class="course-detail-card__meta mb-4">
              <span class="meta-tag category-tag">{{ course.level }}</span>
              <span class="meta-tag level-tag">{{ course.type }}</span>
              <span class="meta-tag status-tag">{{ course.duration }}</span>
            </div>

            <!-- 课程标题 -->
            <h1 class="course-detail-card__title">{{ course.name }}</h1>

            <!-- 课程描述 -->
            <p class="course-detail-card__description mb-6">
              {{ course.description }}
            </p>

            <!-- 课程标签 -->
            <div class="course-detail-card__tags mb-6">
              <span class="course-card__tag cursor-pointer" :title="course.semester || course.category">
                {{ course.semester || course.category }}
              </span>
              <span
                v-for="tagId in course.tags"
                :key="tagId"
                @click="goToCoursesListByTag(tagId)"
                class="course-card__tag cursor-pointer hover:bg-gray-200 transition-colors"
                :title="getTagById(tagId).name"
              >
                {{ getTagById(tagId).name }}
              </span>
            </div>

            <!-- 课程统计信息 -->
            <div class="course-detail-card__stats mb-6">
              <!-- 收藏按钮 -->
              <div class="course-detail-card__stats-item" @click="handleCollect" :title="isCollected ? '取消收藏' : '收藏课程'">
                <i :class="[
                  'mb-1 transition-transform hover:scale-110',
                  isCollected ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400'
                ]"></i>
                <span>{{ course.stars }}</span>
              </div>

              <!-- 浏览量 -->
              <div class="course-detail-card__stats-item" title="浏览量">
                <i class="fas fa-eye text-blue-400 mb-1"></i>
                <span>{{ course.views }}</span>
              </div>

              <!-- 学生数 -->
              <div class="course-detail-card__stats-item" title="学习人数">
                <i class="fas fa-users text-green-400 mb-1"></i>
                <span>{{ course.students }}</span>
              </div>

              <!-- 讲师信息 -->
              <div class="course-detail-card__stats-item cursor-pointer hover:text-blue-600 transition-colors"
                   @click="goToTeacher(course.teacherId)"
                   :title="`查看${course.teacherName}的详情`">
                <i class="fas fa-user-graduate text-purple-400 mb-1"></i>
                <span class="text-xs">{{ course.teacherName }}</span>
              </div>
            </div>

            <!-- 课程信息卡片 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ course.chapters }}</div>
                <div class="text-xs text-gray-500 mt-1">章节</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ course.durationHours }}</div>
                <div class="text-xs text-gray-500 mt-1">课时</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ course.rating }}</div>
                <div class="text-xs text-gray-500 mt-1">评分</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ course.lastUpdated }}</div>
                <div class="text-xs text-gray-500 mt-1">更新</div>
              </div>
            </div>

            <!-- 课程操作按钮 -->
            <div class="course-detail-card__actions">
              <a :href="course.url" target="_blank"
                 class="action-button enroll">
                开始学习 <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </a>
              <button @click="handleAddToPlan"
                      class="action-button secondary">
                <i class="fas fa-plus"></i> 加入学习计划
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程大纲 -->
    <div class="course-detail-card mb-8">
      <h2 class="course-detail-card__section-title">
        <i class="fas fa-list-ol"></i> 课程大纲
      </h2>
      <div class="course-detail-card__section-content">
        <div class="course-modules__list">
          <div v-for="chapter in course.syllabus" :key="chapter.id"
               class="course-module-card">
            <div class="course-module-card__header" @click="toggleChapter(chapter.id)">
              <div class="course-module-card__title">
                <i class="fas fa-play-circle text-blue-500"></i>
                {{ chapter.title }}
              </div>
              <div class="text-sm text-gray-500">
                {{ chapter.duration }} • {{ chapter.type }}
              </div>
            </div>
            <div v-if="chapter.expanded && chapter.description" class="course-module-card__lessons">
              <div class="course-lesson-card">
                <div class="course-lesson-card__description">
                  {{ chapter.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 讲师介绍 -->
    <div class="course-detail-card mb-8">
      <h2 class="course-detail-card__section-title">
        <i class="fas fa-user-graduate"></i> 讲师介绍
      </h2>
      <div class="course-detail-card__section-content">
        <div class="flex items-start gap-6">
          <img :src="course.teacherAvatar" class="w-24 h-24 rounded-full border-2 border-blue-100">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ course.teacherName }}</h3>
            <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span class="flex items-center gap-1">
                <i class="fas fa-briefcase"></i> {{ course.teacherTitle }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-graduation-cap"></i> {{ course.teacherExperience }}
              </span>
            </div>
            <p class="text-gray-600 leading-relaxed">
              {{ course.teacherBio }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="course-detail-card">
      <h2 class="course-detail-card__section-title">
        <i class="far fa-comment-dots"></i> 课程评价
        <span class="text-sm font-normal text-gray-500">
          ({{ comments.length }})
        </span>
      </h2>

      <!-- 评论排序和分页 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">排序方式:</span>
          <div class="course-form-group">
            <select v-model="sortType" @change="sortComments"
                    class="course-form-group__input w-32">
              <option value="latest">最新</option>
              <option value="hot">最热</option>
            </select>
          </div>
        </div>

        <div v-if="pagination.totalPages > 1" class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="course-button course-button--secondary course-button--sm"
          >
            上一页
          </button>
          <span class="text-sm text-gray-600">
            第 {{ pagination.page }} / {{ pagination.totalPages }} 页
          </span>
          <button
            @click="nextPage"
            :disabled="pagination.page === pagination.totalPages"
            class="course-button course-button--secondary course-button--sm"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div v-if="currentPageComments.length > 0" class="space-y-6 mb-8">
        <div
          v-for="comment in currentPageComments"
          :key="comment.id"
          class="course-lesson-card"
        >
          <div class="course-lesson-card__header">
            <img
              :src="comment.avatar || '/default-avatar.png'"
              class="w-10 h-10 rounded-full border border-gray-300"
              alt="用户头像"
            >
            <div class="course-lesson-card__title">
              <div class="font-medium text-gray-800">
                {{ comment.nickname || comment.username || '匿名用户' }}
              </div>
              <div class="flex items-center gap-2">
                <div class="text-xs text-gray-500">
                  {{ formatTime(comment.createdAt) }}
                </div>
                <div class="flex text-yellow-400">
                  <i v-for="i in 5" :key="i"
                     :class="i <= comment.rating ? 'fas fa-star' : 'far fa-star'"
                     class="text-xs"></i>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <!-- 点赞按钮 -->
              <button
                @click="handleLikeComment(comment.id)"
                class="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                :class="{ 'text-red-500': comment.isLiked }"
                :disabled="!isAuthenticated"
              >
                <i :class="comment.isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span class="text-sm">{{ comment.likes || 0 }}</span>
              </button>
              <!-- 删除按钮 -->
              <button
                v-if="checkCanDelete(comment)"
                @click="handleDeleteComment(comment.id)"
                class="text-gray-400 hover:text-red-500 transition-colors text-sm"
                title="删除评论"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="course-lesson-card__description whitespace-pre-wrap">
            {{ comment.content }}
          </div>
        </div>
      </div>

      <!-- 暂无评论 -->
      <div v-else-if="!loadingComments" class="bg-gray-50 rounded-xl p-8 text-center text-gray-400 mb-8">
        暂无评价，快来发表第一个评价吧~
      </div>

      <!-- 加载状态 -->
      <div v-if="loadingComments" class="flex items-center justify-center py-8">
        <i class="fas fa-spinner fa-spin text-xl text-blue-500 mr-2"></i>
        <span class="text-gray-500">加载评价中...</span>
      </div>

      <!-- 发表评价 -->
      <div v-if="isAuthenticated" class="mt-8">
        <div class="flex items-start gap-4">
          <img
            :src="userInfo.avatar || '/default-avatar.png'"
            class="w-10 h-10 rounded-full border border-gray-300 flex-shrink-0"
            alt="我的头像"
          >
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-3">
              <span class="text-sm text-gray-600">评分:</span>
              <div class="flex text-yellow-400">
                <i v-for="i in 5" :key="i"
                   @click="newRating = i"
                   :class="i <= newRating ? 'fas fa-star cursor-pointer' : 'far fa-star cursor-pointer'"
                   class="text-xl"></i>
              </div>
            </div>
            <div class="course-form-group">
              <textarea
                v-model="newComment"
                placeholder="写下你的课程评价... (支持emoji表情)"
                rows="3"
                class="course-form-group__textarea"
                @keydown.ctrl.enter="submitComment"
                maxlength="500"
              ></textarea>
              <div class="text-sm text-gray-500 mt-1 text-right">
                {{ newComment.length }}/500
              </div>
            </div>
            <div class="flex justify-end">
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || submittingComment"
                class="course-button course-button--primary course-button--md"
              >
                <i v-if="submittingComment" class="fas fa-spinner fa-spin"></i>
                发表评价
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 未登录提示 -->
      <div v-else class="mt-8 p-6 bg-gray-50 rounded-xl text-center">
        <p class="text-gray-600 mb-3">登录后即可发表评价</p>
        <button
          @click="goToLogin"
          class="course-button course-button--primary"
        >
          立即登录
        </button>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else-if="isLoading" class="max-w-5xl mx-auto">
    <!-- 骨架屏 -->
    <div class="course-detail-card mb-8 animate-pulse">
      <div class="course-detail-card__content">
        <div class="course-detail-card__header">
          <!-- 左侧封面区域 -->
          <div class="course-detail-card__icon bg-gray-200"></div>

          <!-- 右侧内容区域 -->
          <div class="flex-1">
            <!-- 类型骨架 -->
            <div class="flex gap-3 mb-4">
              <div class="w-16 h-6 bg-gray-200 rounded"></div>
              <div class="w-12 h-6 bg-gray-200 rounded"></div>
              <div class="w-20 h-6 bg-gray-200 rounded"></div>
            </div>

            <!-- 标题骨架 -->
            <div class="h-8 bg-gray-300 rounded mb-4 max-w-md"></div>

            <!-- 描述骨架 -->
            <div class="space-y-2 mb-6">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            <!-- 信息卡片骨架 -->
            <div class="grid grid-cols-4 gap-4 mb-6">
              <div v-for="i in 4" :key="i" class="h-16 bg-gray-100 rounded-xl"></div>
            </div>

            <!-- 按钮骨架 -->
            <div class="flex gap-4">
              <div class="w-32 h-10 bg-gray-300 rounded-lg"></div>
              <div class="w-32 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程大纲骨架屏 -->
    <div class="course-detail-card mb-8 animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-5 h-5 bg-blue-200 rounded"></div>
        <div class="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
      <div class="course-detail-card__section-content">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- 讲师介绍骨架屏 -->
    <div class="course-detail-card mb-8 animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-5 h-5 bg-green-200 rounded"></div>
        <div class="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
      <div class="course-detail-card__section-content">
        <div class="flex gap-6 items-start">
          <div class="w-24 h-24 rounded-full bg-gray-200"></div>
          <div class="flex-1 space-y-3">
            <div class="h-6 bg-gray-300 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价区域骨架屏 -->
    <div class="course-detail-card animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-5 h-5 bg-gray-300 rounded"></div>
        <div class="h-6 w-16 bg-gray-300 rounded"></div>
        <div class="h-4 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCoursesStore } from '@/store/courseStore'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api'
import { storeToRefs } from 'pinia'
import { predefinedTags } from '@/data/course/tags'

const router = useRouter()
const route = useRoute()
const coursesStore = useCoursesStore()

const {
  userInfo,
  isAuthenticated
} = storeToRefs(coursesStore)

// 一、变量声明
const course = ref(null)
const isCollected = ref(false)
const isLoading = ref(false)
const comments = ref([])
const loadingComments = ref(false)
const submittingComment = ref(false)
const newComment = ref('')
const newRating = ref(5)
const sortType = ref('latest')
const pagination = ref({
  page: 1,
  pageSize: 4,
  total: 0,
  totalPages: 0
})

// 二、计算属性
const currentPageComments = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedComments.value.slice(start, end)
})

const sortedComments = computed(() => {
  const sorted = [...comments.value]
  if (sortType.value === 'latest') {
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortType.value === 'hot') {
    return sorted.sort((a, b) => {
      if (b.likes !== a.likes) return b.likes - a.likes
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }
  return sorted
})

// 三、方法
const getTagById = (tagId) => {
  return predefinedTags.find(tag => tag.id === tagId) || { name: tagId }
}

const goToCoursesListByTag = (tagId) => {
  const tag = getTagById(tagId)
  router.push({
    name: 'CoursesList',
    query: {
      tagId,
      tagName: tag.name
    }
  })
}

const checkCollectionStatus = async (courseId) => {
  try {
    const response = await HttpManager.getUserCollection()
    isCollected.value = response.data?.some(item =>
      item.resourceId === parseInt(courseId) && item.resourceType === 'course'
    )
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

const handleCollect = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    if (isCollected.value) {
      await HttpManager.removeCourseCollection(course.value.id, 'course')
    } else {
      await HttpManager.toggleCourseCollection(course.value.id, 'course')
    }

    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
  } catch (error) {
    ElMessage.error(error.message || '切换收藏状态操作失败')
  }
}

const handleAddToPlan = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  ElMessage.success('已添加到学习计划')
}

const goToTeacher = (teacherId) => {
  router.push({ name: 'TeacherDetail', params: { id: teacherId } })
}

const loadCourseDetail = async (id) => {
  isLoading.value = true
  try {
    const data = await coursesStore.getCourseDetail(id)
    course.value = data

    // 为章节添加展开状态
    if (course.value.syllabus) {
      course.value.syllabus = course.value.syllabus.map(chapter => ({
        ...chapter,
        expanded: false
      }))
    }

    if (isAuthenticated.value) {
      await checkCollectionStatus(id)
    }
    await fetchComments(id)
  } catch (error) {
    ElMessage.error('加载课程详情失败')
  } finally {
    isLoading.value = false
  }
}

const toggleChapter = (chapterId) => {
  if (course.value.syllabus) {
    const chapter = course.value.syllabus.find(c => c.id === chapterId)
    if (chapter) {
      chapter.expanded = !chapter.expanded
    }
  }
}

const fetchComments = async (courseId) => {
  loadingComments.value = true
  try {
    const response = await HttpManager.getCourseComments(courseId)
    if (response.code === 200 && response.data) {
      comments.value = response.data.map(comment => ({
        ...comment,
        canDelete: isAuthenticated.value &&
          (userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin')
      }))
      updatePagination()
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    comments.value = []
  } finally {
    loadingComments.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('评价内容不能为空')
    return
  }
  submittingComment.value = true
  try {
    const response = await HttpManager.addCourseComment(course.value.id, {
      content: newComment.value.trim(),
      rating: newRating.value
    })
    if (response.code === 200 && response.data) {
      const newCommentData = {
        ...response.data,
        canDelete: true
      }
      comments.value.unshift(newCommentData)
      updatePagination()
      newComment.value = ''
      newRating.value = 5
      ElMessage.success('评价发表成功')
    } else {
      throw new Error(response.message || '发表评价失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '发表失败')
  } finally {
    submittingComment.value = false
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    await ElMessage.confirm('确定要删除这条评价吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await HttpManager.deleteCourseComment(course.value.id, commentId)
    if (response.code === 200) {
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
        updatePagination()
      }
      ElMessage.success('评价已删除')
    } else {
      throw new Error(response.message || '删除评价失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleLikeComment = async (commentId) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const response = await HttpManager.toggleCommentLike(course.value.id, commentId)
    if (response.code === 200 && response.data) {
      const commentIndex = comments.value.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        const comment = comments.value[commentIndex]
        const wasLiked = comment.isLiked
        comments.value[commentIndex] = {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !wasLiked
        }
        if (sortType.value === 'hot') {
          comments.value = [...comments.value]
        }
      }
      ElMessage.success(response.data.isLiked ? '已点赞' : '已取消点赞')
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

const checkCanDelete = (comment) => {
  if (!isAuthenticated.value) return false
  return userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin'
}

const sortComments = () => {
  pagination.value.page = 1
}

const updatePagination = () => {
  pagination.value.total = comments.value.length
  pagination.value.totalPages = Math.ceil(comments.value.length / pagination.value.pageSize)
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
  }
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const now = new Date()
  const commentTime = new Date(timeString)
  const diffInSeconds = Math.floor((now - commentTime) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}天前`
  } else {
    return commentTime.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}

// 四、生命周期函数
onMounted(async () => {
  const id = route.params.id
  await loadCourseDetail(id)
})
</script>

<style scoped>
@import '@/assets/css/index.css';

    &:hover {
      background: $course-gray-200;
    }
  }
}

/* 自定义课程详情样式 */
.course-detail-card {
  .course-detail-card__stats-item {
    &:hover {
      color: $course-primary;
    }
  }

  .course-card__tag {
    &:hover {
      background: $course-gray-100;
      color: $course-primary;
    }
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .course-detail-card__header {
    flex-direction: column;
    gap: $course-spacing-lg;
  }

  .course-detail-card__icon {
    width: 5rem;
    height: 5rem;
  }
}
</style>

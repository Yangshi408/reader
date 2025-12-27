<template>
  <div v-if="project && !isLoading" class="animate-fade-in max-w-5xl mx-auto">
    <!-- 项目信息区域 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-8 items-start mb-8 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <!-- 左侧图标和统计 -->
      <div class="flex flex-col items-center gap-4 min-w-[120px]">
        <div class="w-28 h-28 rounded-3xl bg-gray-50 p-2 shadow-inner border border-gray-200">
          <img :src="project.logo" class="w-full h-full object-contain rounded-2xl" alt="icon">
        </div>

        <!-- 统计数据 -->
        <div class="flex gap-6 text-gray-500 text-sm font-medium">
          <div class="flex flex-col items-center cursor-pointer" @click="handleCollect">
            <i :class="[
              'text-lg mb-1 transition-transform hover:scale-110',
              isCollected ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400'
            ]"></i>
            <span>{{ project.stars }}</span>
          </div>
          <div class="flex flex-col items-center">
            <i class="fas fa-eye text-blue-400 text-lg mb-1"></i>
            <span>{{ project.views }}</span>
          </div>
          <div class="flex flex-col items-center">
            <i class="fas fa-code-branch text-green-400 text-lg mb-1"></i>
            <span>{{ project.contributors?.length || 0 }}</span>
          </div>
        </div>

        <!-- 贡献者 -->
        <div
          v-if="project.contributors && project.contributors.length > 0"
          class="flex items-center gap-2 mt-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
          <img :src="project.contributors[0].avatar" alt='用户头像' class="w-5 h-5 rounded-full">
          <span class="text-xs text-gray-600">{{ project.contributors[0].name }}</span>
        </div>
      </div>

      <!-- 右侧信息 -->
      <div class="flex-1 z-10">
        <!-- 项目标签 -->
        <div class="flex gap-3 mb-4">
          <span class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">{{ project.category }}</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{{ project.license || '开源' }}</span>
          <span v-if="project.status === 'active'" class="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">活跃中</span>
          <span v-else class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">已归档</span>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ project.name }}</h1>

        <p class="text-gray-600 leading-relaxed mb-6">
          {{ project.description }}
        </p>

        <!-- 技术栈标签 -->
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span class="whitespace-nowrap">技术栈:</span>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="cursor-pointer px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 hover:scale-105 hover:shadow-sm bg-blue-100 text-blue-700"
              :title="tech"
            >
              {{ tech }}
            </span>
            <div v-if="!project.technologies || project.technologies.length === 0" class="text-gray-400 text-sm">
              暂无技术栈
            </div>
          </div>
        </div>

        <!-- 项目链接 -->
        <div class="flex gap-4">
          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank"
             class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors group">
            <i class="fab fa-github"></i> GitHub
            <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </a>
          <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank"
             class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors group">
            <i class="fas fa-external-link-alt"></i> 在线演示
            <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
        <p class="mt-2 text-xs text-gray-400">点击链接访问项目仓库或在线演示。</p>
      </div>
    </div>

    <!-- 项目详情区域 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-bold text-[#00a99d] flex items-center gap-2 mb-6">
        <i class="fas fa-book"></i> 项目详情
      </h2>
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div class="whitespace-pre-line leading-relaxed text-gray-700">
          {{ project.details }}
        </div>
      </div>
    </div>

    <!-- 贡献者区域 -->
    <div v-if="project.contributors && project.contributors.length > 0" class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
        <i class="fas fa-users"></i> 贡献者
        <span class="text-sm font-normal text-gray-500">
          ({{ project.contributors.length }})
        </span>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="contributor in project.contributors" :key="contributor.id"
             class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
          <img :src="contributor.avatar" alt='用户头像' class="w-10 h-10 rounded-full border border-gray-300">
          <div>
            <div class="font-medium text-gray-800">{{ contributor.name }}</div>
            <div class="text-xs text-gray-500">{{ contributor.role || '贡献者' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
        <i class="far fa-comment-dots"></i> 评论
        <span class="text-sm font-normal text-gray-500">
          ({{ comments.length }})
        </span>
      </h2>

      <!-- 评论排序和分页 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">排序方式:</span>
          <el-select
            v-model="sortType"
            size="small"
            @change="sortComments"
            class="w-32"
          >
            <el-option label="最新" value="latest" />
            <el-option label="最热" value="hot" />
          </el-select>
        </div>

        <div v-if="pagination.totalPages > 1" class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="text-sm text-gray-600">
            第 {{ pagination.page }} / {{ pagination.totalPages }} 页
          </span>
          <button
            @click="nextPage"
            :disabled="pagination.page === pagination.totalPages"
            class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          class="comment-card bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <img
                :src="comment.avatar || '/default-avatar.png'"
                class="w-10 h-10 rounded-full border border-gray-300"
                alt="用户头像"
              >
              <div>
                <div class="font-medium text-gray-800">
                  {{ comment.nickname || comment.username || '匿名用户' }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(comment.createdAt) }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button
                @click="handleLikeComment(comment.id)"
                class="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                :class="{ 'text-red-500': comment.isLiked }"
                :disabled="!isAuthenticated"
              >
                <i :class="comment.isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span class="text-sm">{{ comment.likes || 0 }}</span>
              </button>
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
          <div class="comment-content text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ comment.content }}
          </div>
        </div>
      </div>

      <!-- 暂无评论 -->
      <div v-else-if="!loadingComments" class="bg-gray-50 rounded-xl p-8 text-center text-gray-400 mb-8">
        暂无评论，快来发表第一条评论吧~
      </div>

      <!-- 加载状态 -->
      <div v-if="loadingComments" class="flex items-center justify-center py-8">
        <i class="fas fa-spinner fa-spin text-xl text-blue-500 mr-2"></i>
        <span class="text-gray-500">加载评论中...</span>
      </div>

      <!-- 发表评论 -->
      <div v-if="isAuthenticated" class="mt-8">
        <div class="flex items-start gap-4">
          <img
            :src="userInfo.avatar || '/default-avatar.png'"
            class="w-10 h-10 rounded-full border border-gray-300 flex-shrink-0"
            alt="我的头像"
          >
          <div class="flex-1">
            <textarea
              v-model="newComment"
              placeholder="写下你的评论... (支持emoji表情)"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
              @keydown.ctrl.enter="submitComment"
              maxlength="500"
            ></textarea>
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm text-gray-500">
                {{ newComment.length }}/500
              </div>
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || submittingComment"
                class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <i v-if="submittingComment" class="fas fa-spinner fa-spin"></i>
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 未登录提示 -->
      <div v-else class="mt-8 p-6 bg-gray-50 rounded-xl text-center">
        <p class="text-gray-600 mb-3">登录后即可发表评论</p>
        <button
          @click="goToLogin"
          class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          立即登录
        </button>
      </div>
    </div>
  </div>
  <!-- 加载状态 -->
  <div v-else-if="isLoading" class="max-w-5xl mx-auto">
    <!-- 项目信息骨架屏 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 animate-pulse">
      <div class="flex gap-8 items-start">
        <!-- 左侧图标区域 -->
        <div class="flex flex-col items-center gap-4 min-w-[120px]">
          <div class="w-28 h-28 rounded-3xl bg-gray-200"></div>
          <div class="flex gap-6">
            <div class="flex flex-col items-center">
              <div class="w-6 h-6 rounded-full bg-gray-200 mb-1"></div>
              <div class="h-3 w-8 bg-gray-200 rounded"></div>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-6 h-6 rounded-full bg-gray-200 mb-1"></div>
              <div class="h-3 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div class="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="flex-1">
          <!-- 标签骨架 -->
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

          <!-- 标签骨架 -->
          <div class="flex items-center gap-4 mb-6">
            <div class="w-8 h-4 bg-gray-200 rounded"></div>
            <div class="flex gap-2">
              <div class="w-16 h-6 bg-gray-200 rounded-full"></div>
              <div class="w-12 h-6 bg-gray-200 rounded-full"></div>
              <div class="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <!-- 按钮骨架 -->
          <div class="w-32 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-48 h-3 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
    </div>

    <!-- 项目详情骨架屏 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-5 h-5 bg-blue-200 rounded"></div>
        <div class="h-6 w-24 bg-gray-300 rounded"></div>
      </div>

      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-11/12"></div>
          <div class="h-4 bg-gray-200 rounded w-10/12"></div>
          <div class="h-4 bg-gray-200 rounded w-9/12"></div>
        </div>
      </div>
    </div>

    <!-- 评论区域骨架屏 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-5 h-5 bg-gray-300 rounded"></div>
        <div class="h-6 w-16 bg-gray-300 rounded"></div>
        <div class="h-4 w-8 bg-gray-200 rounded"></div>
      </div>

      <!-- 排序和分页骨架 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
          <div class="w-32 h-8 bg-gray-200 rounded"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-16 h-8 bg-gray-200 rounded"></div>
          <div class="w-20 h-4 bg-gray-200 rounded"></div>
          <div class="w-16 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- 评论列表骨架 -->
      <div class="space-y-6 mb-8">
        <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-300"></div>
              <div class="space-y-2">
                <div class="h-4 w-24 bg-gray-300 rounded"></div>
                <div class="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-6 bg-gray-200 rounded"></div>
              <div class="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div class="space-y-2 mt-4">
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- 发表评论骨架 -->
      <div class="mt-8">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div class="flex-1">
            <div class="w-full h-24 bg-gray-100 rounded-lg"></div>
            <div class="flex justify-between items-center mt-3">
              <div class="w-12 h-3 bg-gray-200 rounded"></div>
              <div class="w-24 h-8 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex' // 修改：使用 Vuex
import { ElMessage, ElMessageBox } from 'element-plus'
import { HttpManager } from '@/api'
// 假设有项目标签数据
// import { projectTags } from '@/store/projectTags'
import {
  addMockProjectComment,
  deleteMockProjectComment,
  getCommentsByProjectId,
  toggleLikeMockProjectComment
} from '@/data/project/mockData'

const router = useRouter()
const route = useRoute()
const store = useStore()

const userInfo = computed(() => store.getters.userInfo)
const isAuthenticated = computed(() => store.getters.isLoggedIn)

// 一、变量声明
const project = ref(null)
const isCollected = ref(false)
const isLoading = ref(false)
const comments = ref([])
const loadingComments = ref(false)
const submittingComment = ref(false)
const newComment = ref('')
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
const checkCollectionStatus = async (projectId) => {
  try {
    const response = await HttpManager.getUserCollection()
    isCollected.value = response.data?.some(item =>
      item.resourceId === parseInt(projectId) && item.resourceType === 'project'
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
      await HttpManager.removeProjectCollection(project.value.id)
    } else {
      await HttpManager.toggleProjectCollection(project.value.id)
    }

    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
  } catch (error) {
    ElMessage.error(error.message || '切换收藏状态操作失败')
  }
}

const loadProjectDetail = async (id) => {
  isLoading.value = true
  try {
    project.value = await store.dispatch('getProjectDetail', id)

    if (isAuthenticated.value) {
      await checkCollectionStatus(id)
    }
    await fetchComments(id)
  } catch (error) {
    ElMessage.error('加载项目详情失败')
  } finally {
    isLoading.value = false
  }
}

const fetchComments = async (projectId) => {
  loadingComments.value = true
  try {
    const response = await HttpManager.getProjectComments(projectId)
    if (response.code === 200 && response.data) {
      comments.value = response.data.map(comment => ({
        ...comment,
        canDelete: isAuthenticated.value &&
          (userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin')
      }))
      updatePagination()
    }
  } catch (error) {
    console.error('获取评论失败，使用模拟数据:', error)
    const mockComments = getCommentsByProjectId(parseInt(projectId))
    comments.value = mockComments.map(comment => ({
      ...comment,
      canDelete: isAuthenticated.value &&
        (userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin')
    }))
    updatePagination()
  } finally {
    loadingComments.value = false
  }
}

const submitComment = async () => {
  if (!(newComment.value || '').trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  submittingComment.value = true
  try {
    const response = await HttpManager.addProjectComment(project.value.id, {
      content: (newComment.value || '').trim()
    })
    if (response.code === 200 && response.data) {
      const newCommentData = {
        ...response.data,
        canDelete: true
      }
      comments.value.unshift(newCommentData)
      updatePagination()
      newComment.value = ''
      ElMessage.success('评论发表成功')
    } else {
      throw new Error(response.message || '发表评论失败')
    }
  } catch (error) {
    console.error('发布评论失败，使用模拟数据:', error)
    const newCommentData = addMockProjectComment(project.value.id, newComment.value, 'project')
    comments.value.unshift({ ...newCommentData })
    updatePagination()
    newComment.value = ''
    ElMessage.success('评论发布成功')
  } finally {
    submittingComment.value = false
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await HttpManager.deleteProjectComment(project.value.id, commentId)

    if (response.code === 200) {
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
        updatePagination()
      }
      ElMessage.success('评论已删除')
    } else {
      throw new Error(response.message || '删除评论失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败，使用模拟数据:', error)
      deleteMockProjectComment(commentId)
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
        updatePagination()
      }
      ElMessage.success('评论已删除')
    }
  }
}

const handleLikeComment = async (commentId) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const response = await HttpManager.toggleCommentLike(project.value.id, commentId)
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
    console.error('点赞评论失败，使用模拟数据:', error)
    toggleLikeMockProjectComment(commentId)
    const commentIndex = comments.value.findIndex(c => c.id === commentId)
    if (commentIndex !== -1) {
      const comment = comments.value[commentIndex]
      const wasLiked = comment.isLiked
      comments.value[commentIndex] = {
        ...comment,
        likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !wasLiked
      }
      ElMessage.success('点赞成功')
    }
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
  await loadProjectDetail(id)
})
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
@import '../../assets/css/indexPro';

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.comment-card {
  transition: all 0.2s ease;
}

.comment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.comment-content {
  word-break: break-word;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

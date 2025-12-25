<template>
  <div v-if="tool && !isLoading" class="animate-fade-in max-w-5xl mx-auto">
    <!-- 工具信息区域  -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-8 items-start mb-8 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div class="flex flex-col items-center gap-4 min-w-[120px]">
        <div class="w-28 h-28 rounded-3xl bg-gray-50 p-2 shadow-inner border border-gray-200">
          <img :src="tool.logo" class="w-full h-full object-contain rounded-2xl" alt="icon">
        </div>
        <div class="flex gap-6 text-gray-500 text-sm font-medium">
          <!-- 工具收藏按钮 -->
          <div class="flex flex-col items-center cursor-pointer" @click="handleCollect">
            <i :class="[
              'text-lg mb-1 transition-transform hover:scale-110',
              isCollected ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400'
            ]"></i>
            <span>{{ tool.stars }}</span>
          </div>
          <div class="flex flex-col items-center">
            <i class="fas fa-eye text-blue-400 text-lg mb-1"></i>
            <span>{{ tool.views }}</span>
          </div>
        </div>
        <!-- 贡献者 -->
        <div
          class="flex items-center gap-2 mt-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
          <img :src="userInfo.avatar || '/default-avatar.png'" class="w-5 h-5 rounded-full">
          <span class="text-xs text-gray-600">Admin</span>
        </div>
      </div>
      <!-- 工具信息 -->
      <div class="flex-1 z-10">
        <!-- 工具类型 -->
        <div class="flex gap-3 mb-4">
          <span class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">论文阅读</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">外部工具</span>
          <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">科学上网</span>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ tool.name }}</h1>

        <p class="text-gray-600 leading-relaxed mb-6">
          {{ tool.fullDesc }}
        </p>

        <!-- 工具标签 -->
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span class="whitespace-nowrap">标签:</span>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="tagId in tool.tags"
              :key="tagId"
              @click="goToToolsListByTag(tagId)"
              :class="[
                'cursor-pointer px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
                'flex items-center gap-1 hover:scale-105 hover:shadow-sm',
                getTagById(tagId).color || 'bg-gray-100 text-gray-700'
              ]"
              :title="getTagById(tagId).name"
            >
              {{ getTagById(tagId).name }}
              <i class="fas fa-external-link-alt text-xs opacity-70"></i>
            </span>
            <div v-if="!tool.tags || tool.tags.length === 0" class="text-gray-400 text-sm">
              暂无标签
            </div>
          </div>
        </div>

        <!-- 工具链接 -->
        <a :href="tool.url" target="_blank"
          class="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors group">
          链接直达 <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
        </a>
        <p class="mt-2 text-xs text-gray-400">链接直达，点击后跳转新页面，为对应工具的网页。</p>
      </div>
    </div>
    <!-- 使用说明 -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-bold text-[#00a99d] flex items-center gap-2 mb-6">
        <i class="fas fa-info-circle"></i> 使用说明
      </h2>
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <!-- 使用 pre-line 保留换行符，并设置合适的行高 -->
        <div class="whitespace-pre-line leading-relaxed text-gray-700">
          {{ tool.instructions }}
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
              <!-- 删除按钮（仅对作者或管理员显示） -->
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
    <tool-detail-skeleton />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToolsStore } from '@/store/toolsStore'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api'
import { storeToRefs } from 'pinia'
import { predefinedTags } from '@/data/tags'
import { addMockComment, deleteMockComment, getCommentsByToolId, toggleLikeMockComment } from '@/data/mockData'
import ToolDetailSkeleton from './ToolDetailSkeleton.vue'

const router = useRouter()
const route = useRoute()
const toolsStore = useToolsStore()

const {
  userInfo,
  isAuthenticated
} = storeToRefs(toolsStore)

// 一、变量声明
// 1. 工具详情相关变量
const tool = ref(null)
const isCollected = ref(false)
const isLoading = ref(false)
// 2. 评论相关变量
const comments = ref([]) // 所有评论
const loadingComments = ref(false)
const submittingComment = ref(false)
const newComment = ref('')
const sortType = ref('latest') // 'latest' | 'hot'
// 分页相关
const pagination = ref({
  page: 1,
  pageSize: 4,
  total: 0,
  totalPages: 0
})
// 3. 标记变量，用于组件卸载时取消异步操作
const isComponentMounted = ref(true)

// 二、计算属性
// 2. 当前页显示的评论
const currentPageComments = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedComments.value.slice(start, end)
})

// 3. 排序后的评论
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
// 1. 通过标签id获取标签的信息（name、css样式）
const getTagById = (tagId) => {
  return predefinedTags.find(tag => tag.id === tagId) || { name: tagId }
}
// 2. 点击标签的跳转逻辑
const goToToolsListByTag = (tagId) => {
  // 获取标签的显示名称
  const tag = getTagById(tagId)
  const tagName = tag.name
  // 跳转到工具列表页，并传递标签参数
  router.push({
    name: 'ToolsList',
    query: {
      tagId,
      tagName // 可选的，用于显示友好名称
    }
  })
}
// 3. 检测该用户是否收藏
const checkCollectionStatus = async (toolId) => {
  try {
    // const response = await HttpManager.getUserCollection()
    const response = await mockGetUserCollection() // 模拟
    isCollected.value = response.data?.some(item =>
      item.resourceId === parseInt(toolId) && item.resourceType === 'tool'
    )
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}
// 4. 收藏功能
const handleCollect = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    if (isCollected.value) {
      // 取消收藏
      // await HttpManager.removeToolCollection(tool.value.id, 'tool')
      await mockRemoveToolCollection(tool.value.id, 'tool') // 模拟
    } else {
      // 添加收藏
      // await HttpManager.toggleToolCollection(tool.value.id, 'tool')
      await mockToggleToolCollection(tool.value.id, 'tool') // 模拟
    }

    // 更新收藏状态
    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
  } catch (error) {
    ElMessage.error(error.message || '切换收藏状态操作失败')
  }
}
// 为方法4提供的收藏模拟
let mockUserCollection = []
const mockGetUserCollection = async () => {
  return new Promise((resolve) => {
    // 模拟网络延迟（500毫秒，贴近真实接口体验）
    setTimeout(() => {
      // 返回和真实接口结构一致的响应数据
      resolve({
        code: 200,
        data: mockUserCollection, // 包含用户收藏列表
        message: '获取收藏列表成功'
      })
    }, 500)
  })
}
const mockRemoveToolCollection = async (resourceId, resourceType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从模拟收藏列表中删除对应资源
      mockUserCollection = mockUserCollection.filter(
        item => !(item.resourceId === resourceId && item.resourceType === resourceType)
      )
      resolve({
        code: 200,
        message: '取消收藏成功'
      })
    }, 500)
  })
}
const mockToggleToolCollection = async (resourceId, resourceType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 向模拟收藏列表中添加对应资源（避免重复添加，虽然原逻辑已判断，但模拟后端做一层防护）
      const isExist = mockUserCollection.some(
        item => item.resourceId === resourceId && item.resourceType === resourceType
      )
      if (!isExist) {
        mockUserCollection.push({ resourceId, resourceType })
      }
      resolve({
        code: 200,
        message: '收藏成功'
      })
    }, 500)
  })
}
// 5. 加载工具详细信息（在onMounted中使用）
const loadToolDetail = async (id) => {
  isLoading.value = true
  toolsStore.setToolSubmitDisabled(true) // 禁用工具提交按钮（主要是组件过渡动画和组件创建相互冲突，导致工具提交页组件未被创建。onMounted使用异步函数是导火索）

  try {
    const data = await toolsStore.getToolDetail(id)
    if (!isComponentMounted.value) return // 检查组件是否已卸载

    tool.value = data
    isLoading.value = false // 提前结束加载状态
    toolsStore.setToolSubmitDisabled(false) // 启用工具提交按钮

    // 非核心数据后台加载（不阻塞UI）
    Promise.allSettled([
      isAuthenticated.value ? checkCollectionStatus(id) : Promise.resolve(),
      fetchComments(id)
    ])
  } catch (error) {
    if (!isComponentMounted.value) return
    console.error('加载核心数据失败:', error)
  }
}
// 6. 获取评论
const fetchComments = async (toolId) => {
  loadingComments.value = true
  try {
    const response = await HttpManager.getToolComments(toolId)
    if (!isComponentMounted.value) return // 检查组件是否已卸载

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
    // comments.value = []

    // 以下是模拟时使用
    // API失败时使用模拟数据
    const mockComments = getCommentsByToolId(parseInt(toolId))
    comments.value = mockComments.map(comment => ({
      ...comment, // 创建副本，避免使用同一个对象的引用
      canDelete: isAuthenticated.value &&
                (userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin')
    }))
    updatePagination()
  } finally {
    if (isComponentMounted.value) {
      loadingComments.value = false
    }
  }
}
// 7. 发表评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  submittingComment.value = true
  try {
    const response = await HttpManager.addToolComment(tool.value.id, {
      content: newComment.value.trim()
    })
    if (response.code === 200 && response.data) {
      // 添加新评论到列表
      const newCommentData = {
        ...response.data,
        canDelete: true // 用户自己的评论可以删除
      }
      comments.value.unshift(newCommentData)
      updatePagination()
      newComment.value = ''
      ElMessage.success('评论发表成功')
    } else {
      throw new Error(response.message || '发表评论失败')
    }
  } catch (error) {
    // ElMessage.error(error.message || '发表失败')

    // 以下是模拟时使用
    // API失败时使用模拟数据
    console.error('发布评论失败，使用模拟数据:', error)
    const newCommentData = addMockComment(tool.value.id, newComment.value)
    comments.value.unshift({ ...newCommentData })
    updatePagination()
    newComment.value = ''
    ElMessage.success('评论发布成功')
  } finally {
    submittingComment.value = false
  }
}
// 8. 删除评论
const handleDeleteComment = async (commentId) => {
  try {
    await ElMessage.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await HttpManager.deleteToolComment(tool.value.id, commentId)

    if (response.code === 200) {
      // 从列表中移除
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
      // ElMessage.error(error.message || '删除失败')

      // 以下是模拟时使用
      // API失败时使用模拟数据
      console.error('删除评论失败，使用模拟数据:', error)
      deleteMockComment(commentId)
      // 从列表中移除
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
        updatePagination()
      }
      ElMessage.success('评论已删除')
    }
  }
}
// 9. 点赞/取消点赞评论
const handleLikeComment = async (commentId) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const response = await HttpManager.toggleCommentLike(tool.value.id, commentId)
    if (response.code === 200 && response.data) {
      // 更新评论的点赞状态
      const commentIndex = comments.value.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        const comment = comments.value[commentIndex]
        const wasLiked = comment.isLiked
        comments.value[commentIndex] = {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !wasLiked
        }
        // 如果需要重新排序
        if (sortType.value === 'hot') {
          // 重新排序
          comments.value = [...comments.value]
        }
      }
      ElMessage.success(response.data.isLiked ? '已点赞' : '已取消点赞')
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    // ElMessage.error(error.message || '操作失败')

    // 以下是模拟时使用
    // API失败时使用模拟数据
    console.error('点赞评论失败，使用模拟数据:', error)
    toggleLikeMockComment(commentId)
    // 更新评论的点赞状态
    const commentIndex = comments.value.findIndex(c => c.id === commentId)
    if (commentIndex !== -1) {
      const comment = comments.value[commentIndex]
      const wasLiked = comment.isLiked
      comments.value[commentIndex] = {
        ...comment,
        likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !wasLiked
      }
      console.log(comments.value[commentIndex].isLiked)
      ElMessage.success('点赞成功')
    }
  }
}

// 10. 检查是否可删除评论
const checkCanDelete = (comment) => {
  if (!isAuthenticated.value) return false
  return userInfo.value?.id === comment.userId || userInfo.value?.role === 'admin'
}

// 11. 排序评论
const sortComments = () => {
  // computed属性会自动处理排序
  // 只需重置到第一页
  pagination.value.page = 1
}

// 12. 更新分页信息
const updatePagination = () => {
  pagination.value.total = comments.value.length
  pagination.value.totalPages = Math.ceil(comments.value.length / pagination.value.pageSize)
}

// 13. 上一页
const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

// 14. 下一页
const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
  }
}
// 15. 跳转到登录页
const goToLogin = () => {
  router.push({ name: 'Login' })
}
// 16. 格式化时间显示
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
  } else if (diffInSeconds < 2592000) { // 30天
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
// 1. 组件加载时加载数据
onMounted(async () => {
  isComponentMounted.value = true
  const id = route.params.id
  await loadToolDetail(id)
})
// 2. 组件卸载时标记
onUnmounted(() => {
  isComponentMounted.value = false
})
</script>

<style scoped>
/* 样式保持不变 */
@import '@/assets/css/index.css';

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

/* 自定义滚动条 */
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

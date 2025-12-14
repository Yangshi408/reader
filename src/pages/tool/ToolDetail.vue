<template>
  <div v-if="tool && !isLoading" class="animate-fade-in max-w-5xl mx-auto">
    <div
      class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-8 items-start mb-8 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div class="flex flex-col items-center gap-4 min-w-[120px]">
        <div class="w-28 h-28 rounded-3xl bg-gray-50 p-2 shadow-inner border border-gray-200">
          <img :src="tool.logo" class="w-full h-full object-contain rounded-2xl" alt="icon">
        </div>
        <div class="flex gap-6 text-gray-500 text-sm font-medium">
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

        <div
          class="flex items-center gap-2 mt-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
          <img :src="user.avatar" class="w-5 h-5 rounded-full">
          <span class="text-xs text-gray-600">Admin</span>
        </div>
      </div>

      <div class="flex-1 z-10">
        <div class="flex gap-3 mb-4">
          <span class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">论文阅读</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">外部工具</span>
          <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">科学上网</span>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ tool.name }}</h1>

        <p class="text-gray-600 leading-relaxed mb-6">
          {{ tool.fullDesc }}
        </p>

        <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>标签:</span>
          <div class="flex gap-2">
            <span v-for="tag in tool.tags" :key="tag"
              class="text-blue-500 bg-blue-50 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100">{{ tag }} <i
                class="fas fa-external-link-alt text-xs ml-1"></i></span>
          </div>
        </div>

        <a :href="tool.url" target="_blank"
          class="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors group">
          链接直达 <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
        </a>
        <p class="mt-2 text-xs text-gray-400">链接直达，点击后跳转新页面，为对应工具的网页。</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-bold text-[#00a99d] flex items-center gap-2 mb-6">
        <i class="fas fa-info-circle"></i> 使用说明
      </h2>
      <div
        class="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
        <span></span>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
        <i class="far fa-comment-dots"></i> 评论
      </h2>
      <div class="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
        暂无评论，快来抢沙发吧~
      </div>
    </div>
  </div>
  <!-- 添加加载状态 -->
  <div v-else-if="isLoading" class="flex items-center justify-center h-64">
    <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToolsStore } from '@/store/toolsStore'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api'
import { storeToRefs } from 'pinia'

const route = useRoute()
const toolsStore = useToolsStore()

const { user } = storeToRefs(toolsStore)
const tool = ref(null)
const isCollected = ref(false)
const isLoading = ref(false)

// 计算属性：标签数组
// const tagArray = computed(() => {
//   return tool.value?.tags || []
// })

onMounted(async () => {
  const id = route.params.id
  await loadToolDetail(id)
})

const loadToolDetail = async (id) => {
  isLoading.value = true
  try {
    const data = await toolsStore.getToolDetail(id)
    tool.value = data

    // 检查收藏状态
    if (toolsStore.user.isLogin) {
      await checkCollectionStatus(id)
    }
  } catch (error) {
    ElMessage.error('加载工具详情失败')
  } finally {
    isLoading.value = false
  }
}

const checkCollectionStatus = async (toolId) => {
  try {
    const response = await HttpManager.getUserCollection()
    isCollected.value = response.data?.some(item =>
      item.resourceId === parseInt(toolId) && item.resourceType === 'tool'
    )
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

const handleCollect = async () => {
  if (!toolsStore.user.isLogin) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    await toolsStore.toggleToolCollection(tool.value.id)
    isCollected.value = !isCollected.value
    ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
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
</style>

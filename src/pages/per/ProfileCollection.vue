<!-- pages/per/ProfileCollection.vue -->
<template>
  <div class="profile-collection">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-star"></i>
        我的收藏
      </h1>
      <div class="page-actions">
        <button @click="refreshData" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
          刷新
        </button>
      </div>
    </div>

    <div class="collection-content">
      <!-- 分类筛选 -->
      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="switchCategory(category.id)"
        >
          {{ category.name }}
          <span class="category-count">{{ category.count }}</span>
        </button>
      </div>

      <!-- 收藏列表 -->
      <div class="collection-list">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          加载中...
        </div>

        <div v-else-if="collections.length === 0" class="empty-state">
          <i class="fas fa-star"></i>
          <p>暂无收藏内容</p>
        </div>

        <div v-else class="collection-grid">
          <div
            v-for="item in collections"
            :key="item.id"
            class="collection-item"
          >
            <div class="item-preview" @click="viewItem(item)">
              <img :src="item.image || getDefaultImage(item.type)" :alt="item.title" class="item-image">
              <div class="item-overlay">
                <button @click.stop="toggleCollect(item)" class="collect-btn active">
                  <i class="fas fa-star"></i>
                  已收藏
                </button>
              </div>
              <div class="item-badge" :class="item.type">
                {{ getTypeLabel(item.type) }}
              </div>
            </div>

            <div class="item-info">
              <h3 class="item-title" @click="viewItem(item)">{{ item.title }}</h3>
              <p class="item-desc">{{ item.description }}</p>

              <div class="item-meta">
                <span class="meta-item">
                  <i class="fas fa-user"></i>
                  {{ item.author }}
                </span>
                <span class="meta-item">
                  <i class="far fa-clock"></i>
                  {{ formatDate(item.createdAt) }}
                </span>
                <span class="meta-item">
                  <i class="fas fa-eye"></i>
                  {{ item.views }}
                </span>
              </div>
            </div>

            <div class="item-actions">
              <button @click="viewItem(item)" class="action-btn view-btn">
                <i class="fas fa-eye"></i>
                查看
              </button>
              <button @click="toggleCollect(item)" class="action-btn collect-btn">
                <i class="fas fa-star"></i>
                取消收藏
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button
          v-for="page in pageRange"
          :key="page"
          @click="goToPage(page)"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api'

const store = useStore()
const loading = ref(false)
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(12)

// 收藏数据
const collections = ref([])
const total = ref(0)

const categories = ref([
  { id: 'all', name: '全部', count: 0 },
  { id: 'tools', name: '工具', count: 0 },
  { id: 'courses', name: '课程', count: 0 },
  { id: 'projects', name: '项目', count: 0 }
])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const pageRange = computed(() => {
  const range = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

const getTypeLabel = (type) => {
  const labels = {
    tool: '工具',
    course: '课程',
    project: '项目'
  }
  return labels[type] || type
}

const getDefaultImage = (type) => {
  const images = {
    tool: 'https://picsum.photos/seed/tool/400/300',
    course: 'https://picsum.photos/seed/course/400/300',
    project: 'https://picsum.photos/seed/project/400/300'
  }
  return images[type] || 'https://picsum.photos/400/300'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 方法
const fetchCollections = async () => {
  loading.value = true
  try {
    const token = store.state.token || localStorage.getItem('token')
    const response = await HttpManager.getUserCollection(token)

    if (response.islogin && response.data) {
      const allCollections = [
        ...response.data.tools?.map(tool => ({
          ...tool,
          type: 'tool',
          title: tool.introduce || '工具',
          author: tool.contributer?.[0]?.nickname || '未知作者'
        })) || [],
        ...response.data.resources?.map(resource => ({
          ...resource,
          type: 'project',
          title: resource.introduce || '资源',
          author: resource.contributer?.[0]?.nickname || '未知作者'
        })) || [],
        ...response.data.teaches?.map(teach => ({
          ...teach,
          type: 'course',
          title: teach.introduce || '课程',
          author: teach.contributer?.[0]?.nickname || '未知作者'
        })) || []
      ]

      collections.value = allCollections
      total.value = allCollections.length

      // 更新分类计数
      categories.value.forEach(cat => {
        if (cat.id === 'all') {
          cat.count = allCollections.length
        } else {
          cat.count = allCollections.filter(item => item.type === cat.id.slice(0, -1)).length
        }
      })
    }
  } catch (error) {
    console.error('获取收藏失败:', error)
    ElMessage.error('获取收藏失败')
  } finally {
    loading.value = false
  }
}

const switchCategory = (categoryId) => {
  activeCategory.value = categoryId
  currentPage.value = 1
}

const viewItem = (item) => {
  // 根据类型跳转到不同页面
  const routes = {
    tool: `/tools/detail/${item.resourceId}`,
    course: `/courses/detail/${item.resourceId}`,
    project: `/projects/${item.resourceId}`
  }

  if (routes[item.type]) {
    window.location.href = routes[item.type]
  }
}

const toggleCollect = async (item) => {
  try {
    const token = store.state.token || localStorage.getItem('token')

    await HttpManager.deleteCollection(
      item.resourceType,
      item.resourceId,
      token
    )

    // 重新获取数据
    await fetchCollections()
    ElMessage.success('已取消收藏')
  } catch (error) {
    console.error('取消收藏失败:', error)
    ElMessage.error('取消收藏失败')
  }
}

const refreshData = () => {
  fetchCollections()
}

const goToPage = (page) => {
  currentPage.value = page
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  fetchCollections()
})
</script>

<style lang="scss" scoped>
.profile-collection {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    i {
      color: #f6ad55;
    }
  }

  .refresh-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }

  .category-filter {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 8px 20px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
    }

    .category-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
  }

  .collection-list {
    min-height: 400px;
  }

  .loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background: white;
    border-radius: 16px;
    padding: 48px;
    text-align: center;

    i {
      font-size: 48px;
      color: #a0aec0;
      margin-bottom: 16px;
    }

    p {
      color: #718096;
      font-size: 16px;
    }
  }

  .collection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .collection-item {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .item-preview {
    position: relative;
    height: 180px;
    overflow: hidden;
    cursor: pointer;
  }

  .item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .item-preview:hover .item-image {
    transform: scale(1.05);
  }

  .item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 50%);
    display: flex;
    justify-content: flex-end;
    padding: 12px;
  }

  .collect-btn {
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 6px;
    color: #f6ad55;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;

    &.active {
      background: #f6ad55;
      color: white;
    }

    &:hover {
      background: white;
      transform: scale(1.05);
    }
  }

  .item-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    border-radius: 4px;

    &.tool { background: #4299e1; }
    &.course { background: #48bb78; }
    &.project { background: #ed8936; }
  }

  .item-info {
    padding: 16px;
  }

  .item-title {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }

  .item-desc {
    font-size: 14px;
    color: #718096;
    line-height: 1.4;
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #a0aec0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .item-actions {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .action-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.3s ease;

    &.view-btn {
      background: #e2e8f0;
      color: #4a5568;

      &:hover {
        background: #cbd5e0;
      }
    }

    &.collect-btn {
      background: #fed7d7;
      color: #c53030;

      &:hover {
        background: #feb2b2;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
  }

  .page-btn {
    width: 40px;
    height: 40px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      border-color: #cbd5e0;
      background: #f7fafc;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
    }
  }

  @media (max-width: 768px) {
    .collection-grid {
      grid-template-columns: 1fr;
    }

    .category-filter {
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .category-btn {
      white-space: nowrap;
    }
  }
}
</style>

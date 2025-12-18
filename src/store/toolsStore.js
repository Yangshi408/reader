// src/stores/toolsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HttpManager } from '@/api'
import { mockData } from '@/data/mockData'
import { predefinedTags, tagGroups } from '@/data/tags'
import vuexStore from '@/store/index'

export const useToolsStore = defineStore('tools', () => {
  // ============ State ============
  const toolsList = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true
  })

  const searchResults = ref([])
  const activeFilters = ref({
    tags: [],
    sort: '最多浏览'
  })

  const currentToolDetail = ref(null)

  // ============ Getters ============
  // 1. 按分类分组工具
  const toolsByCategory = computed(() => {
    const grouped = {}
    toolsList.value.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = []
      }
      grouped[tool.category].push(tool)
    })
    return grouped
  })
  // // 2. 获取所有标签
  // const allTags = computed(() => {
  //   const tags = new Set()
  //   toolsList.value.forEach(tool => {
  //     tool.tags?.forEach(tag => tags.add(tag))
  //   })
  //   return Array.from(tags)
  // })
  // 按类型分组的标签（用于筛选面板）
  const tagsByCategory = computed(() => {
    return {
      平台: predefinedTags?.filter(tag =>
        ['web', 'desktop', 'mobile', 'cross-platform'].includes(tag.id)
      ),
      操作系统: predefinedTags?.filter(tag =>
        ['windows', 'macos', 'linux', 'ios', 'android'].includes(tag.id)
      ),
      技术栈: predefinedTags?.filter(tag =>
        ['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust'].includes(tag.id)
      ),
      工具类型: predefinedTags?.filter(tag =>
        ['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design'].includes(tag.id)
      ),
      用途领域: predefinedTags?.filter(tag =>
        ['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev'].includes(tag.id)
      ),
      许可证价格: predefinedTags?.filter(tag =>
        ['open-source', 'free', 'freemium', 'paid', 'subscription'].includes(tag.id)
      ),
      其他: predefinedTags?.filter(tag =>
        ['general', 'new', 'popular', 'official', 'community'].includes(tag.id)
      )
    }
  })

  // 3. 当前用户是否已登录
  // const isAuthenticated = computed(() => vuexStore.getters.isLoggedIn)
  const isAuthenticated = ref(true)

  // 4. 用户信息
  const userInfo = computed(() => vuexStore.getters.userInfo)

  // ============ Actions ============
  // 1. 初始化认证状态：调用 Vuex 的检查登录状态
  const initAuth = () => {
    vuexStore.dispatch('checkLoginStatus')
  }
  // 2. 用户登录：调用 Vuex 的 loginSuccess action 同步状态
  const login = async (credentials) => {
    try {
      const response = await HttpManager.loginIn(credentials)
      if (response.code === 200 && response.data) {
        const { token, ...userData } = response.data
        // 调用 Vuex 的 action 更新状态（由 Vuex 统一维护）
        await vuexStore.dispatch('loginSuccess', { userInfo: userData, token })
        return { success: true, user: userData, token }
      } else {
        return {
          success: false,
          message: response.message || '登录失败'
        }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || '网络错误，请稍后重试'
      }
    }
  }
  // 3. 用户注册：注册成功后无需本地维护状态，由登录时统一同步到 Vuex
  const register = async (userData) => {
    try {
      const response = await HttpManager.SignUp(userData)
      if (response.code === 200) {
        return { success: true, message: response.message || '注册成功' }
      } else {
        return {
          success: false,
          message: response.message || '注册失败'
        }
      }
    } catch (error) {
      console.error('注册失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || '网络错误，请稍后重试'
      }
    }
  }

  // 4. 获取用户资料：更新后同步到 Vuex
  const fetchUserProfile = async () => {
    try {
      if (!isAuthenticated.value) return null

      const response = await HttpManager.getUserProfile()
      if (response.code === 200 && response.data) {
        // 调用 Vuex 的 mutation 更新用户信息
        vuexStore.commit('setUserInfo', response.data)
        // 更新 localStorage（也可由 Vuex 的 action 统一处理）
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
      return null
    } catch (error) {
      console.error('获取用户资料失败:', error)
      return null
    }
  }

  // 5. 用户登出：调用 Vuex 的 logout action
  const logout = async () => {
    try {
      if (isAuthenticated.value) {
        await HttpManager.logout()
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 由 Vuex 统一清除状态
      vuexStore.dispatch('logout')
    }
  }

  // ============ 工具相关Actions ============
  // 1. 获取工具列表
  const fetchTools = async (params = {}, useMock = false) => {
    isLoading.value = true

    try {
      if (useMock) {
        // 开发阶段使用mock数据
        await new Promise(resolve => setTimeout(resolve, 500))
        toolsList.value = mockData
        categories.value = [...new Set(mockData.map(t => t.category))]
        pagination.value.total = mockData.length
      } else {
        // 调用真实API
        const response = await HttpManager.getTools({
          page: pagination.value.page,
          limit: pagination.value.limit,
          ...params
        })

        if (response.code === 200) {
          toolsList.value = response.data?.list || response.data || []
          pagination.value = {
            ...pagination.value,
            total: response.data?.total || toolsList.value.length,
            hasMore: response.data?.hasMore || false
          }

          // 提取分类
          categories.value = [...new Set(toolsList.value.map(t => t.category))]
        }
      }
    } catch (error) {
      console.error('获取工具列表失败:', error)
      // 失败时使用mock数据作为fallback
      toolsList.value = mockData
      categories.value = [...new Set(mockData.map(t => t.category))]
    } finally {
      isLoading.value = false
    }
  }

  // 2. 搜索工具
  const searchTools = async (query, params = {}) => {
    if (!query?.trim()) {
      searchResults.value = []
      return []
    }

    try {
      const response = await HttpManager.searchTools({
        q: query.trim(),
        ...params
      })

      if (response.code === 200) {
        searchResults.value = response.data || []
        return searchResults.value
      }
      return []
    } catch (error) {
      console.error('搜索失败:', error)
      // 本地搜索作为fallback
      searchResults.value = toolsList.value.filter(tool =>
        tool.name?.toLowerCase().includes(query.toLowerCase()) ||
        tool.desc?.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags?.some(tag => tag?.toLowerCase().includes(query.toLowerCase()))
      )
      return searchResults.value
    }
  }

  // 3. 筛选工具信息更新
  // (1) 排序方式
  const toggleSort = (sort) => {
    activeFilters.value.sort = sort
  }
  // (2) 标签
  const toggleTag = (tag) => {
    const index = activeFilters.value.tags.indexOf(tag)
    if (index > -1) {
      activeFilters.value.tags.splice(index, 1)
    } else {
      activeFilters.value.tags.push(tag)
    }
  }
  // (3) 清空标签（通用除外）
  const clearTags = () => {
    activeFilters.value.tags = []
  }

  // 4. 获取工具详情
  const getToolDetail = async (toolId) => {
    try {
      const response = await HttpManager.getToolDetail(toolId, 'tool')

      if (response.code === 200 && response.data) {
        currentToolDetail.value = response.data

        // 增加浏览量
        await addToolView(toolId)

        return response.data
      }

      // 如果API失败，尝试从本地数据查找
      return toolsList.value.find(t => t.id === parseInt(toolId)) || null
    } catch (error) {
      console.error('获取工具详情失败:', error)
      return toolsList.value.find(t => t.id === parseInt(toolId)) || null
    }
  }

  // 5. 增加工具浏览量
  const addToolView = async (toolId) => {
    try {
      await HttpManager.addToolView(toolId)
    } catch (error) {
      console.error('增加浏览量失败:', error)
    }
  }

  // 6. 切换收藏状态
  const toggleToolCollection = async (toolId, resourceType = 'tool') => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('请先登录')
      }

      // 先检查是否已收藏
      const userCollection = await HttpManager.getUserCollection()
      // const userCollection = false
      const isCollected = userCollection.data?.some(item =>
        item.resourceId === toolId && item.resourceType === resourceType
      )

      if (isCollected) {
        // 取消收藏
        await HttpManager.removeToolCollection(toolId, resourceType)
      } else {
        // 添加收藏
        await HttpManager.toggleToolCollection(toolId, resourceType)
      }

      return !isCollected // 返回新的收藏状态
    } catch (error) {
      console.error('切换收藏失败:', error)
      throw error
    }
  }

  // 7. 提交工具
  const submitTool = async (formData) => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('请先登录')
      }

      const formattedData = {
        name: formData.name,
        url: formData.url,
        logo: formData.icon,
        desc: formData.desc,
        fullDesc: formData.fullDesc,
        category: formData.category,
        type: formData.type,
        tags: formData.selectedTags // 改为选中的标签数组
      }

      // 验证标签
      if (!formattedData.tags || formattedData.tags.length === 0) {
        throw new Error('请至少选择一个标签')
      }

      const response = await HttpManager.submitTool(formattedData)

      if (response.code === 200) {
        return { success: true, message: response.message || '提交成功，等待管理员审核' }
      } else {
        return { success: false, message: response.message || '提交失败' }
      }
    } catch (error) {
      console.error('提交工具失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || '提交失败'
      }
    }
  }

  // 8. 根据分类推荐标签
  const recommendTags = (category) => {
    const recommended = tagGroups[category] || []
    return predefinedTags.value?.filter(tag =>
      recommended.includes(tag.id) || tag.id === 'general'
    )
  }

  // 9. AI分析链接（需要根据实际情况调整）
  const analyzeUrl = async (url) => {
    try {
      // 这里需要根据实际API调整
      // 暂时返回模拟数据
      return {
        name: url.split('//')[1]?.split('/')[0] || '未知工具',
        desc: `这是一个基于 ${url} 的工具，请手动填写详细信息。`,
        icon: `https://www.google.com/s2/favicons?sz=64&domain=${url}`
      }
    } catch (error) {
      console.error('AI分析失败:', error)
      throw error
    }
  }

  // 加载更多工具
  const loadMoreTools = async () => {
    if (!pagination.value.hasMore || isLoading.value) return

    pagination.value.page++
    isLoading.value = true

    try {
      const response = await HttpManager.getTools({
        page: pagination.value.page,
        limit: pagination.value.limit
      })

      if (response.code === 200) {
        const newTools = response.data?.list || response.data || []
        toolsList.value = [...toolsList.value, ...newTools]
        pagination.value.hasMore = response.data?.hasMore || false
      }
    } catch (error) {
      console.error('加载更多失败:', error)
      pagination.value.page-- // 回滚页码
    } finally {
      isLoading.value = false
    }
  }

  // 重置工具列表
  const resetToolsList = () => {
    toolsList.value = []
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true
    }
  }

  return {
    // State
    toolsList,
    categories,
    userInfo,
    isLoading,
    pagination,
    searchResults,
    activeFilters,
    currentToolDetail,

    // Getters
    toolsByCategory,
    isAuthenticated,
    tagsByCategory,

    // Actions
    initAuth,
    login,
    register,
    fetchUserProfile,
    logout,

    // 工具相关
    fetchTools,
    searchTools,
    toggleSort,
    toggleTag,
    clearTags,
    getToolDetail,
    addToolView,
    toggleToolCollection,
    submitTool,
    recommendTags,
    analyzeUrl,
    loadMoreTools,
    resetToolsList
  }
})

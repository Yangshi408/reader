// src/stores/toolsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HttpManager } from '@/api'
import { mockData } from '@/data/tool/mockData'
import { predefinedTags } from '@/data/tool/tags'
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
  // 2. 按类型分组的标签（用于筛选面板）
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
  const initAuth = async () => {
    // 检查本地是否有 token
    const token = localStorage.getItem('token') // 假设 token 存在 localStorage
    if (token) {
      // 有 token，尝试获取用户信息来验证 token 有效性
      await fetchUserProfile()
    } else {
      // 无 token，确认为游客
      isAuthenticated.value = false
    }
  }
  // 2. 用户登录：调用 Vuex 的 loginSuccess action 同步状态
  const login = async (credentials) => {
    try {
      const response = await HttpManager.loginIn(credentials)
      if (response.code === 200 && response.data) {
        const { token, ...userData } = response.data
        // 更新 Vuex
        await vuexStore.dispatch('loginSuccess', { userInfo: userData, token })

        // 更新本地认证状态 -> 已登录
        isAuthenticated.value = true

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
      const response = await HttpManager.getUserProfile()

      // 判断逻辑：如果返回 code 200 且有数据，视为已登录
      if (response.code === 200 && response.data) {
        isAuthenticated.value = true
        vuexStore.commit('setUserInfo', response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      } else {
        // 否则视为游客
        throw new Error('未登录')
      }
    } catch (error) {
      console.log('当前为游客模式或获取资料失败')
      // 失败时重置为游客状态
      isAuthenticated.value = false
      vuexStore.commit('setUserInfo', {}) // 清空 Vuex 用户信息
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
      isAuthenticated.value = false
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
      // 模拟增加浏览量
      console.log('原始浏览量：', mockData.find(i => i.id === toolId).views)
      const targetTool = toolsList.value.find(tool => tool.id === toolId)
      targetTool.views += 1
      console.log('新浏览量：', mockData.find(i => i.id === toolId).views)
    }
  }

  // 6. 切换收藏状态
  const toggleToolCollection = async (toolId, resourceType = 'tool') => {
    try {
      // 关键：拦截游客操作
      if (!isAuthenticated.value) {
        // 这里抛出错误，前端捕获后可提示“请先登录”
        throw new Error('请先登录')
      }

      const userCollection = await HttpManager.getUserCollection()
      const isCollected = userCollection.data?.some(item =>
        item.resourceId === toolId && item.resourceType === resourceType
      )

      if (isCollected) {
        await HttpManager.removeToolCollection(toolId, resourceType)
      } else {
        await HttpManager.toggleToolCollection(toolId, resourceType)
      }
      return !isCollected
    } catch (error) {
      console.error('切换收藏失败:', error)
      throw error
    }
  }

  // 7. AI分析链接（需要根据实际情况调整）
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
  // const loadMoreTools = async () => {
  //   if (!pagination.value.hasMore || isLoading.value) return

  //   pagination.value.page++
  //   isLoading.value = true

  //   try {
  //     const response = await HttpManager.getTools({
  //       page: pagination.value.page,
  //       limit: pagination.value.limit
  //     })

  //     if (response.code === 200) {
  //       const newTools = response.data?.list || response.data || []
  //       Object.assign(toolsList.value, newTools)
  //       pagination.value.hasMore = response.data?.hasMore || false
  //     }
  //   } catch (error) {
  //     console.error('加载更多失败:', error)
  //     pagination.value.page-- // 回滚页码
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  // 重置工具列表
  // const resetToolsList = () => {
  //   toolsList.value = []
  //   pagination.value = {
  //     page: 1,
  //     limit: 20,
  //     total: 0,
  //     hasMore: true
  //   }
  // }

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
    analyzeUrl
    // loadMoreTools,
    // resetToolsList
  }
})

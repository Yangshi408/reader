// src/stores/projectsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HttpManager } from '@/api'
import { mockProjects } from '@/data/project/mockData'
import vuexStore from '@/store/index'

export const useProjectsStore = defineStore('projects', () => {
  // ============ State ============
  const projectsList = ref([])
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
    sort: '最新'
  })

  const currentProjectDetail = ref(null)

  // ============ Getters ============
  const projectsByCategory = computed(() => {
    const grouped = {}
    projectsList.value.forEach(project => {
      if (!grouped[project.category]) {
        grouped[project.category] = []
      }
      grouped[project.category].push(project)
    })
    return grouped
  })

  // 项目标签分组（需要定义项目标签）
  const tagsByCategory = computed(() => {
    return {
      技术栈: [
        { id: 'vue', name: 'Vue', color: 'bg-green-100 text-green-800' },
        { id: 'react', name: 'React', color: 'bg-blue-100 text-blue-800' },
        { id: 'angular', name: 'Angular', color: 'bg-red-100 text-red-800' },
        { id: 'nodejs', name: 'Node.js', color: 'bg-green-100 text-green-800' },
        { id: 'python', name: 'Python', color: 'bg-blue-100 text-blue-800' },
        { id: 'java', name: 'Java', color: 'bg-orange-100 text-orange-800' },
        { id: 'spring', name: 'Spring', color: 'bg-green-100 text-green-800' },
        { id: 'flutter', name: 'Flutter', color: 'bg-blue-100 text-blue-800' },
        { id: 'react-native', name: 'React Native', color: 'bg-blue-100 text-blue-800' },
        { id: 'electron', name: 'Electron', color: 'bg-blue-100 text-blue-800' }
      ],
      类型: [
        { id: 'frontend', name: '前端', color: 'bg-purple-100 text-purple-800' },
        { id: 'backend', name: '后端', color: 'bg-gray-100 text-gray-800' },
        { id: 'fullstack', name: '全栈', color: 'bg-indigo-100 text-indigo-800' },
        { id: 'mobile', name: '移动端', color: 'bg-pink-100 text-pink-800' },
        { id: 'desktop', name: '桌面端', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'open-source', name: '开源', color: 'bg-green-100 text-green-800' }
      ],
      状态: [
        { id: 'active', name: '活跃', color: 'bg-green-100 text-green-800' },
        { id: 'archived', name: '已归档', color: 'bg-gray-100 text-gray-800' },
        { id: 'demo', name: '有演示', color: 'bg-blue-100 text-blue-800' }
      ]
    }
  })

  const isAuthenticated = computed(() => vuexStore.getters.isLoggedIn)

  const userInfo = computed(() => vuexStore.getters.userInfo)

  // ============ Actions ============
  // 1. 获取项目列表
  const fetchProjects = async (params = {}, useMock = false) => {
    isLoading.value = true

    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        projectsList.value = mockProjects
        categories.value = [...new Set(mockProjects.map(p => p.category))]
        pagination.value.total = mockProjects.length
      } else {
        const response = await HttpManager.getProjects({
          page: pagination.value.page,
          limit: pagination.value.limit,
          ...params
        })

        if (response.code === 200) {
          projectsList.value = response.data?.list || response.data || []
          pagination.value = {
            ...pagination.value,
            total: response.data?.total || projectsList.value.length,
            hasMore: response.data?.hasMore || false
          }

          categories.value = [...new Set(projectsList.value.map(p => p.category))]
        }
      }
    } catch (error) {
      console.error('获取项目列表失败:', error)
      projectsList.value = mockProjects
      categories.value = [...new Set(mockProjects.map(p => p.category))]
    } finally {
      isLoading.value = false
    }
  }

  // 2. 搜索项目
  const searchProjects = async (query, params = {}) => {
    if (!query?.trim()) {
      searchResults.value = []
      return []
    }

    try {
      const response = await HttpManager.searchProjects({
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
      searchResults.value = projectsList.value.filter(project =>
        project.name?.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies?.some(tech => tech?.toLowerCase().includes(query.toLowerCase()))
      )
      return searchResults.value
    }
  }

  // 3. 筛选项目信息更新
  const toggleSort = (sort) => {
    activeFilters.value.sort = sort
  }

  const toggleTag = (tag) => {
    const index = activeFilters.value.tags.indexOf(tag)
    if (index > -1) {
      activeFilters.value.tags.splice(index, 1)
    } else {
      activeFilters.value.tags.push(tag)
    }
  }

  const clearTags = () => {
    activeFilters.value.tags = []
  }

  // 4. 获取项目详情
  const getProjectDetail = async (projectId) => {
    try {
      const response = await HttpManager.getProjectDetail(projectId)

      if (response.code === 200 && response.data) {
        currentProjectDetail.value = response.data

        await addProjectView(projectId)

        return response.data
      }

      return projectsList.value.find(p => p.id === parseInt(projectId)) || null
    } catch (error) {
      console.error('获取项目详情失败:', error)
      return projectsList.value.find(p => p.id === parseInt(projectId)) || null
    }
  }

  // 5. 增加项目浏览量
  const addProjectView = async (projectId) => {
    try {
      await HttpManager.addProjectView(projectId)
    } catch (error) {
      console.error('增加浏览量失败:', error)
      const targetProject = projectsList.value.find(project => project.id === projectId)
      if (targetProject) {
        targetProject.views += 1
      }
    }
  }

  // 6. 切换收藏状态
  const toggleProjectCollection = async (projectId) => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('请先登录')
      }

      const userCollection = await HttpManager.getUserCollection()
      const isCollected = userCollection.data?.some(item =>
        item.resourceId === projectId && item.resourceType === 'project'
      )

      if (isCollected) {
        await HttpManager.removeProjectCollection(projectId)
      } else {
        await HttpManager.toggleProjectCollection(projectId)
      }
      return !isCollected
    } catch (error) {
      console.error('切换收藏失败:', error)
      throw error
    }
  }

  // 7. 发表项目评论
  const addProjectComment = async (projectId, content) => {
    try {
      const response = await HttpManager.addProjectComment(projectId, {
        content: content.trim()
      })
      return response
    } catch (error) {
      console.error('发表评论失败:', error)
      throw error
    }
  }

  // 8. 用户相关操作（复用toolsStore的）
  const initAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      await fetchUserProfile()
    } else {
      // isAuthenticated.value = false
    }
  }

  const login = async (credentials) => {
    try {
      const response = await HttpManager.loginIn(credentials)
      if (response.code === 200 && response.data) {
        const { token, ...userData } = response.data
        await vuexStore.dispatch('loginSuccess', { userInfo: userData, token })
        // isAuthenticated.value = true
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

  const fetchUserProfile = async () => {
    try {
      const response = await HttpManager.getUserProfile()
      if (response.code === 200 && response.data) {
        // isAuthenticated.value = true
        vuexStore.commit('setUserInfo', response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      } else {
        throw new Error('未登录')
      }
    } catch (error) {
      console.log('当前为游客模式或获取资料失败')
      // isAuthenticated.value = false
      vuexStore.commit('setUserInfo', {})
      return null
    }
  }

  const logout = async () => {
    try {
      if (isAuthenticated.value) {
        await HttpManager.logout()
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      vuexStore.dispatch('logout')
      // isAuthenticated.value = false
    }
  }

  return {
    // State
    projectsList,
    categories,
    userInfo,
    isLoading,
    pagination,
    searchResults,
    activeFilters,
    currentProjectDetail,

    // Getters
    projectsByCategory,
    isAuthenticated,
    tagsByCategory,

    // Actions
    initAuth,
    login,
    fetchUserProfile,
    logout,

    // 项目相关
    fetchProjects,
    searchProjects,
    toggleSort,
    toggleTag,
    clearTags,
    getProjectDetail,
    addProjectView,
    toggleProjectCollection,
    addProjectComment
  }
})

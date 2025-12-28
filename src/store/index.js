// store/index.js
import { createStore } from 'vuex'
import { HttpManager } from '@/api'
import { mockProjects } from '@/data/project/mockData'
import { mockTools } from '@/data/tool/mockData'
import { predefinedTags } from '@/data/tool/tags'

export default createStore({
  state: {
    // ============ 用户状态 ============
    isLogin: false,
    user: {
      id: null,
      username: '',
      nickname: '',
      email: '',
      role: 'guest', // guest, user, admin
      avatar: '',
      description: '',
      face_photo: ''
    },
    token: localStorage.getItem('token') || '',
    activeName: '首页',

    // ============ 项目状态 ============
    projects: {
      projectsList: [],
      categories: [],
      isLoading: false,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
      },
      searchResults: [],
      activeFilters: {
        tags: [],
        sort: '最新'
      },
      currentProjectDetail: null
    },

    // ============ 工具状态 ============
    tools: {
      toolsList: [],
      categories: [],
      isLoading: false,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
      },
      searchResults: [],
      activeFilters: {
        tags: [],
        sort: '最多浏览'
      },
      currentToolDetail: null,
      disableToolSubmit: true,
      showBackButton: false,  // 新增：专门控制返回按钮显示
      // 从 toolsStore.js 添加的额外状态
      // isAuthenticated: !!localStorage.getItem('token'), // 直接从 localStorage 检查 token
      isAuthenticated: true, // 模拟时使用，后续需要删除
      tagsByCategory: {} // 缓存标签分组数据
    }
  },

  mutations: {
    // ============ 用户相关 ============
    // 设置登录状态
    setLoginIn(state, isLogin) {
      state.isLogin = isLogin
    },

    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.user = { ...state.user, ...userInfo }
    },

    // 设置token
    setToken(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
        state.tools.isAuthenticated = true // 同步更新工具模块的认证状态
      } else {
        localStorage.removeItem('token')
        state.tools.isAuthenticated = false // 同步更新工具模块的认证状态
      }
    },

    // 清除用户信息（退出登录）
    clearUserInfo(state) {
      state.isLogin = false
      state.user = {
        id: null,
        username: '',
        nickname: '',
        email: '',
        role: 'guest',
        avatar: '',
        description: '',
        face_photo: ''
      }
      state.token = ''
      state.tools.isAuthenticated = false // 同步更新工具模块的认证状态
      localStorage.removeItem('token')
    },

    // 设置活跃标签
    setActiveName(state, name) {
      state.activeName = name
    },

    // 更新用户部分信息
    updateUserField(state, { field, value }) {
      if (state.user[field] !== undefined) {
        state.user[field] = value
      }
    },

    // ============ 项目相关 ============
    setProjectsList(state, list) {
      state.projects.projectsList = list
    },

    setProjectsCategories(state, categories) {
      state.projects.categories = categories
    },

    setProjectsLoading(state, isLoading) {
      state.projects.isLoading = isLoading
    },

    setProjectsPagination(state, pagination) {
      state.projects.pagination = { ...state.projects.pagination, ...pagination }
    },

    setProjectsSearchResults(state, results) {
      state.projects.searchResults = results
    },

    setProjectsActiveFilters(state, filters) {
      state.projects.activeFilters = { ...state.projects.activeFilters, ...filters }
    },

    setCurrentProjectDetail(state, project) {
      state.projects.currentProjectDetail = project
    },

    updateProjectField(state, { projectId, field, value }) {
      const project = state.projects.projectsList.find(p => p.id === projectId)
      if (project) {
        project[field] = value
      }
    },

    // ============ 工具相关 ============
    setToolsList(state, list) {
      state.tools.toolsList = list
    },

    setToolsCategories(state, categories) {
      state.tools.categories = categories
    },

    setToolsLoading(state, isLoading) {
      state.tools.isLoading = isLoading
    },

    setToolsPagination(state, pagination) {
      state.tools.pagination = { ...state.tools.pagination, ...pagination }
    },

    setToolsSearchResults(state, results) {
      state.tools.searchResults = results
    },

    setToolsActiveFilters(state, filters) {
      state.tools.activeFilters = { ...state.tools.activeFilters, ...filters }
    },

    setCurrentToolDetail(state, tool) {
      state.tools.currentToolDetail = tool
    },

    setDisableToolSubmit(state, disabled) {
      state.tools.disableToolSubmit = disabled
    },

    setShowBackButton(state, show) {
      state.tools.showBackButton = show
    },

    updateToolField(state, { toolId, field, value }) {
      const tool = state.tools.toolsList.find(t => t.id === toolId)
      if (tool) {
        tool[field] = value
      }
    },

    // 从 toolsStore.js 添加的额外 mutations
    setToolsTagsByCategory(state, tagsByCategory) {
      state.tools.tagsByCategory = tagsByCategory
    },

    setToolsIsAuthenticated(state, isAuthenticated) {
      state.tools.isAuthenticated = isAuthenticated
    }
  },

  actions: {
    // ============ 用户相关 ============
    // 登录
    async login({ commit }, { username, password }) {
      try {
        const params = new FormData()
        params.append('username_or_email', username)
        params.append('password', password)

        const response = await HttpManager.loginIn(params)

        if (response.message === '1' || response.code === 1 || response.code === 200) {
          const token = response['JWT token'] || response.token || response.data?.token
          commit('setToken', token)
          commit('setLoginIn', true)

          // 获取用户信息
          await this.dispatch('fetchUserProfile')

          return { success: true, token }
        } else {
          return {
            success: false,
            message: response.message || '登录失败'
          }
        }
      } catch (error) {
        console.error('登录错误:', error)
        return {
          success: false,
          message: '网络错误，请稍后重试'
        }
      }
    },

    // 注册
    // eslint-disable-next-line no-unused-vars
    async register({ commit }, userData) {
      try {
        const params = new FormData()
        params.append('username', userData.username)
        params.append('email', userData.email)
        params.append('password', userData.password)
        params.append('nickname', userData.nickname)
        params.append('certify_password', userData.certify_password)

        const response = await HttpManager.SignUp(params)

        if (response.message === '注册成功' || response.code === 1 || response.code === 200) {
          return { success: true, message: '注册成功' }
        } else {
          return {
            success: false,
            message: response.message || '注册失败'
          }
        }
      } catch (error) {
        console.error('注册错误:', error)
        return {
          success: false,
          message: '网络错误，请稍后重试'
        }
      }
    },

    // 获取用户资料
    async fetchUserProfile({ commit, state }) {
      try {
        const response = await HttpManager.getUserProfile(state.token)
        if ((response.islogin || response.code === 200) && response.data) {
          commit('setUserInfo', response.data)
          commit('setLoginIn', true)
          commit('setToolsIsAuthenticated', true) // 同步更新工具模块的认证状态
          return response.data
        } else {
          commit('setLoginIn', false)
          commit('setToolsIsAuthenticated', false) // 同步更新工具模块的认证状态
          return null
        }
      } catch (error) {
        console.error('获取用户资料错误:', error)
        commit('setLoginIn', false)
        commit('setToolsIsAuthenticated', false) // 同步更新工具模块的认证状态
        throw error
      }
    },

    // 更新用户资料
    async updateUserProfile({ commit, state }, profileData) {
      try {
        const params = new FormData()
        // 只添加非空的字段
        if (profileData.nickname) params.append('nickname', profileData.nickname)
        if (profileData.avatar) params.append('avatar', profileData.avatar)
        if (profileData.description) params.append('description', profileData.description)
        if (profileData.face_photo) params.append('face_photo', profileData.face_photo)

        const response = await HttpManager.updateUserProfile(params, state.token)

        if ((response.islogin || response.code === 200) && response.data) {
          commit('setUserInfo', response.data.user || response.data)
          return { success: true, data: response.data.user || response.data }
        } else {
          return {
            success: false,
            message: response.message || '更新失败'
          }
        }
      } catch (error) {
        console.error('更新用户资料错误:', error)
        throw error
      }
    },

    // 忘记密码
    async forgotPassword(context, { email, newPassword, certifyPassword }) {
      try {
        const params = new FormData()
        params.append('email', email)
        params.append('new_password', newPassword)
        params.append('certify_password', certifyPassword)

        return await HttpManager.forgotPassword(params)
      } catch (error) {
        console.error('忘记密码错误:', error)
        throw error
      }
    },

    // 退出登录
    async logout({ commit, state }) {
      try {
        await HttpManager.logout(state.token)
      } catch (error) {
        console.error('退出登录错误:', error)
      } finally {
        // 即使API失败也清除本地状态
        commit('clearUserInfo')
        // eslint-disable-next-line no-unsafe-finally
        return { success: true }
      }
    },

    // 获取审核状态
    async fetchReviewStatus({ state }) {
      try {
        return await HttpManager.getReviewStatus(state.token)
      } catch (error) {
        console.error('获取审核状态错误:', error)
        throw error
      }
    },

    // 获取个人收藏
    async fetchUserCollection({ state }) {
      try {
        return await HttpManager.getUserCollection(state.token)
      } catch (error) {
        console.error('获取个人收藏错误:', error)
        throw error
      }
    },

    // 获取个人提交
    async fetchUserSubmissions({ state }) {
      try {
        return await HttpManager.getUserSubmissions(state.token)
      } catch (error) {
        console.error('获取个人提交错误:', error)
        throw error
      }
    },

    // 更新密码
    async updatePassword({ state }, { newPassword, code }) {
      try {
        const params = new FormData()
        params.append('new_password', newPassword)
        params.append('code', code)

        return await HttpManager.updatePassword(params, state.token)
      } catch (error) {
        console.error('更新密码错误:', error)
        throw error
      }
    },

    // 更新邮箱
    async updateEmail({ state }, { password, code }) {
      try {
        const params = new FormData()
        params.append('password', password)
        params.append('code', code)

        return await HttpManager.updateEmail(params, state.token)
      } catch (error) {
        console.error('更新邮箱错误:', error)
        throw error
      }
    },

    // ============ 项目相关 ============
    // 获取项目列表
    async fetchProjects({ commit, state }, { params = {}, useMock = false } = {}) {
      commit('setProjectsLoading', true)

      try {
        if (useMock) {
          await new Promise(resolve => setTimeout(resolve, 500))
          commit('setProjectsList', mockProjects)
          commit('setProjectsCategories', [...new Set(mockProjects.map(p => p.category))])
          commit('setProjectsPagination', { total: mockProjects.length })
        } else {
          const response = await HttpManager.getProjects({
            page: state.projects.pagination.page,
            limit: state.projects.pagination.limit,
            ...params
          })

          if (response.code === 200) {
            const projectsList = response.data?.list || response.data || []
            commit('setProjectsList', projectsList)
            commit('setProjectsPagination', {
              total: response.data?.total || projectsList.length,
              hasMore: response.data?.hasMore || false
            })
            commit('setProjectsCategories', [...new Set(projectsList.map(p => p.category))])
          }
        }
      } catch (error) {
        console.error('获取项目列表失败:', error)
        commit('setProjectsList', mockProjects)
        commit('setProjectsCategories', [...new Set(mockProjects.map(p => p.category))])
      } finally {
        commit('setProjectsLoading', false)
      }
    },

    // 搜索项目
    async searchProjects({ commit, state }, { query, params = {} }) {
      if (!query?.trim()) {
        commit('setProjectsSearchResults', [])
        return []
      }

      try {
        const response = await HttpManager.searchProjects({
          q: query.trim(),
          ...params
        })

        if (response.code === 200) {
          const results = response.data || []
          commit('setProjectsSearchResults', results)
          return results
        }
        return []
      } catch (error) {
        console.error('搜索失败:', error)
        // 本地搜索作为fallback
        const results = state.projects.projectsList.filter(project =>
          project.name?.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase()) ||
          project.technologies?.some(tech => tech?.toLowerCase().includes(query.toLowerCase()))
        )
        commit('setProjectsSearchResults', results)
        return results
      }
    },

    // 获取项目详情
    async getProjectDetail({ commit, state, dispatch }, projectId) {
      try {
        const response = await HttpManager.getProjectDetail(projectId)

        if (response.code === 200 && response.data) {
          commit('setCurrentProjectDetail', response.data)
          await dispatch('addProjectView', projectId)
          return response.data
        }

        return state.projects.projectsList.find(p => p.id === parseInt(projectId)) || null
      } catch (error) {
        console.error('获取项目详情失败:', error)
        return state.projects.projectsList.find(p => p.id === parseInt(projectId)) || null
      }
    },

    // 增加项目浏览量
    async addProjectView({ commit, state }, projectId) {
      try {
        await HttpManager.addProjectView(projectId)
      } catch (error) {
        console.error('增加浏览量失败:', error)
        // 模拟增加浏览量
        commit('updateProjectField', {
          projectId,
          field: 'views',
          value: (state.projects.projectsList.find(p => p.id === projectId)?.views || 0) + 1
        })
      }
    },

    // 切换项目收藏状态
    // eslint-disable-next-line no-unused-vars
    async toggleProjectCollection({ state, dispatch }, projectId) {
      try {
        if (!state.isLogin) {
          throw new Error('请先登录')
        }

        const userCollection = await HttpManager.getUserCollection(state.token)
        const isCollected = userCollection.data?.some(item =>
          item.resourceId === projectId && item.resourceType === 'project'
        )

        if (isCollected) {
          await HttpManager.removeProjectCollection(projectId, state.token)
        } else {
          await HttpManager.toggleProjectCollection(projectId, state.token)
        }
        return !isCollected
      } catch (error) {
        console.error('切换收藏失败:', error)
        throw error
      }
    },

    // 发表项目评论
    async addProjectComment({ state }, { projectId, content }) {
      try {
        return await HttpManager.addProjectComment(projectId, {
          content: content.trim()
        }, state.token)
      } catch (error) {
        console.error('发表评论失败:', error)
        throw error
      }
    },

    // ============ 工具相关 ============
    // 获取工具列表
    async fetchTools({ commit, state }, { params = {}, useMock = false } = {}) {
      commit('setToolsLoading', true)

      try {
        if (useMock) {
          await new Promise(resolve => setTimeout(resolve, 500))
          commit('setToolsList', mockTools)
          commit('setToolsCategories', [...new Set(mockTools.map(t => t.category))])
          commit('setToolsPagination', { total: mockTools.length })

          // 初始化标签分组数据
          const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
          const tagsByCategory = {
            平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
            操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
            技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
            工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
            用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
            许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
            其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
          }
          commit('setToolsTagsByCategory', tagsByCategory)
        } else {
          const response = await HttpManager.getTools({
            page: state.tools.pagination.page,
            limit: state.tools.pagination.limit,
            ...params
          })

          if (response.code === 200) {
            const toolsList = response.data?.list || response.data || []
            commit('setToolsList', toolsList)
            commit('setToolsPagination', {
              total: response.data?.total || toolsList.length,
              hasMore: response.data?.hasMore || false
            })
            commit('setToolsCategories', [...new Set(toolsList.map(t => t.category))])

            // 初始化标签分组数据
            const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
            const tagsByCategory = {
              平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
              操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
              技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
              工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
              用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
              许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
              其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
            }
            commit('setToolsTagsByCategory', tagsByCategory)
          }
        }
      } catch (error) {
        console.error('获取工具列表失败:', error)
        commit('setToolsList', mockTools)
        commit('setToolsCategories', [...new Set(mockTools.map(t => t.category))])

        // 初始化标签分组数据
        const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []
        const tagsByCategory = {
          平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
          操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
          技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
          工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
          用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
          许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
          其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
        }
        commit('setToolsTagsByCategory', tagsByCategory)
      } finally {
        commit('setToolsLoading', false)
      }
    },

    // 搜索工具
    async searchTools({ commit, state }, { query, params = {} }) {
      if (!query?.trim()) {
        commit('setToolsSearchResults', [])
        return []
      }

      try {
        const response = await HttpManager.searchTools({
          q: query.trim(),
          ...params
        })

        if (response.code === 200) {
          const results = response.data || []
          commit('setToolsSearchResults', results)
          return results
        }
        return []
      } catch (error) {
        console.error('搜索失败:', error)
        // 本地搜索作为fallback
        const results = state.tools.toolsList.filter(tool =>
          tool.name?.toLowerCase().includes(query.toLowerCase()) ||
          tool.desc?.toLowerCase().includes(query.toLowerCase()) ||
          tool.tags?.some(tag => tag?.toLowerCase().includes(query.toLowerCase()))
        )
        commit('setToolsSearchResults', results)
        return results
      }
    },

    // 获取工具详情
    async getToolDetail({ commit, state, dispatch }, toolId) {
      try {
        const response = await HttpManager.getToolDetail(toolId, 'tool')

        if (response.code === 200 && response.data) {
          commit('setCurrentToolDetail', response.data)
          await dispatch('addToolView', toolId)
          return response.data
        }

        return state.tools.toolsList.find(t => t.id === parseInt(toolId)) || null
      } catch (error) {
        console.error('获取工具详情失败:', error)
        return mockTools.find(t => t.id === parseInt(toolId)) || null
      }
    },

    // 增加工具浏览量
    async addToolView({ commit, state }, toolId) {
      try {
        await HttpManager.addToolView(toolId)
      } catch (error) {
        console.error('增加浏览量失败:', error)
        // 模拟增加浏览量
        commit('updateToolField', {
          toolId,
          field: 'views',
          value: (state.tools.toolsList.find(t => t.id === toolId)?.views || 0) + 1
        })
      }
    },

    // 切换工具收藏状态
    async toggleToolCollection({ state }, { toolId, resourceType = 'tool' }) {
      try {
        if (!state.isLogin) {
          throw new Error('请先登录')
        }

        const userCollection = await HttpManager.getUserCollection(state.token)
        const isCollected = userCollection.data?.some(item =>
          item.resourceId === toolId && item.resourceType === resourceType
        )

        if (isCollected) {
          await HttpManager.removeToolCollection(toolId, resourceType, state.token)
        } else {
          await HttpManager.toggleToolCollection(toolId, resourceType, state.token)
        }
        return !isCollected
      } catch (error) {
        console.error('切换收藏失败:', error)
        throw error
      }
    },

    // AI分析链接
    async analyzeUrl(context, url) {
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
    },

    // 工具筛选操作
    toggleSort({ commit }, { type, sort }) {
      if (type === 'projects') {
        commit('setProjectsActiveFilters', { sort })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { sort })
      }
    },

    toggleTag({ commit, state }, { type, tag }) {
      const currentTags = type === 'projects'
        ? [...state.projects.activeFilters.tags]
        : [...state.tools.activeFilters.tags]

      const index = currentTags.indexOf(tag)
      if (index > -1) {
        currentTags.splice(index, 1)
      } else {
        currentTags.push(tag)
      }

      if (type === 'projects') {
        commit('setProjectsActiveFilters', { tags: currentTags })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { tags: currentTags })
      }
    },

    clearTags({ commit }, type) {
      if (type === 'projects') {
        commit('setProjectsActiveFilters', { tags: [] })
      } else if (type === 'tools') {
        commit('setToolsActiveFilters', { tags: [] })
      }
    },

    // 从 toolsStore.js 添加的额外 actions
    // eslint-disable-next-line no-unused-vars
    async initAuth({ commit, state }) {
      // 检查本地是否有 token
      const token = localStorage.getItem('token')
      if (token) {
        // 有 token，尝试获取用户信息来验证 token 有效性
        try {
          const response = await HttpManager.getUserProfile(token)
          if (response.code === 200 && response.data) {
            commit('setUserInfo', response.data)
            commit('setLoginIn', true)
            commit('setToken', token)
            commit('setToolsIsAuthenticated', true)
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
          } else {
            throw new Error('未登录')
          }
        } catch (error) {
          console.log('当前为游客模式或获取资料失败')
          commit('setToolsIsAuthenticated', false)
          commit('setUserInfo', {})
          return null
        }
      } else {
        commit('setToolsIsAuthenticated', false)
      }
    },

    // 设置工具提交禁用状态
    setToolSubmitDisabled({ commit }, disabled) {
      commit('setDisableToolSubmit', disabled)
    }
  },

  getters: {
    // ============ 用户相关 ============
    // 获取完整用户信息
    userInfo: (state) => state.user,

    // 获取登录状态
    isLoggedIn: (state) => state.isLogin,

    // 判断是否是管理员
    isAdmin: state => state.user.role === 'admin',

    // 获取用户角色
    getUserRole: (state) => state.user.role,

    // 获取用户ID
    getUserId: (state) => state.user.id,

    // 获取用户昵称（如果没有则使用用户名）
    getUserDisplayName: (state) =>
      state.user.nickname || state.user.username || '游客',

    // 获取token
    getToken: (state) => state.token,

    // 获取活跃标签
    getActiveName: (state) => state.activeName,

    // ============ 项目相关 ============
    // 获取项目列表
    projectsList: (state) => state.projects.projectsList,
    projectsCategories: (state) => state.projects.categories,
    // 按分类分组项目
    projectsByCategory: (state) => {
      const grouped = {}
      state.projects.projectsList.forEach(project => {
        if (!grouped[project.category]) {
          grouped[project.category] = []
        }
        grouped[project.category].push(project)
      })
      return grouped
    },

    // 项目标签分组
    projectsTagsByCategory: () => ({
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
    }),

    // 获取项目加载状态
    projectsLoading: (state) => state.projects.isLoading,

    // 获取当前项目详情
    currentProjectDetail: (state) => state.projects.currentProjectDetail,

    // 添加用户相关的 getters
    user: (state) => state.user,

    // ============ 工具相关 ============
    // 获取工具列表
    toolsList: (state) => state.tools.toolsList,

    // 按分类分组工具
    toolsByCategory: (state) => {
      const grouped = {}
      state.tools.toolsList.forEach(tool => {
        if (!grouped[tool.category]) {
          grouped[tool.category] = []
        }
        grouped[tool.category].push(tool)
      })
      return grouped
    },

    // 工具标签分组
    toolsTagsByCategory: (state) => {
      // 如果已经缓存了标签分组数据，直接返回
      if (Object.keys(state.tools.tagsByCategory).length > 0) {
        return state.tools.tagsByCategory
      }

      // 否则计算并返回
      const filterTags = (ids) => predefinedTags?.filter(tag => ids.includes(tag.id)) || []

      return {
        平台: filterTags(['web', 'desktop', 'mobile', 'cross-platform']),
        操作系统: filterTags(['windows', 'macos', 'linux', 'ios', 'android']),
        技术栈: filterTags(['javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'go', 'rust']),
        工具类型: filterTags(['ide', 'editor', 'cli', 'api', 'debug', 'test', 'design']),
        用途领域: filterTags(['frontend', 'backend', 'database', 'devops', 'ai-ml', 'data-science', 'web3', 'game-dev']),
        许可证价格: filterTags(['open-source', 'free', 'freemium', 'paid', 'subscription']),
        其他: filterTags(['general', 'new', 'popular', 'official', 'community'])
      }
    },

    // 获取工具加载状态
    toolsLoading: (state) => state.tools.isLoading,

    // 获取当前工具详情
    currentToolDetail: (state) => state.tools.currentToolDetail,

    // 获取工具提交禁用状态
    disableToolSubmit: (state) => state.tools.disableToolSubmit,

    // 从 toolsStore.js 添加的额外 getters
    toolsIsAuthenticated: (state) => state.tools.isAuthenticated,

    // 工具模块的认证状态别名
    isAuthenticated: (state) => state.tools.isAuthenticated
  }
})

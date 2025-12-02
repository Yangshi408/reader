import { createStore } from 'vuex'

export default createStore({
  state: {
    // 用户信息
    userId: null,
    username: '',
    nickname: '',
    email: '',
    avatar: '',
    role: '',
    description: '',
    facePhoto: '',

    // 登录状态
    isLogin: false,

    // 活跃菜单
    activeName: '首页',

    // 其他状态
    loading: false
  },
  mutations: {
    // 设置用户信息
    setUserInfo (state, userInfo) {
      state.userId = userInfo.id
      state.username = userInfo.username
      state.nickname = userInfo.nickname
      state.email = userInfo.email
      state.avatar = userInfo.avatar
      state.role = userInfo.role
      state.description = userInfo.description
      state.facePhoto = userInfo.facePhoto
    },

    // 设置登录状态
    setLoginStatus (state, status) {
      state.isLogin = status
    },

    // 设置活跃菜单
    setActiveName (state, name) {
      state.activeName = name
    },

    // 设置加载状态
    setLoading (state, loading) {
      state.loading = loading
    },

    // 清除用户信息
    clearUserInfo (state) {
      state.userId = null
      state.username = ''
      state.nickname = ''
      state.email = ''
      state.avatar = ''
      state.role = ''
      state.description = ''
      state.facePhoto = ''
      state.isLogin = false
    }
  },
  actions: {
    // 登录成功后的操作
    async loginSuccess ({ commit }, { userInfo, token }) {
      commit('setUserInfo', userInfo)
      commit('setLoginStatus', true)
      localStorage.setItem('token', token)
    },

    // 登出
    async logout ({ commit }) {
      commit('clearUserInfo')
      localStorage.removeItem('token')
    },

    // 检查登录状态
    checkLoginStatus ({ commit }) {
      const token = localStorage.getItem('token')
      if (token) {
        // 这里可以添加验证token有效性的逻辑
        commit('setLoginStatus', true)
        return true
      }
      return false
    }
  },
  getters: {
    // 用户是否登录
    isLoggedIn: state => state.isLogin,

    // 获取用户信息
    userInfo: state => ({
      id: state.userId,
      username: state.username,
      nickname: state.nickname,
      email: state.email,
      avatar: state.avatar,
      role: state.role,
      description: state.description,
      facePhoto: state.facePhoto
    }),

    // 是否是管理员
    isAdmin: state => state.role === 'admin'
  }
})

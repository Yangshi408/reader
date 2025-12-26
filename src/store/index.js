// store/index.js
import { createStore } from 'vuex'
import { HttpManager } from '@/api'

export default createStore({
  state: {
    // 用户状态
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
    activeName: '首页'
  },
  mutations: {
    // 设置登录状态
    setLoginIn (state, isLogin) {
      state.isLogin = isLogin
    },

    // 设置用户信息
    setUserInfo (state, userInfo) {
      state.user = { ...state.user, ...userInfo }
    },

    // 设置token
    setToken (state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    // 清除用户信息（退出登录）
    clearUserInfo (state) {
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
      localStorage.removeItem('token')
    },

    // 设置活跃标签
    setActiveName (state, name) {
      state.activeName = name
    },

    // 更新用户部分信息
    updateUserField (state, { field, value }) {
      if (state.user[field] !== undefined) {
        state.user[field] = value
      }
    }
  },
  actions: {
    // 登录
    async login ({ commit }, { username, password }) {
      try {
        const params = new FormData()
        params.append('username_or_email', username)
        params.append('password', password)

        const response = await HttpManager.loginIn(params)

        if (response.message === '1' || response.code === 1) {
          const token = response['JWT token'] || response.token
          commit('setToken', token)
          commit('setLoginIn', true)

          // 获取用户信息
          await this.dispatch('fetchUserProfile')

          return { success: true }
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
    async register ({ commit }, userData) {
      try {
        const params = new FormData()
        params.append('username', userData.username)
        params.append('email', userData.email)
        params.append('password', userData.password)
        params.append('nickname', userData.nickname)
        params.append('certify_password', userData.certify_password)

        const response = await HttpManager.SignUp(params)

        if (response.message === '注册成功' || response.code === 1) {
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
    async fetchUserProfile ({ commit, state }) {
      try {
        const response = await HttpManager.getUserProfile(state.token)
        if (response.islogin && response.data) {
          commit('setUserInfo', response.data)
          commit('setLoginIn', true)
        }
        return response
      } catch (error) {
        console.error('获取用户资料错误:', error)
        throw error
      }
    },

    // 更新用户资料
    async updateUserProfile ({ commit, state }, profileData) {
      try {
        const params = new FormData()
        // 只添加非空的字段
        if (profileData.nickname) params.append('nickname', profileData.nickname)
        if (profileData.avatar) params.append('avatar', profileData.avatar)
        if (profileData.description) params.append('description', profileData.description)
        if (profileData.face_photo) params.append('face_photo', profileData.face_photo)

        const response = await HttpManager.updateUserProfile(params, state.token)

        if (response.islogin && response.data) {
          commit('setUserInfo', response.data.user)
          return { success: true, data: response.data.user }
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
    async forgotPassword (context, { email, newPassword, certifyPassword }) {
      try {
        const params = new FormData()
        params.append('email', email)
        params.append('new_password', newPassword)
        params.append('certify_password', certifyPassword)

        const response = await HttpManager.forgotPassword(params)
        return response
      } catch (error) {
        console.error('忘记密码错误:', error)
        throw error
      }
    },

    // 退出登录
    async logout ({ commit, state }) {
      try {
        await HttpManager.logout(state.token)
        commit('clearUserInfo')
        return { success: true }
      } catch (error) {
        console.error('退出登录错误:', error)
        // 即使API失败也清除本地状态
        commit('clearUserInfo')
        return { success: true }
      }
    },

    // 获取审核状态
    async fetchReviewStatus ({ state }) {
      try {
        const response = await HttpManager.getReviewStatus(state.token)
        return response
      } catch (error) {
        console.error('获取审核状态错误:', error)
        throw error
      }
    },

    // 获取个人收藏
    async fetchUserCollection ({ state }) {
      try {
        const response = await HttpManager.getUserCollection(state.token)
        return response
      } catch (error) {
        console.error('获取个人收藏错误:', error)
        throw error
      }
    },

    // 获取个人提交
    async fetchUserSubmissions ({ state }) {
      try {
        const response = await HttpManager.getUserSubmissions(state.token)
        return response
      } catch (error) {
        console.error('获取个人提交错误:', error)
        throw error
      }
    },

    // 更新密码
    async updatePassword ({ state }, { newPassword, code }) {
      try {
        const params = new FormData()
        params.append('new_password', newPassword)
        params.append('code', code)

        const response = await HttpManager.updatePassword(params, state.token)
        return response
      } catch (error) {
        console.error('更新密码错误:', error)
        throw error
      }
    },

    // 更新邮箱
    async updateEmail ({ state }, { password, code }) {
      try {
        const params = new FormData()
        params.append('password', password)
        params.append('code', code)

        const response = await HttpManager.updateEmail(params, state.token)
        return response
      } catch (error) {
        console.error('更新邮箱错误:', error)
        throw error
      }
    }
  },
  getters: {
    // 获取完整用户信息
    userInfo: (state) => state.user,

    // 获取登录状态
    isLoggedIn: (state) => state.isLogin,

    isAdmin: state => state.role === 'admin',

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
    getActiveName: (state) => state.activeName
  }
})

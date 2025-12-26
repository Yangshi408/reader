<template>
  <div class="login-in">
    <div class="logo-container">
      <img :src="logo" alt="logo" class="logo" />
    </div>
    <div class="login">
      <div class="login-head">
        <span>帐号登录</span>
      </div>
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginFormRef" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input placeholder="用户名或邮箱" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :type="passwordFieldType"
            placeholder="密码"
            v-model="loginForm.password"
            @keyup.enter="handleLoginIn"
          >
            <template #suffix>
              <span class="password-toggle" @click="togglePasswordVisibility">
                <el-icon>
                  <View v-if="passwordFieldType === 'password'" />
                  <Hide v-else />
                </el-icon>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button @click="goSignUp">注册</el-button>
          <el-button type="primary" @click="handleLoginIn" :loading="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </div>
        <div class="login-options">
          <span class="forgot-password" @click="goForgotPassword">忘记密码？</span>
          <span class="guest-login" @click="goHome">游客登录 →</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import logoImg from '../../assets/logo.png'
import { ElMessage, ElNotification } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import { HttpManager } from '@/api'

// 使用 Vue 3 的 Composition API
const router = useRouter()
const store = useStore()
const loginFormRef = ref()
const logo = logoImg

// 响应式数据
const loginForm = reactive({
  username: '',
  password: ''
})
const passwordFieldType = ref('password')
const loading = ref(false)

// 验证函数
function validateName (rule, value, callback) {
  if (!value) {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}

function validatePassword (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// 通知函数（替代 mixin）
function notify (message, type) {
  ElNotification({
    title: type === 'success' ? '成功' : '错误',
    message,
    type,
    duration: 2000
  })
}

// 生命周期
onMounted(() => {
  // 禁止滚动（核心两行）
  document.body.style.overflow = 'hidden'
  document.body.style.height = '100vh'
  // 手机端禁止弹性滚动
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  changeIndex('登录')
})

onBeforeUnmount(() => {
  // 离开页面时恢复滚动（重要！）
  document.body.style.overflow = ''
  document.body.style.height = ''
  document.body.style.position = ''
  document.body.style.width = ''
})

// 方法
const changeIndex = (value) => {
  store.commit('setActiveName', value)
}

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const handleLoginIn = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      const params = new URLSearchParams()
      params.append('username', loginForm.username)
      params.append('password', loginForm.password)

      HttpManager.loginIn(params)
        .then(res => {
          if (res.code === 1) {
            ElMessage({
              message: '登录成功',
              type: 'success'
            })
            setUserMsg(res.userMsg[0])
            store.commit('setLoginIn', true)
            setTimeout(() => {
              changeIndex('首页')
              router.push({ path: '/' })
              location.reload() // 如果需要强制刷新页面
            }, 2000)
          } else {
            notify('用户名或密码错误', 'error')
          }
        })
        // .catch(failResponse => {
        //   notify('登录失败，请重试', 'error')
        // })
        // .finally(() => {
        //   loading.value = false
        // })
    } else {
      return false
    }
  })
}

const setUserMsg = (item) => {
  store.commit('setUserId', item.id)
  store.commit('setUsername', item.username)
  store.commit('setAvatar', item.avatar)
}

const goSignUp = () => {
  router.push({ path: '/register' })
}

const goHome = () => {
  changeIndex('首页')
  router.push({ path: '/home' })
}

const goForgotPassword = () => {
  router.push({ path: '/forgot-password' })
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/login-in';
</style>

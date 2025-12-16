<template>
  <div class="min-h-screen relative">
    <div class="main-wrapper">
      <div class="relative z-10 container mx-auto pt-8 pb-20">
        <!-- 左侧可折叠侧边栏 - 保持与home.vue一致 -->
        <aside :class="['sidebar sticky top-0 transition-all duration-400', isCollapsed ? 'w-64' : 'w-20']">
          <div class="sidebar-header">
            <h2 v-if="!isCollapsed" class="text-xs font-bold text-[#0066ff]">个人中心</h2>
            <button @click="isCollapsed = !isCollapsed" class="toggle-btn">
              <i :class="['fas text-xl', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
            </button>
          </div>
          <nav class="nav-list">
            <div
              v-for="item in navItems"
              :key="item.id"
              :class="['nav-item', { active: activeNav === item.id }]"
              @click="switchNav(item.id)"
            >
              <i :class="['fas text-xl', item.icon, !isCollapsed ? 'mr-4' : '']"></i>
              <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
            </div>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <main :class="['transition-all duration-400', isCollapsed ? 'ml-0' : 'ml-4']">
          <!-- 顶部头像和基本信息 -->
          <div class="profile-header">
            <div class="profile-banner">
              <div class="relative w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl overflow-hidden">
                <img :src="user.cover || 'https://picsum.photos/800/300?random=3'" alt="封面" class="w-full h-full object-cover">
                <button @click="editCover" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all">
                  <i class="fas fa-camera text-white"></i>
                </button>
              </div>

              <div class="profile-avatar-container">
                <div class="relative">
                  <div class="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    <img :src="user.avatar || defaultAvatar" :alt="user.nickname" class="w-full h-full object-cover">
                  </div>
                  <button @click="editAvatar" class="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all">
                    <i class="fas fa-pencil-alt text-[#0066ff]"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="profile-info text-center mt-2">
              <h1 class="text-2xl font-bold text-gray-800">{{ user.nickname || 'tnedjwedne' }}</h1>
              <p class="text-gray-600 mt-1">{{ user.description || '帅气的我简直无法用语言描述！' }}</p>
              <div class="flex justify-center items-center gap-6 mt-4">
                <div class="text-center">
                  <div class="text-xl font-bold text-[#0066ff]">{{ stats.followers || 128 }}</div>
                  <div class="text-sm text-gray-500">粉丝</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-[#0066ff]">{{ stats.following || 64 }}</div>
                  <div class="text-sm text-gray-500">关注</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-[#0066ff]">{{ stats.posts || 42 }}</div>
                  <div class="text-sm text-gray-500">动态</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人资料编辑区 -->
          <div class="section-container mt-8">
            <div class="section-header">
              <h2 class="section-title-text">个人资料</h2>
              <button @click="saveProfile" class="more-btn-small">保存资料</button>
            </div>
            <section class="section-card">
              <div class="space-y-6">
                <!-- 昵称 -->
                <div class="form-group">
                  <label class="form-label">昵称</label>
                  <input v-model="user.nickname" type="text" class="form-input" placeholder="请输入昵称">
                </div>

                <!-- 用户名 -->
                <div class="form-group">
                  <label class="form-label">用户名</label>
                  <div class="form-static">{{ user.username || 'Zy0620' }}</div>
                </div>

                <!-- 账号ID -->
                <div class="form-group">
                  <label class="form-label">账号ID</label>
                  <div class="form-static">{{ user.id || '4741' }}</div>
                </div>

                <!-- 头像选择 -->
                <div class="form-group">
                  <label class="form-label">头像</label>
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                      <input type="radio" id="default" v-model="avatarType" value="default" class="h-4 w-4 text-[#0066ff]">
                      <label for="default" class="text-gray-700">默认头像</label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input type="radio" id="custom" v-model="avatarType" value="custom" class="h-4 w-4 text-[#0066ff]">
                      <label for="custom" class="text-gray-700">自定义头像</label>
                    </div>
                  </div>
                </div>

                <!-- 个人网站 -->
                <div class="form-group">
                  <label class="form-label">个人网站</label>
                  <input v-model="user.website" type="url" class="form-input" placeholder="https://example.com">
                </div>

                <!-- 个人描述 -->
                <div class="form-group">
                  <label class="form-label">个人描述</label>
                  <textarea v-model="user.description" class="form-textarea" rows="4" placeholder="介绍一下你自己..."></textarea>
                </div>

                <!-- 联系方式 -->
                <div class="form-group">
                  <label class="form-label">邮箱</label>
                  <input v-model="user.email" type="email" class="form-input" placeholder="your@email.com">
                </div>

                <div class="form-group">
                  <label class="form-label">手机号</label>
                  <input v-model="user.phone" type="tel" class="form-input" placeholder="13800138000">
                </div>
              </div>
            </section>
          </div>

          <!-- 账户设置区 -->
          <div class="section-container mt-8">
            <div class="section-header">
              <h2 class="section-title-text">账户设置</h2>
            </div>
            <section class="section-card">
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">隐私设置</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">公开个人资料</span>
                    <label class="switch">
                      <input type="checkbox" v-model="privacy.publicProfile">
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">显示在线状态</span>
                    <label class="switch">
                      <input type="checkbox" v-model="privacy.showOnline">
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">允许私信</span>
                    <label class="switch">
                      <input type="checkbox" v-model="privacy.allowMessages">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>

                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">通知设置</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">新粉丝通知</span>
                    <label class="switch">
                      <input type="checkbox" v-model="notifications.newFollower">
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">评论通知</span>
                    <label class="switch">
                      <input type="checkbox" v-model="notifications.comments">
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">系统消息</span>
                    <label class="switch">
                      <input type="checkbox" v-model="notifications.system">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { HttpManager } from '../api/index'

const store = useStore()
const isCollapsed = ref(false)
const activeNav = ref('profile')
const avatarType = ref('default')
const defaultAvatar = 'https://picsum.photos/200?random=2'

const user = ref({
  nickname: 'tnedjwedne',
  username: 'Zy0620',
  id: '4741',
  email: '',
  phone: '',
  website: '',
  description: '帅气的我简直无法用语言描述！',
  avatar: '',
  cover: 'https://picsum.photos/800/300?random=3'
})

const stats = ref({
  followers: 128,
  following: 64,
  posts: 42
})

const privacy = ref({
  publicProfile: true,
  showOnline: true,
  allowMessages: true
})

const notifications = ref({
  newFollower: true,
  comments: true,
  system: true
})

const navItems = ref([
  { id: 'profile', name: '个人资料', icon: 'fa-user' },
  { id: 'collection', name: '我的收藏', icon: 'fa-star' },
  { id: 'messages', name: '站内消息', icon: 'fa-envelope' },
  { id: 'security', name: '账户安全', icon: 'fa-shield-alt' },
  { id: 'settings', name: '系统设置', icon: 'fa-cog' }
])

onMounted(async () => {
  if (!user.value.id) {
    try {
      const response = await HttpManager.getUserProfile()
      store.commit('setUserInfo', response.data)
      user.value = { ...user.value, ...response.data }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }
})

const switchNav = (navId) => {
  activeNav.value = navId
  // 这里可以根据navId跳转到不同页面或加载不同内容
}

const saveProfile = async () => {
  try {
    const params = {
      nickname: user.value.nickname,
      description: user.value.description,
      avatar: avatarType.value === 'custom' ? user.value.avatar : defaultAvatar,
      website: user.value.website,
      email: user.value.email,
      phone: user.value.phone
    }
    await HttpManager.updateUserProfile(params)
    store.commit('setUserInfo', { ...store.state.user, ...params })
    alert('资料保存成功！')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('保存失败，请重试。')
  }
}

const editCover = () => {
  // 实现封面编辑逻辑
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.cover = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const editAvatar = () => {
  // 实现头像编辑逻辑
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.avatar = e.target.result
        avatarType.value = 'custom'
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}
</script>

<style scoped>
/* 继承 home.vue 的全局变量和基本样式 */
@import url('https://fonts.googleapis.com/css2?family=MiSans:wght@300;400;500;600;700&display=swap');

:root {
  --bg: #e6f7ff;
  --card: rgba(255, 255, 255, 0.88);
  --blur: 16px;
  --primary: #0066ff;
  --primary-dark: #0052cc;
  --text: #2d3748;
  --text-light: #718096;
  --shadow: 0 8px 32px rgba(0,0,0,0.1);
  --shadow-hover: 0 20px 50px rgba(0,0,0,0.18);
}

* {
  box-sizing: border-box;
  margin: 0;
}

body, html, #app {
  margin: 0;
  padding: 0;
  font-family: 'MiSans', sans-serif;
  background: linear-gradient(180deg, #f3f7fc 0%, #eef3f7 100%);
  height: 100%;
  overflow: hidden;
  color: var(--text);
}

/* 去掉所有文字下划线 */
a, button, .dropdown-item, .nav-text,
.quick-bubble, .nav-item, .sidebar-header h2, .section-title h2,
.search-bar input, .engine-select, .search-btn, .avatar-btn, .toggle-btn,
.add-menu div, .add-item, .nav-item span {
  text-decoration: none !important;
}

.container {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: 0.2rem 0;
  display: flex;
  gap: 2rem;
}

.main-wrapper {
  background: linear-gradient(135deg,
  rgba(240, 249, 255, 0.95) 0%,
  rgba(203, 235, 255, 0.85) 45%,
  rgba(240, 253, 255, 0.95) 100%
  );
}

/* 侧边栏样式 - 与home.vue一致 */
.sidebar {
  background: var(--card);
  backdrop-filter: blur(var(--blur));
  border-radius: 32px;
  padding: 2rem;
  box-shadow: var(--shadow);
  height: fit-content;
  flex-shrink: 0;
  position: sticky;
  top: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: .5rem;
  border-radius: 50%;
  transition: all .2s;
}

.toggle-btn:hover {
  background: #e0f2fe;
}

.nav-list {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all .25s;
  position: relative;
  margin-bottom: .5rem;
}

.nav-item:hover, .nav-item.active {
  background: #dbeafe;
  color: var(--primary);
  font-weight: 600;
}

.nav-text {
  font-size: 1.1rem;
  margin-left: 1rem;
}

/* 主内容区样式 */
main {
  flex: 1;
  transition: all 0.4s;
}

/* 区块容器 */
.section-container {
  margin-bottom: 2rem;
  width: 100%;
}

/* 区块标题栏 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.section-title-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
}

/* 按钮样式 - 与home.vue一致 */
.more-btn-small {
  height: 36px;
  padding: 0 1.2rem;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  transition: all 0.3s;
}

.more-btn-small:hover {
  background: #0052cc;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
}

/* 区块卡片 */
.section-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(var(--blur));
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  box-shadow: var(--shadow);
  transition: all .4s cubic-bezier(.34, 1.56, .64, 1);
  width: 100%;
  height: auto;
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* 个人资料头部 */
.profile-header {
  margin-bottom: 2rem;
}

.profile-banner {
  position: relative;
  margin-bottom: 4rem;
}

.profile-avatar-container {
  position: absolute;
  bottom: -48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.profile-info h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

/* 表单样式 */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-label {
  width: 120px;
  text-align: right;
  margin-right: 2rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'MiSans', sans-serif;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0066ff;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.form-static {
  flex: 1;
  padding: 0.75rem 1rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* 开关按钮 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0066ff;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* 网格布局 */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 1rem;
    position: static;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-label {
    width: 100%;
    text-align: left;
    margin-bottom: 0.5rem;
    margin-right: 0;
  }

  .form-input,
  .form-textarea,
  .form-static {
    width: 100%;
  }
}
</style>

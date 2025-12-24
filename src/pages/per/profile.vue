<template>
  <div class="profile-page">
    <!-- 侧边栏 - 保持不变 -->
    <div class="sidebar-wrapper">
      <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'expanded': !isCollapsed }">
        <div class="sidebar-header">
          <h2 v-if="!isCollapsed" class="sidebar-title">个人中心</h2>
          <button @click="isCollapsed = !isCollapsed" class="toggle-btn">
            <i :class="['fas', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
          </button>
        </div>
        <nav class="nav-list">
          <div
            v-for="item in navItems"
            :key="item.id"
            :class="['nav-item', { active: activeNav === item.id }]"
            @click="switchNav(item.id)"
          >
            <i :class="['fas nav-icon', item.icon, !isCollapsed ? 'with-margin' : '']"></i>
            <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
            <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
          </div>
        </nav>
      </aside>
    </div>

    <!-- 主内容区 -->
    <main :class="['main-content', isCollapsed ? 'no-margin' : 'with-margin']">
      <!-- 顶部个人资料卡片 -->
      <div class="profile-card">
        <!-- 封面图区域 - 高度减小 -->
        <div class="cover-container">
          <img :src="user.cover || randomCoverUrl" alt="封面" class="cover-image">
          <div class="cover-overlay"></div>
          <div class="cover-actions">
            <button @click="refreshCover" class="cover-btn" title="换一张封面">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button @click="editCover" class="cover-btn" title="上传封面">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>

        <!-- 用户信息卡片 - 单独一个卡片 -->
        <div class="user-info-card">
          <div class="user-info-content">
            <!-- 头像区域 -->
            <div class="avatar-section">
              <div class="avatar-container">
                <img :src="user.avatar || randomAvatarUrl" alt="头像" class="avatar-image">
                <div class="avatar-status"></div>
                <div class="avatar-actions">
                  <button @click="refreshAvatar" class="avatar-action-btn" title="随机头像">
                    <i class="fas fa-random"></i>
                  </button>
                  <button @click="editAvatar" class="avatar-action-btn" title="上传头像">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 用户信息区域 -->
            <div class="user-details">
              <div class="user-header">
                <div class="name-section">
                  <div class="name-item">
                    <div class="name-label">昵称</div>
                    <div class="name-value">{{ user.nickname || 'tnedjwedne' }}</div>
                  </div>
                  <div class="name-item">
                    <div class="name-label">用户名</div>
                    <div class="name-value">@{{ user.username || 'Zy0620' }}</div>
                  </div>
                  <div class="name-item">
                    <div class="name-label">用户ID</div>
                    <div class="name-value">{{ user.id || '4741' }}</div>
                  </div>
                </div>
              </div>

              <p class="user-bio">{{ user.description || '这个人很酷，什么也没有留下～' }}</p>

              <div class="stats-section">
                <div class="stat-item">
                  <span class="stat-value">{{ stats.followers || 128 }}</span>
                  <span class="stat-label">粉丝</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ stats.following || 64 }}</span>
                  <span class="stat-label">关注</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ stats.posts || 42 }}</span>
                  <span class="stat-label">动态</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑区域 -->
      <div class="edit-sections">
        <!-- 基础信息 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-user-edit section-icon"></i>
              基础信息
            </h2>
            <button @click="saveProfile" class="save-btn">
              <i class="fas fa-save"></i>
              保存修改
            </button>
          </div>
          <div class="section-card">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-signature"></i>
                  昵称
                </label>
                <input v-model="user.nickname" type="text" class="form-input" placeholder="请输入你的昵称">
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-user"></i>
                  用户名
                </label>
                <div class="form-static">{{ user.username || 'Zy0620' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-id-card"></i>
                  账号ID
                </label>
                <div class="form-static">{{ user.id || '4741' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-envelope"></i>
                  邮箱地址
                </label>
                <input v-model="user.email" type="email" class="form-input" placeholder="请输入邮箱地址">
              </div>
            </div>
          </div>
        </div>

        <!-- 个人简介 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-edit"></i>
              个人简介
            </h2>
          </div>
          <div class="section-card">
            <div class="form-group full-width">
              <textarea v-model="user.description"
                        class="form-textarea"
                        rows="4"
                        placeholder="介绍一下自己吧...（不超过200字）"
                        maxlength="200"></textarea>
              <div class="char-count">{{ user.description?.length || 0 }}/200</div>
            </div>
          </div>
        </div>

        <!-- 头像设置 - 修改：增加随机头像选项 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-portrait"></i>
              头像设置
            </h2>
          </div>
          <div class="section-card">
            <div class="avatar-options">
              <div class="option-group">
                <label class="option-label">
                  <input type="radio" v-model="avatarType" value="random" class="option-radio">
                    <div class="option-card">
                      <div class="option-icon">
                        <i class="fas fa-random"></i>
                      </div>
                      <div class="option-content">
                        <h4>随机头像</h4>
                        <p>每次刷新获取新头像</p>
                        <button @click.stop="refreshAvatar" class="refresh-btn-small">
                          <i class="fas fa-redo"></i> 换一张
                        </button>
                      </div>
                    </div>
                </label>

                <label class="option-label">
                  <input type="radio" v-model="avatarType" value="custom" class="option-radio">
                  <div class="option-card">
                    <div class="option-icon">
                      <i class="fas fa-upload"></i>
                    </div>
                    <div class="option-content">
                      <h4>自定义头像</h4>
                      <p>上传你自己的头像</p>
                      <button @click="editAvatar" class="refresh-btn-small">
                        <i class="fas fa-redo"></i> 换一张
                      </button>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 封面设置 - 新增：封面设置选项 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-image"></i>
              封面设置
            </h2>
          </div>
          <div class="section-card">
            <div class="cover-options">
              <div class="option-group">
                <!-- 随机封面选项 -->
                <label class="option-label">
                  <input type="radio" v-model="coverType" value="random" class="option-radio">
                  <div class="option-card">
                    <div class="option-icon">
                      <i class="fas fa-random"></i>
                    </div>
                    <div class="option-content">
                      <h4>随机封面</h4>
                      <p>每次刷新获取新封面</p>
                      <button @click.stop="refreshCover" class="refresh-btn-small">
                        <i class="fas fa-redo"></i> 换一张
                      </button>
                    </div>
                  </div>
                </label>

                <!-- 自定义封面选项 -->
                <label class="option-label">
                  <input type="radio" v-model="coverType" value="custom" class="option-radio">
                  <div class="option-card">
                    <div class="option-icon">
                      <i class="fas fa-upload"></i>
                    </div>
                    <div class="option-content">
                      <h4>自定义封面</h4>
                      <p>上传你自己的封面</p>
                      <button @click="editCover" class="refresh-btn-small">
                        <i class="fas fa-redo"></i> 换一张
                      </button>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-lock section-icon"></i>
              隐私设置
            </h2>
          </div>
          <div class="section-card">
            <div class="privacy-settings">
              <div class="settings-grid">
                <div class="setting-item" :class="{ 'active': privacySettings.publicProfile }">
                  <div class="setting-left">
                    <div class="setting-icon">
                      <i class="fas fa-globe"></i>
                    </div>
                    <div class="setting-info">
                      <h4>公开个人资料</h4>
                      <p>允许其他人查看你的个人资料</p>
                    </div>
                  </div>
                  <div class="setting-right">
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="privacySettings.publicProfile">
                      <span class="toggle-slider"></span>
                      <span class="toggle-status">
                  {{ privacySettings.publicProfile ? '开启' : '关闭' }}
                </span>
                    </label>
                  </div>
                </div>

                <div class="setting-item" :class="{ 'active': privacySettings.showOnline }">
                  <div class="setting-left">
                    <div class="setting-icon">
                      <i class="fas fa-circle"></i>
                    </div>
                    <div class="setting-info">
                      <h4>显示在线状态</h4>
                      <p>向好友展示你的在线状态</p>
                    </div>
                  </div>
                  <div class="setting-right">
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="privacySettings.showOnline">
                      <span class="toggle-slider"></span>
                      <span class="toggle-status">
                  {{ privacySettings.showOnline ? '开启' : '关闭' }}
                </span>
                    </label>
                  </div>
                </div>

                <div class="setting-item" :class="{ 'active': privacySettings.allowMessages }">
                  <div class="setting-left">
                    <div class="setting-icon">
                      <i class="fas fa-comment-alt"></i>
                    </div>
                    <div class="setting-info">
                      <h4>允许私信</h4>
                      <p>接收其他用户的私信</p>
                    </div>
                  </div>
                  <div class="setting-right">
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="privacySettings.allowMessages">
                      <span class="toggle-slider"></span>
                      <span class="toggle-status">
                  {{ privacySettings.allowMessages ? '开启' : '关闭' }}
                </span>
                    </label>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-left">
                    <div class="setting-icon">
                      <i class="fas fa-eye"></i>
                    </div>
                    <div class="setting-info">
                      <h4>动态可见性</h4>
                      <p>谁可以看到你的动态</p>
                    </div>
                  </div>
                  <div class="setting-right">
                    <select v-model="privacySettings.postVisibility" class="visibility-select">
                      <option value="public">所有人</option>
                      <option value="followers">仅关注者</option>
                      <option value="private">仅自己</option>
                    </select>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-left">
                    <div class="setting-icon">
                      <i class="fas fa-search"></i>
                    </div>
                    <div class="setting-info">
                      <h4>搜索引擎收录</h4>
                      <p>允许搜索引擎收录你的资料</p>
                    </div>
                  </div>
                  <div class="setting-right">
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="privacySettings.searchable">
                      <span class="toggle-slider"></span>
                      <span class="toggle-status">
                  {{ privacySettings.searchable ? '允许' : '禁止' }}
                </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title-text">
              <i class="fas fa-bell section-icon"></i>
              通知设置
            </h2>
            <div class="notification-actions">
              <button @click="toggleAllNotifications(true)" class="action-btn enable-all">
                <i class="fas fa-check-circle"></i>
                全部开启
              </button>
              <button @click="toggleAllNotifications(false)" class="action-btn disable-all">
                <i class="fas fa-ban"></i>
                全部关闭
              </button>
            </div>
          </div>
          <div class="section-card">
            <div class="notification-settings">
              <!-- 通知分组 -->
              <div class="notification-group">
                <h3 class="group-title">
                  <i class="fas fa-users"></i>
                  社交通知
                </h3>
                <div class="settings-grid">
                  <div class="setting-item" :class="{ 'active': notificationSettings.newFollower }">
                    <div class="setting-left">
                      <div class="setting-icon follower">
                        <i class="fas fa-user-plus"></i>
                      </div>
                      <div class="setting-info">
                        <h4>新粉丝通知</h4>
                        <p>有人关注你时发送通知</p>
                        <span class="setting-tip">实时推送 + 邮件</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.newFollower">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="setting-item" :class="{ 'active': notificationSettings.comments }">
                    <div class="setting-left">
                      <div class="setting-icon comment">
                        <i class="fas fa-comment"></i>
                      </div>
                      <div class="setting-info">
                        <h4>评论通知</h4>
                        <p>收到评论时发送通知</p>
                        <span class="setting-tip">实时推送</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.comments">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="setting-item" :class="{ 'active': notificationSettings.likes }">
                    <div class="setting-left">
                      <div class="setting-icon like">
                        <i class="fas fa-heart"></i>
                      </div>
                      <div class="setting-info">
                        <h4>点赞通知</h4>
                        <p>收到点赞时发送通知</p>
                        <span class="setting-tip">每日摘要</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.likes">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="setting-item" :class="{ 'active': notificationSettings.mentions }">
                    <div class="setting-left">
                      <div class="setting-icon mention">
                        <i class="fas fa-at"></i>
                      </div>
                      <div class="setting-info">
                        <h4>@提及通知</h4>
                        <p>被其他用户提及时通知</p>
                        <span class="setting-tip">实时推送</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.mentions">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-group">
                <h3 class="group-title">
                  <i class="fas fa-cog"></i>
                  系统通知
                </h3>
                <div class="settings-grid">
                  <div class="setting-item" :class="{ 'active': notificationSettings.system }">
                    <div class="setting-left">
                      <div class="setting-icon system">
                        <i class="fas fa-bullhorn"></i>
                      </div>
                      <div class="setting-info">
                        <h4>系统消息</h4>
                        <p>接收系统公告和更新</p>
                        <span class="setting-tip">邮件 + 站内信</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.system">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="setting-item" :class="{ 'active': notificationSettings.security }">
                    <div class="setting-left">
                      <div class="setting-icon security">
                        <i class="fas fa-shield-alt"></i>
                      </div>
                      <div class="setting-info">
                        <h4>安全通知</h4>
                        <p>账户安全相关提醒</p>
                        <span class="setting-tip">重要通知</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.security">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="setting-item" :class="{ 'active': notificationSettings.promotions }">
                    <div class="setting-left">
                      <div class="setting-icon promotion">
                        <i class="fas fa-gift"></i>
                      </div>
                      <div class="setting-info">
                        <h4>推广通知</h4>
                        <p>接收活动和推广信息</p>
                        <span class="setting-tip">可选接收</span>
                      </div>
                    </div>
                    <div class="setting-right">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="notificationSettings.promotions">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 通知频率设置 -->
              <div class="frequency-settings">
                <h3 class="group-title">
                  <i class="fas fa-clock"></i>
                  通知频率
                </h3>
                <div class="frequency-options">
                  <label class="frequency-option" :class="{ 'active': notificationFrequency === 'realtime' }">
                    <input type="radio" v-model="notificationFrequency" value="realtime">
                    <div class="option-content">
                      <h4>实时推送</h4>
                      <p>立即接收所有通知</p>
                    </div>
                  </label>
                  <label class="frequency-option" :class="{ 'active': notificationFrequency === 'daily' }">
                    <input type="radio" v-model="notificationFrequency" value="daily">
                    <div class="option-content">
                      <h4>每日摘要</h4>
                      <p>每天汇总一次通知</p>
                    </div>
                  </label>
                  <label class="frequency-option" :class="{ 'active': notificationFrequency === 'weekly' }">
                    <input type="radio" v-model="notificationFrequency" value="weekly">
                    <div class="option-content">
                      <h4>每周摘要</h4>
                      <p>每周汇总一次通知</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElNotification } from 'element-plus'

const store = useStore()
const isCollapsed = ref(false)
const activeNav = ref('profile')
const avatarType = ref('random')
const coverType = ref('random')
const notificationFrequency = ref('realtime') // 添加通知频率变量

// 随机图片生成器
const useRandomImages = () => {
  const randomAvatarUrl = ref('')
  const randomCoverUrl = ref('')

  const randomNumber = () => Math.floor(Math.random() * 1000)

  const imageSources = [
    {
      name: 'unsplash',
      avatar: () => `https://loremflickr.com/256/256/portrait?random=${randomNumber()}`,
      cover: () => `https://picsum.photos/seed/cover-${randomNumber()}/1920/600`
    },
    {
      name: 'picsum',
      avatar: () => `https://picsum.photos/seed/avatar-${randomNumber()}/256/256`,
      cover: () => `https://picsum.photos/seed/cover-${randomNumber()}/1920/600`
    },
    {
      name: 'flickr',
      avatar: () => `https://loremflickr.com/256/256/portrait?random=${randomNumber()}`,
      cover: () => `https://loremflickr.com/1920/600/scenery,landscape?random=${randomNumber()}`
    }
  ]

  const getRandomSource = () => {
    return imageSources[Math.floor(Math.random() * imageSources.length)]
  }

  const generateRandomAvatar = () => {
    const source = getRandomSource()
    randomAvatarUrl.value = source.avatar()
    return randomAvatarUrl.value
  }

  const generateRandomCover = () => {
    const source = getRandomSource()
    randomCoverUrl.value = source.cover()
    return randomCoverUrl.value
  }

  const generateBoth = () => {
    generateRandomAvatar()
    generateRandomCover()
  }

  return {
    randomAvatarUrl,
    randomCoverUrl,
    generateRandomAvatar,
    generateRandomCover,
    generateBoth
  }
}

const {
  randomAvatarUrl,
  randomCoverUrl,
  generateRandomAvatar,
  generateRandomCover,
  generateBoth
} = useRandomImages()

const user = ref({
  nickname: 'tnedjwedne',
  username: 'Zy0620',
  id: '4741',
  email: 'user@example.com',
  description: '这个人很酷，什么也没有留下～',
  avatar: '',
  cover: ''
})

const stats = ref({
  followers: 128,
  following: 64,
  posts: 42
})

// 扩展隐私设置
const privacySettings = ref({
  publicProfile: true,
  showOnline: true,
  allowMessages: true,
  postVisibility: 'public',
  searchable: true
})

// 扩展通知设置
const notificationSettings = ref({
  newFollower: true,
  comments: true,
  likes: true,
  mentions: true,
  system: true,
  security: true,
  promotions: false
})

const navItems = ref([
  { id: 'profile', name: '个人资料', icon: 'fa-user', badge: null },
  { id: 'collection', name: '我的收藏', icon: 'fa-star', badge: 3 },
  { id: 'messages', name: '站内消息', icon: 'fa-envelope', badge: 5 },
  { id: 'security', name: '账户安全', icon: 'fa-shield-alt', badge: null },
  { id: 'settings', name: '系统设置', icon: 'fa-cog', badge: null }
])

onMounted(async () => {
  generateBoth()

  const token = localStorage.getItem('token')
  if (token) {
    try {
      await store.dispatch('fetchUserProfile')

      if (user.value.avatar) {
        avatarType.value = 'custom'
      }
      if (user.value.cover) {
        coverType.value = 'custom'
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      store.commit('clearUserInfo')
    }
  }
})

watch(avatarType, (newVal) => {
  if (newVal === 'random') {
    user.value.avatar = generateRandomAvatar()
  }
})

watch(coverType, (newVal) => {
  if (newVal === 'random') {
    user.value.cover = generateRandomCover()
  }
})

// 监听隐私设置变化（实际应用中应该保存到后端）
watch(privacySettings, (newSettings) => {
  console.log('隐私设置已更新:', newSettings)
  // TODO: 实际应用中这里应该调用API保存到后端
  // localStorage.setItem('privacySettings', JSON.stringify(newSettings))
}, { deep: true })

// 监听通知设置变化
watch(notificationSettings, (newSettings) => {
  console.log('通知设置已更新:', newSettings)
  // TODO: 实际应用中这里应该调用API保存到后端
  // localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
}, { deep: true })

// 监听通知频率变化
watch(notificationFrequency, (newFrequency) => {
  console.log('通知频率已更新:', newFrequency)
  // TODO: 实际应用中这里应该调用API保存到后端
  // localStorage.setItem('notificationFrequency', newFrequency)
})

const switchNav = (navId) => {
  activeNav.value = navId
  // 这里可以根据不同的导航项加载不同的内容
  // 例如：if (navId === 'collection') loadCollectionData()
}

const refreshAvatar = () => {
  if (avatarType.value === 'random') {
    user.value.avatar = generateRandomAvatar()
    ElMessage.success('已刷新随机头像')
  } else {
    generateRandomAvatar()
    ElMessage.info('已生成新的随机头像，切换类型即可使用')
  }
}

const refreshCover = () => {
  if (coverType.value === 'random') {
    user.value.cover = generateRandomCover()
    ElMessage.success('已刷新随机封面')
  } else {
    generateRandomCover()
    ElMessage.info('已生成新的随机封面，切换类型即可使用')
  }
}

const editCover = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 300 * 1024 * 1024) { // 5MB限制
        ElMessage.error('头像图片不能超过300MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.avatar = e.target.result
        avatarType.value = 'custom'
        ElMessage.success('头像上传成功')

        // TODO: 实际应用中这里应该调用API上传到后端
        // uploadAvatarToServer(file).then(url => {
        //   user.value.avatar = url
        // })
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const editAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 300 * 1024 * 1024) { // 10MB限制
        ElMessage.error('封面图片不能超过300MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.cover = e.target.result
        coverType.value = 'custom'
        ElMessage.success('封面上传成功')

        // TODO: 实际应用中这里应该调用API上传到后端
        // uploadCoverToServer(file).then(url => {
        //   user.value.cover = url
        // })
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const saveProfile = () => {
  if (!user.value.nickname.trim()) {
    ElMessage.error('昵称不能为空')
    return
  }

  if (!user.value.email.trim()) {
    ElMessage.error('邮箱不能为空')
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(user.value.email)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  // 创建要保存的数据对象
  const profileData = {
    nickname: user.value.nickname,
    email: user.value.email,
    description: user.value.description,
    avatar: user.value.avatar,
    cover: user.value.cover,
    avatarType: avatarType.value,
    coverType: coverType.value
  }

  console.log('保存个人资料:', profileData)

  // TODO: 实际应用中这里应该调用API保存到后端
  // api.updateProfile(profileData).then(response => {
  //   ElMessage.success('个人资料保存成功')
  // }).catch(error => {
  //   ElMessage.error('保存失败: ' + error.message)
  // })

  // 模拟保存到localStorage（前端开发阶段）
  localStorage.setItem('userProfile', JSON.stringify(profileData))

  // 显示保存成功消息
  ElMessage.success('个人资料保存成功')

  // 模拟显示通知（实际应用中会根据设置发送）
  if (notificationSettings.value.system) {
    ElNotification({
      title: '个人资料更新',
      message: '您的个人资料已成功更新',
      type: 'success'
    })
  }
}

// 批量操作通知
const toggleAllNotifications = (enabled) => {
  Object.keys(notificationSettings.value).forEach(key => {
    notificationSettings.value[key] = enabled
  })
  ElMessage.success(enabled ? '已开启所有通知' : '已关闭所有通知')
}
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  gap: 20px;
}

/* 侧边栏样式 - 保持不变 */
.sidebar-wrapper {
  flex-shrink: 0;
}

.sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 280px;
  height: fit-content;
  position: sticky;
  top: 20px;
  overflow: hidden;

  &.collapsed {
    width: 80px;
  }

  &.expanded {
    width: 280px;
  }
}

.sidebar-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.nav-list {
  padding: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    color: #667eea;
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;

  &.with-margin {
    margin-right: 12px;
  }
}

.nav-text {
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}

.nav-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 主内容区 */
.main-content {
  flex: 1;

  &.with-margin {
    margin-left: 20px;
  }

  &.no-margin {
    margin-left: 0;
  }
}

/* 个人资料卡片 */
.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

/* 封面区域 - 高度减小 */
.cover-container {
  position: relative;
  height: 200px; /* 减小高度 */
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%);
}

.cover-actions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.cover-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
}

/* 用户信息卡片 */
.user-info-card {
  padding: 0 32px 32px;
  background: white;
}

.user-info-content {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  margin-top: -20px; /* 轻微上移，但不覆盖封面 */
  position: relative;
  z-index: 10;
}

/* 头像区域 */
.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 140px; /* 稍微加大头像 */
  height: 140px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.avatar-status {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 18px;
  height: 18px;
  background: #48bb78;
  border: 3px solid white;
  border-radius: 50%;
}

.avatar-actions {
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
}

.avatar-action-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
}

/* 用户信息区域 */
.user-details {
  flex: 1;
  padding-top: 20px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.name-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex: 1;
}

.name-item {
  display: flex;
  flex-direction: column;
}

.name-label {
  font-size: 12px;
  color: #718096;
  margin-bottom: 6px;
  font-weight: 500;
}

.name-value {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  background: #f8fafc;
  padding: 5px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  min-height: 44px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e0;
    background: #f1f5f9;
  }
}

.user-bio {
  color: #4a5568;
  font-size: 16px;
  line-height: 1.6;
  margin: 24px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 10px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #cbd5e0, transparent);
}

/* 编辑区域 */
.edit-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.section-header {
  padding: 24px;
  background: linear-gradient(135deg, #f6f9fc 0%, #f0f4f8 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-text {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.section-icon {
  color: #667eea;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
}

.section-card {
  padding: 32px;
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.form-group {
  &.full-width {
    grid-column: 1 / -1;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.form-input, .form-textarea, .form-static {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box; /* 确保 padding 不影响总宽度 */
}

.form-input, .form-textarea {
  border: 2px solid #e2e8f0;
  color: #2d3748;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.form-static {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  min-height: 48px; /* 与输入框高度保持一致 */
  display: flex;
  align-items: center;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #a0aec0;
  margin-top: 4px;
}

/* 头像选项 */
.avatar-options {
  .option-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .option-label {
    cursor: pointer;
  }

  .option-radio {
    display: none;

    &:checked + .option-card {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
  }

  .option-card {
    padding: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
    }
  }

  .option-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
  }

  .option-content {
    flex: 1;

    h4 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }
  }

  .avatar-preview {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 24px;
  }

  .preview-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e2e8f0;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
  }
}

/* 刷新按钮小样式 */
.refresh-btn-small {
  margin-top: 8px;
  padding: 4px 12px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #38a169;
    transform: translateY(-1px);
  }
}

/* 封面预览样式 */
/* 封面选项样式 - 复用头像选项的样式 */
.cover-options {
  .option-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .option-label {
    cursor: pointer;
  }

  .option-radio {
    display: none;

    &:checked + .option-card {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
  }

  .option-card {
    padding: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
    }
  }

  .option-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
  }

  .option-content {
    flex: 1;

    h4 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0 0 8px 0;
      color: #718096;
      font-size: 14px;
    }
  }

  /* 按钮样式 */
  .refresh-btn-small {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    }

    i {
      font-size: 11px;
    }
  }

  /* 如果需要封面预览区域，可以添加以下样式 */
  .cover-preview {
    margin-top: 24px;
    padding: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
  }

  .preview-container-large {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e2e8f0;
    margin-bottom: 16px;

    .preview-image-large {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    }

    i {
      font-size: 16px;
    }
  }
}

.privacy-settings,
.notification-settings {
  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      border-color: #cbd5e0;
      background: #f1f5f9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    }
  }

  .setting-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .setting-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    flex-shrink: 0;

    // 不同的图标颜色
    &.follower { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    &.comment { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
    &.like { background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%); }
    &.mention { background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); }
    &.system { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); }
    &.security { background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); }
    &.promotion { background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%); }

    i {
      font-size: 20px;
    }
  }

  .setting-info {
    flex: 1;

    h4 {
      margin: 0 0 6px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0 0 4px 0;
      color: #718096;
      font-size: 14px;
      line-height: 1.4;
    }

    .setting-tip {
      display: inline-block;
      padding: 2px 8px;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      font-size: 12px;
      border-radius: 10px;
      font-weight: 500;
    }
  }

  .setting-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* 增强版切换开关 */
  .toggle-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .toggle-slider {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
    background-color: #cbd5e0;
    border-radius: 28px;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .toggle-switch input:checked + .toggle-slider {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(24px);
  }

  .toggle-status {
    font-size: 14px;
    font-weight: 500;
    color: #718096;
    min-width: 40px;
    text-align: center;
  }

  .toggle-switch input:checked ~ .toggle-status {
    color: #667eea;
    font-weight: 600;
  }

  /* 可见性选择器 */
  .visibility-select {
    padding: 8px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    background: white;
    color: #2d3748;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:hover {
      border-color: #cbd5e0;
    }
  }
}

/* 通知设置特定样式 */
.notification-settings {
  .notification-actions {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;

    &.enable-all {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      }
    }

    &.disable-all {
      background: #e2e8f0;
      color: #718096;

      &:hover {
        background: #cbd5e0;
        transform: translateY(-2px);
      }
    }
  }

  .notification-group {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .group-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 20px 0;

    i {
      color: #667eea;
    }
  }

  /* 通知频率设置 */
  .frequency-settings {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 2px solid #e2e8f0;

    .frequency-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .frequency-option {
      cursor: pointer;

      input[type="radio"] {
        display: none;
      }

      .option-content {
        padding: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        background: #f8fafc;
        transition: all 0.3s ease;

        h4 {
          margin: 0 0 8px 0;
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
        }

        p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }
      }

      &.active .option-content {
        border-color: #667eea;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        color: #667eea;
      }

      &:hover .option-content {
        border-color: #cbd5e0;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100% !important;
    margin-bottom: 20px;
    position: static;
  }

  .main-content {
    margin-left: 0 !important;
  }

  .user-info-content {
    flex-direction: column;
    text-align: center;
    margin-top: -60px;
  }

  .avatar-container {
    margin: 0 auto;
  }

  .name-section {
    grid-template-columns: 1fr;
  }

  .user-header {
    flex-direction: column;
    gap: 20px;
  }

  .stats-section {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 12px;
  }

  .cover-container {
    height: 150px;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .section-card {
    padding: 20px;
  }

  .section-header {
    padding: 16px;
  }
  .privacy-settings,
  .notification-settings {
    .setting-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .setting-right {
      width: 100%;
      justify-content: space-between;
    }

    .toggle-switch {
      flex: 1;
      justify-content: space-between;
    }

    .visibility-select {
      width: 100%;
    }
  }

  .notification-settings {
    .notification-actions {
      flex-direction: column;
      width: 100%;
    }

    .action-btn {
      width: 100%;
      justify-content: center;
    }

    .frequency-options {
      grid-template-columns: 1fr;
    }
  }
}
</style>

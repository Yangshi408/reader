<!-- pages/per/ProfileEdit.vue -->
<template>
  <div class="profile-edit">
    <!-- 顶部个人资料卡片 -->
    <div class="profile-card">
      <!-- 封面图区域 -->
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

      <!-- 用户信息卡片 -->
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
                  <div class="name-value">{{ user.nickname || '未设置' }}</div>
                </div>
                <div class="name-item">
                  <div class="name-label">用户名</div>
                  <div class="name-value">@{{ user.username || '未设置' }}</div>
                </div>
                <div class="name-item">
                  <div class="name-label">用户ID</div>
                  <div class="name-value">{{ user.id || '未设置' }}</div>
                </div>
              </div>
            </div>

            <p class="user-bio">{{ user.description || '这个人很酷，什么也没有留下～' }}</p>

            <div class="stats-section">
              <div class="stat-item">
                <span class="stat-value">{{ stats.followers || 0 }}</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.following || 0 }}</span>
                <span class="stat-label">关注</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.posts || 0 }}</span>
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
              <div class="form-static">{{ user.username || '未设置' }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-id-card"></i>
                账号ID
              </label>
              <div class="form-static">{{ user.id || '未设置' }}</div>
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

      <!-- 头像设置 -->
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

      <!-- 封面设置 -->
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()
const avatarType = ref('random')
const coverType = ref('random')

// 使用store中的用户信息
const user = ref({
  nickname: '',
  username: '',
  id: '',
  email: '',
  description: '',
  avatar: '',
  cover: ''
})

const stats = ref({
  followers: 0,
  following: 0,
  posts: 0
})

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

onMounted(async () => {
  generateBoth()

  // 从store获取用户信息
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await store.dispatch('fetchUserProfile')
      if (response.data) {
        user.value = response.data

        // 设置头像类型
        if (user.value.avatar) {
          avatarType.value = 'custom'
        }
        // 设置封面类型
        if (user.value.cover) {
          coverType.value = 'custom'
        }
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      ElMessage.error('获取用户资料失败')
    }
  }
})

// 监听头像类型变化
watch(avatarType, (newVal) => {
  if (newVal === 'random') {
    user.value.avatar = generateRandomAvatar()
  }
})

// 监听封面类型变化
watch(coverType, (newVal) => {
  if (newVal === 'random') {
    user.value.cover = generateRandomCover()
  }
})

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

const editAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('头像图片不能超过5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.avatar = e.target.result
        avatarType.value = 'custom'
        ElMessage.success('头像上传成功')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const editCover = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('封面图片不能超过10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        user.value.cover = e.target.result
        coverType.value = 'custom'
        ElMessage.success('封面上传成功')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const saveProfile = async () => {
  if (!user.value.nickname?.trim()) {
    ElMessage.error('昵称不能为空')
    return
  }

  if (user.value.email && !validateEmail(user.value.email)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  try {
    const profileData = {
      nickname: user.value.nickname,
      email: user.value.email || '',
      description: user.value.description || '',
      avatar: user.value.avatar || '',
      face_photo: user.value.cover || ''
    }

    const response = await store.dispatch('updateUserProfile', profileData)
    if (response.success) {
      ElMessage.success('个人资料保存成功')
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存个人资料失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
</script>

<style lang="scss" scoped>
.profile-edit {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cover-container {
  position: relative;
  height: 200px;
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

.user-info-card {
  padding: 0 32px 32px;
  background: white;
}

.user-info-content {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  margin-top: -20px;
  position: relative;
  z-index: 10;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 140px;
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
  margin-bottom: 8px;
}

.form-input, .form-textarea, .form-static {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
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
  min-height: 48px;
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

.avatar-options, .cover-options {
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
      margin: 0 0 8px 0;
      color: #718096;
      font-size: 14px;
    }
  }
}

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
}

@media (max-width: 1024px) {
  .profile-edit {
    padding: 12px;
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

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cover-container {
    height: 150px;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
  }

  .section-card {
    padding: 20px;
  }

  .section-header {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .save-btn {
    align-self: flex-end;
  }
}
</style>

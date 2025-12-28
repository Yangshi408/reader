<template>
  <div class="app-container">
    <div class="main-wrapper"
         @mousemove="handleMouseMove"
         @mouseleave="handleMouseLeave"
         ref="mainWrapper">

      <!-- 互动背景容器 -->
      <div class="interactive-bg" ref="interactiveBg">
        <!-- 粒子 -->
        <div v-for="particle in particles"
             :key="particle.id"
             :class="['interactive-particle', particle.type]"
             :style="{
               left: particle.x + 'px',
               top: particle.y + 'px',
               width: particle.size + 'px',
               height: particle.size + 'px',
               opacity: particle.opacity,
               filter: particle.filter
             }"
             ref="particleRefs">
        </div>

        <!-- 粒子连接线 -->
        <div v-for="connection in connections"
             :key="connection.id"
             class="particle-connection"
             :style="{
               left: connection.x + 'px',
               top: connection.y + 'px',
               width: connection.length + 'px',
               transform: 'rotate(' + connection.angle + 'rad)'
             }">
        </div>

        <!-- 鼠标轨迹点 -->
        <div v-for="trail in mouseTrails"
             :key="trail.id"
             class="mouse-trail"
             :style="{
               left: trail.x + 'px',
               top: trail.y + 'px',
               width: trail.size + 'px',
               height: trail.size + 'px',
               opacity: trail.opacity
             }">
        </div>

        <!-- 鼠标高亮 -->
        <div class="mouse-highlight"
             :style="{
               left: mousePos.x + 'px',
               top: mousePos.y + 'px',
               width: highlightSize + 'px',
               height: highlightSize + 'px',
               opacity: highlightOpacity
             }"
             v-show="highlightOpacity > 0">
        </div>
      </div>
      <div class="content-container">
        <!-- 左侧可折叠侧边栏 -->
        <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed, 'expanded': !isSidebarCollapsed }">
          <div class="sidebar-header">
            <img v-if="!isSidebarCollapsed" :src="logoImg" alt="Logo" class="sidebar-logo"/>
            <button @click="toggleSidebar" class="toggle-btn">
              <i :class="['fas', isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
            </button>
          </div>
          <nav class="nav-list">
            <div
              v-for="item in visibleSidebarItems"
              :key="item.id"
              :class="['nav-item', { active: homeActiveSection === item.id }]"
              @click="handleNavItem(item)"
            >
              <i :class="['fas nav-icon', item.icon, !isSidebarCollapsed ? 'with-margin' : '']"></i>
              <span v-if="!isSidebarCollapsed" class="nav-text">{{ item.name }}</span>
              <!-- 移除了右侧的叉叉按钮 -->
            </div>

            <!-- 添加自定义导航按钮 -->
            <div
              v-if="!isSidebarCollapsed"
              class="nav-item add-item"
              @click.stop="toggleAddMenu"
            >
              <i class="fas fa-plus nav-icon"></i>
              <span class="nav-text">添加导航</span>

              <!-- 添加菜单 -->
              <div v-if="showAddMenu" class="add-menu">
                <div
                  v-for="option in addMenuOptions"
                  :key="option.name"
                  @click.stop="handleAddMenuClick(option)"
                  class="add-option"
                >
                  <i :class="['fas', option.icon, 'option-icon']"></i>
                  <span class="option-name">{{ option.name }}</span>
                  <div class="option-status">
                    <i v-if="isCustomItemAdded(option.name, option.icon)"
                       class="fas fa-minus remove-icon"></i>
                    <i v-else class="fas fa-plus add-icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <main :class="['main-content', isSidebarCollapsed ? 'no-margin' : 'with-margin']">
          <div class="header-section">
            <!-- 三个快捷按钮 -->
            <div class="item-wrapper">
              <div class="quick-links">
                <a href="https://www.msn.com/zh-cn/lifestyle/calendar" target="_blank" class="quick-bubble">
                  <i class="far fa-calendar-alt icon-margin"></i>日历
                </a>
                <a href="https://image.baidu.com/" target="_blank" class="quick-bubble">
                  <i class="far fa-image icon-margin"></i>图片搜索
                </a>
                <a href="https://www.bilibili.com/v/popular/all" target="_blank" class="quick-bubble">
                  <i class="fas fa-fire icon-margin"></i>B站热点
                </a>
              </div>
            </div>

            <!-- 搜索框区域 -->
            <div class="search-wrapper">
              <!-- 左侧：日期 -->
              <div class="data-wrapper">
                <div class="date-big">{{ today }}</div>
                <div class="date-small">{{ weekday }}</div>
              </div>

              <!-- 中间：搜索栏 -->
              <div class="search-bar">
                <div class="engine-wrapper">
                  <div class="engine-trigger" @click.stop="toggleEngineMenu">
                    <span>{{ currentEngineName }}</span>
                    <i :class="['fas fa-chevron-down arrow-icon', { 'rotate': engineMenuOpen }]"></i>
                  </div>
                  <div v-if="engineMenuOpen" class="engine-dropdown">
                    <div
                      v-for="e in engines"
                      :key="e.value"
                      class="engine-option"
                      :class="{ 'selected': searchEngine === e.value }"
                      @click.stop="selectEngine(e.value)"
                    >
                      {{ e.name }}
                      <i v-if="searchEngine === e.value" class="fas fa-check check-icon"></i>
                    </div>
                  </div>
                </div>

                <input
                  v-model="searchInput"
                  @keydown.enter="doSearch"
                  @focus="handleSearchFocus"
                  placeholder="输入想要搜索的内容..."
                  class="search-input"
                />
                <button @click="doSearch" class="search-btn">搜索</button>
              </div>

              <!-- 右侧：时间 -->
              <div class="time-wrapper">
                <!-- 头像 -->
                <div class="avatar-container">
                  <button @click.stop="toggleDropdown" class="avatar-btn">
                    <span :class="['avatar-initial', isLoggedIn ? 'login-avatar' : 'guest-avatar']">
                      {{ userInitial }}
                    </span>
                  </button>
                  <div v-if="dropdownOpen" class="dropdown-menu">
                    <a href="/profile" class="dropdown-item login-option">个人主页</a>
                    <a v-if="isLoggedIn" href="/logout" class="dropdown-item login-option">退出登陆</a>
                    <a v-else href="/" class="dropdown-item login-option">点击登录</a>
                  </div>
                </div>
                <div class="time-big">{{ currentTime }}</div>
                <div class="time-small">今天也要加油哦！</div>
              </div>
            </div>
          </div>

          <!-- 常用 -->
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title-text">常用</h2>
            </div>
            <section id="common" class="section-card">
              <div class="grid-layout">
                <a
                  v-for="(site, i) in commonSites"
                  :key="i"
                  :href="site.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="item-card-small"
                >
                  <img :src="site.icon" :alt="site.name" class="item-icon-small" />
                  <div class="item-content-small">
                    <h3 class="item-name-small">{{ site.name }}</h3>
                    <p class="item-desc-small">{{ site.desc }}</p>
                  </div>
                </a>
              </div>
            </section>
          </div>

          <!-- 精选工具 -->
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title-text">精选工具</h2>
              <router-link to="/tools" class="more-btn-small">更多 →</router-link>
            </div>
            <section id="tools" class="section-card">
              <div class="grid-layout">
                <a
                  v-for="(tool, i) in homeTools"
                  :key="i"
                  :href="tool.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="item-card-small"
                >
                  <img :src="tool.icon" :alt="tool.name" class="item-icon-small" />
                  <div class="item-content-small">
                    <h3 class="item-name-small">{{ tool.name }}</h3>
                    <p class="item-desc-small">{{ tool.desc }}</p>
                  </div>
                </a>
              </div>
            </section>
          </div>

          <!-- 课程浏览 -->
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title-text">课程浏览</h2>
              <router-link to="/course" class="more-btn-small">更多 →</router-link>
            </div>
            <section id="course" class="section-card">
              <div class="grid-layout">
                <a
                  v-for="(c, i) in course"
                  :key="i"
                  :href="c.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="item-card-small"
                >
                  <img :src="c.icon" :alt="c.name" class="item-icon-small" />
                  <div class="item-content-small">
                    <h3 class="item-name-small">{{ c.name }}</h3>
                    <p class="item-desc-small">{{ c.desc }}</p>
                  </div>
                </a>
              </div>
            </section>
          </div>

          <!-- 项目情况 -->
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title-text">项目情况</h2>
              <a href="/projects" class="more-btn-small">更多 →</a>
            </div>
            <section id="projects" class="section-card">
              <div class="grid-layout">
                <a
                  v-for="(p, i) in homeProjects"
                  :key="i"
                  :href="p.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="item-card-small"
                >
                  <img :src="p.icon" :alt="p.name" class="item-icon-small" />
                  <div class="item-content-small">
                    <h3 class="item-name-small">{{ p.name }}</h3>
                    <p class="item-desc-small">{{ p.desc }}</p>
                  </div>
                </a>
              </div>
            </section>
          </div>

          <!-- 审核状态（仅管理员可见）-->
          <div v-if="isAdmin" class="section-container">
            <div class="section-header">
              <h2 class="section-title-text text-red">审核状态</h2>
              <a href="#" class="more-btn-small">更多 →</a>
            </div>
            <section id="review" class="section-card">
              <div class="grid-layout">
                <a
                  v-for="(item, i) in reviewItems"
                  :key="i"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="item-card-small"
                >
                  <img :src="item.icon" :alt="item.name" class="item-icon-small" />
                  <div class="item-content-small">
                    <h3 class="item-name-small">{{ item.name }}</h3>
                    <p class="item-desc-small">{{ item.desc }}</p>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import logoImg from '@/assets/logo.png'

const store = useStore()
const router = useRouter()

// ========== 从 Vuex Store 获取状态 ==========
const isLoggedIn = computed(() => store.getters.isLoggedIn)
const isAdmin = computed(() => store.getters.isAdmin)
const userInitial = computed(() => store.getters.getUserInitial)

// 首页状态
const homeActiveSection = computed(() => store.getters.homeActiveSection)
const isSidebarCollapsed = computed(() => store.getters.isSidebarCollapsed)
const showAddMenu = computed(() => store.getters.showAddMenu)
const dropdownOpen = computed(() => store.getters.dropdownOpen)
const engineMenuOpen = computed(() => store.getters.engineMenuOpen)
const searchEngine = computed(() => store.getters.searchEngine)
const searchInput = computed({
  get: () => store.getters.searchInput,
  set: (value) => store.commit('setSearchInput', value)
})
const today = computed(() => store.getters.today)
const weekday = computed(() => store.getters.weekday)
const currentTime = computed(() => store.getters.currentTime)

// 首页数据
const commonSites = computed(() => store.getters.commonSites)
const homeTools = computed(() => store.getters.homeTools)
const course = computed(() => store.getters.course)
const homeProjects = computed(() => store.getters.homeProjects)
const reviewItems = computed(() => store.getters.reviewItems)
const visibleSidebarItems = computed(() => store.getters.visibleSidebarItems)
const engines = computed(() => store.getters.engines)
const currentEngineName = computed(() => store.getters.currentEngineName)

// ========== 互动背景相关代码（保留在组件内）==========
const mainWrapper = ref(null)
const interactiveBg = ref(null)
const particleRefs = ref([])

// 鼠标状态
const mousePos = ref({ x: 0, y: 0 })
const highlightSize = ref(0)
const highlightOpacity = ref(0)
const isMouseActive = ref(false)
const lastMouseMoveTime = ref(Date.now())

// 增强的粒子系统
const particles = ref([])
const connections = ref([])
const mouseTrails = ref([])
const animationId = ref(null)
const frameCount = ref(0)

// 粒子类型配置
const particleTypes = [
  { class: 'type-1', baseSize: 8, count: 20, opacity: 0.7, speed: 0.4 },
  { class: 'type-2', baseSize: 6, count: 15, opacity: 0.6, speed: 0.3 },
  { class: 'type-3', baseSize: 12, count: 10, opacity: 0.8, speed: 0.5 },
  { class: 'type-4', baseSize: 4, count: 25, opacity: 0.4, speed: 0.2 },
  { class: 'type-5', baseSize: 10, count: 8, opacity: 0.9, speed: 0.6 }
]

const addMenuOptions = [
  { name: '我的博客', icon: 'fa-blog' },
  { name: '音乐', icon: 'fa-music' },
  { name: 'AI工具', icon: 'fa-robot' },
  { name: 'ChatGPT', icon: 'fa-brain' }
]

const isCustomItemAdded = (name, icon) => {
  return visibleSidebarItems.value.some(item =>
    item.custom && item.name === name && item.icon === icon
  )
}

const getCustomItemId = (name, icon) => {
  const item = visibleSidebarItems.value.find(item =>
    item.custom && item.name === name && item.icon === icon
  )
  return item ? item.id : null
}

const handleAddMenuClick = (option) => {
  const isAlreadyAdded = isCustomItemAdded(option.name, option.icon);

  if (isAlreadyAdded) {
    // 如果已添加，则移除
    const itemId = getCustomItemId(option.name, option.icon);
    if (itemId) {
      store.dispatch('removeCustomNavigation', itemId);
      showToast('导航已移除');
    }
  } else {
    // 如果未添加，则添加
    store.dispatch('addCustomNavigation', {
      name: option.name,
      icon: option.icon
    });
    showToast('导航已添加');
  }

  // 关闭菜单
  store.commit('setHomeMenuState', { menu: 'add', isOpen: false });
}

// 系统配置
const systemConfig = ref({
  particleCount: 78,
  connectionDistance: 150,
  trailLifetime: 40,
  maxTrails: 15,
  mouseInfluenceRadius: 200,
  performanceMode: false
})

// 初始化粒子
const initParticles = () => {
  particles.value = []
  let id = 0

  particleTypes.forEach(type => {
    for (let i = 0; i < type.count; i++) {
      const size = type.baseSize + Math.random() * 8
      particles.value.push({
        id: id++,
        type: type.class,
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        size: size,
        baseSize: type.baseSize,
        opacity: type.opacity + Math.random() * 0.2 - 0.1,
        speedX: (Math.random() - 0.5) * type.speed,
        speedY: (Math.random() - 0.5) * type.speed,
        waveOffset: Math.random() * Math.PI * 2,
        waveAmplitude: Math.random() * 3 + 1,
        waveSpeed: Math.random() * 0.03 + 0.01,
        originalX: Math.random() * (window.innerWidth || 1200),
        originalY: Math.random() * (window.innerHeight || 800),
        filter: 'none',
        life: 1
      })
    }
  })
}

// 更新粒子位置和状态
const updateParticles = () => {
  const time = Date.now() * 0.001
  frameCount.value++

  // 使用 for 循环而不是 forEach，以便可以安全地跳过不存在的粒子
  for (let i = 0; i < particles.value.length; i++) {
    const particle = particles.value[i]

    // 确保粒子对象存在
    if (!particle) continue

    // 直接使用粒子对象的属性，无需中间变量
    // 波浪运动
    const waveX = Math.sin(time * particle.waveSpeed + particle.waveOffset) * particle.waveAmplitude
    const waveY = Math.cos(time * particle.waveSpeed + particle.waveOffset) * particle.waveAmplitude

    // 基础移动
    particle.x += particle.speedX + waveX * 0.1
    particle.y += particle.speedY + waveY * 0.1

    // 边界处理（包裹效果）
    const maxWidth = window.innerWidth || 1200
    const maxHeight = window.innerHeight || 800

    if (particle.x < -particle.size) particle.x = maxWidth + particle.size
    if (particle.x > maxWidth + particle.size) particle.x = -particle.size
    if (particle.y < -particle.size) particle.y = maxHeight + particle.size
    if (particle.y > maxHeight + particle.size) particle.y = -particle.size

    // 鼠标互动
    if (isMouseActive.value) {
      const dx = mousePos.value.x - particle.x
      const dy = mousePos.value.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < systemConfig.value.mouseInfluenceRadius) {
        const force = 1 - distance / systemConfig.value.mouseInfluenceRadius
        const angle = Math.atan2(dy, dx)

        // 靠近鼠标
        if (distance < 80) {
          // 排斥力
          particle.x -= Math.cos(angle) * force * 4
          particle.y -= Math.sin(angle) * force * 4
        } else {
          // 吸引力
          particle.x += Math.cos(angle) * force * 1.5
          particle.y += Math.sin(angle) * force * 1.5
        }

        // 鼠标附近的粒子更亮
        particle.opacity = Math.min(0.9, particle.opacity + force * 0.1)
        particle.size = particle.baseSize * (1 + force * 0.3)
      } else {
        // 逐渐恢复
        particle.opacity = Math.max(0.4, particle.opacity - 0.01)
        particle.size = particle.baseSize
      }
    }

    // 轻微的生命周期呼吸效果
    particle.life = 0.7 + Math.sin(time * 0.5 + particle.id) * 0.3
  }

  // 更新连接线
  updateConnections()

  // 更新鼠标轨迹
  updateMouseTrails()
}

// 更新粒子间的连接线
const updateConnections = () => {
  connections.value = []
  const maxConnections = Math.min(30, particles.value.length * 2)
  let connectionId = 0

  // 检查粒子间的距离并创建连接线
  for (let i = 0; i < particles.value.length && connections.value.length < maxConnections; i++) {
    for (let j = i + 1; j < particles.value.length && connections.value.length < maxConnections; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]

      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < systemConfig.value.connectionDistance && distance > 20) {
        const opacity = 0.3 * (1 - distance / systemConfig.value.connectionDistance)

        connections.value.push({
          id: connectionId++,
          x: p1.x + p1.size / 2,
          y: p1.y + p1.size / 2,
          length: distance,
          angle: Math.atan2(dy, dx),
          opacity: opacity,
          width: 1 + opacity * 2
        })
      }
    }
  }
}

// 更新鼠标轨迹
const updateMouseTrails = () => {
  // 添加新的轨迹点（每3帧添加一个）
  if (frameCount.value % 3 === 0 && isMouseActive.value) {
    const trailLifetime = systemConfig.value.trailLifetime || 40

    mouseTrails.value.push({
      id: Date.now() + Math.random(),
      x: mousePos.value.x || 0,
      y: mousePos.value.y || 0,
      size: Math.random() * 6 + 4,
      opacity: 0.5,
      life: trailLifetime // 初始生命周期
    })

    // 限制轨迹点数量
    const maxTrails = systemConfig.value.maxTrails || 15
    if (mouseTrails.value.length > maxTrails) {
      mouseTrails.value.shift()
    }
  }

  // 更新现有轨迹点
  const trailLifetime = systemConfig.value.trailLifetime || 40

  // 使用 for 循环而不是 forEach，以便在删除时正确处理索引
  for (let i = mouseTrails.value.length - 1; i >= 0; i--) {
    const trail = mouseTrails.value[i]

    if (!trail) continue

    // 确保 life 属性存在
    if (typeof trail.life === 'undefined') {
      trail.life = trailLifetime
    }

    trail.life--
    trail.opacity = (trail.life / trailLifetime) * 0.5

    if (trail.life <= 0) {
      mouseTrails.value.splice(i, 1)
    }
  }
}

// 动画循环
const animate = () => {
  // 更新粒子系统
  updateParticles()

  // 更新高亮效果
  updateHighlightEffect()

  // 继续动画
  animationId.value = requestAnimationFrame(animate)
}

// 更新高亮效果
const updateHighlightEffect = () => {
  const now = Date.now()
  const timeSinceLastMove = now - lastMouseMoveTime.value

  if (timeSinceLastMove > 3000 && highlightOpacity.value > 0) {
    highlightOpacity.value = Math.max(0, highlightOpacity.value - 0.02)
    highlightSize.value = Math.max(0, highlightSize.value - 2)
  } else if (timeSinceLastMove < 3000 && highlightOpacity.value < 0.7) {
    highlightOpacity.value = Math.min(0.7, highlightOpacity.value + 0.03)
    highlightSize.value = Math.min(180, highlightSize.value + 3)
  }
}

// 鼠标移动处理
const handleMouseMove = (event) => {
  if (!mainWrapper.value) return

  const rect = mainWrapper.value.getBoundingClientRect()

  // 确保 mousePos.value 存在
  if (!mousePos.value) {
    mousePos.value = { x: 0, y: 0 }
  }

  mousePos.value.x = event.clientX - rect.left
  mousePos.value.y = event.clientY - rect.top
  lastMouseMoveTime.value = Date.now()
  isMouseActive.value = true
}

// 鼠标离开处理
const handleMouseLeave = () => {
  isMouseActive.value = false
}

// 窗口大小变化处理
const handleResize = () => {
  const maxWidth = window.innerWidth || 1200
  const maxHeight = window.innerHeight || 800

  // 调整粒子位置，防止超出范围
  particles.value.forEach(particle => {
    if (particle.x > maxWidth + 100) particle.x = Math.random() * maxWidth
    if (particle.y > maxHeight + 100) particle.y = Math.random() * maxHeight
  })
}

// 增强的搜索框聚焦效果
const handleSearchFocus = () => {
  // 粒子脉冲效果
  particles.value.forEach(particle => {
    const originalSize = particle.size
    particle.size = originalSize * 1.3

    // 颜色增强
    particle.filter = 'brightness(1.5)'

    setTimeout(() => {
      particle.size = originalSize
      particle.filter = 'none'
    }, 800)
  })
}

// ========== 使用 Vuex Actions 的函数 ==========
// 侧边栏折叠
const toggleSidebar = () => {
  store.commit('setSidebarCollapsed', !isSidebarCollapsed.value)
}

// 菜单切换
const toggleAddMenu = () => {
  store.commit('setHomeMenuState', { menu: 'add', isOpen: !showAddMenu.value })
}

const toggleDropdown = () => {
  store.commit('setHomeMenuState', { menu: 'dropdown', isOpen: !dropdownOpen.value })
}

const toggleEngineMenu = () => {
  store.commit('setHomeMenuState', { menu: 'engine', isOpen: !engineMenuOpen.value })
}

// 选择引擎
const selectEngine = (value) => {
  store.dispatch('selectSearchEngine', value)
}

// 执行搜索
const doSearch = () => {
  store.dispatch('doSearch')

  // 搜索后的粒子效果
  particles.value.forEach((p, index) => {
    if (!p || !mousePos.value) return

    // 解构现有属性，使用默认值
    const {
      x = 0,
      y = 0,
      speedX = 0,
      speedY = 0
    } = p || {}

    const dx = x - (mousePos.value.x || 0)
    const dy = y - (mousePos.value.y || 0)
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return // 避免除以零

    const force = 1 / (distance / 100 + 1)

    // 更新粒子对象的属性
    const newSpeedX = speedX + (dx / distance) * force * 5
    const newSpeedY = speedY + (dy / distance) * force * 5

    // 更新原对象
    particles.value[index].speedX = newSpeedX
    particles.value[index].speedY = newSpeedY

    // 恢复速度
    setTimeout(() => {
      particles.value[index].speedX *= 0.8
      particles.value[index].speedY *= 0.8
    }, 500)
  })
}

// 处理导航项点击
const handleNavItem = (item) => {
  store.dispatch('handleNavItem', { item, router })
}

const showToast = (message) => {
  // 这里可以添加您的toast提示逻辑
  console.log(message)
}

// 关闭所有菜单
const closeMenus = (e) => {
  if (!e.target.closest('.avatar-btn') &&
    !e.target.closest('.add-item') &&
    !e.target.closest('.engine-wrapper')) {
    store.dispatch('closeAllMenus')
  }
}

watch([showAddMenu, dropdownOpen, engineMenuOpen], ([addOpen, dropdownOpenVal, engineOpen]) => {
  // 如果其他菜单打开，关闭添加菜单
  if (!addOpen && (dropdownOpenVal || engineOpen)) {
    // 什么都不做，让其他菜单保持打开
  }
})

onMounted(async () => {
  // 等待DOM完全加载
  await nextTick()

  // 初始化时间
  await store.dispatch('updateTime')
  const timer = setInterval(() => store.dispatch('updateTime'), 1000)

  // 初始化认证状态
  await store.dispatch('initAuth')

  document.addEventListener('click', closeMenus)

  // 初始化增强的粒子系统
  initParticles()

  // 确保容器存在
  if (mainWrapper.value && interactiveBg.value) {
    // 初始化鼠标位置
    if (!mousePos.value) {
      mousePos.value = { x: 0, y: 0 }
    }
    mousePos.value.x = window.innerWidth / 2
    mousePos.value.y = window.innerHeight / 2

    // 开始动画
    animate()

    // 添加事件监听
    window.addEventListener('resize', handleResize)
  }

  // 清理函数
  onUnmounted(() => {
    clearInterval(timer)
    document.removeEventListener('click', closeMenus)

    // 清理互动背景
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }

    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style lang="scss" scoped>
@import '../assets/css/home';
</style>

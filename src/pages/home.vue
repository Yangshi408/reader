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
        <!-- 还原 w-64 (256px) 和 w-20 (80px) 的初始大小 -->
        <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'expanded': !isCollapsed }">
          <div class="sidebar-header">
            <img v-if="!isCollapsed" :src="logoImg" alt="Logo" class="sidebar-logo"/>
            <button @click="isCollapsed = !isCollapsed" class="toggle-btn">
              <i :class="['fas', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
            </button>
          </div>
          <nav class="nav-list">
            <div
              v-for="item in visibleSidebarItems"
              :key="item.id"
              :class="['nav-item', { active: activeSection === item.id }]"
              @click="handleNavItem(item)"
            >
              <i :class="['fas nav-icon', item.icon, !isCollapsed ? 'with-margin' : '']"></i>
              <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
            </div>
            <!-- 添加自定义导航 -->
            <div
              v-if="!isCollapsed"
              class="nav-item add-item"
              @click.stop="showAddMenu = !showAddMenu"
            >
              <i class="fas fa-plus nav-icon"></i>
              <span class="nav-text with-margin">添加导航</span>
              <div v-if="showAddMenu" class="add-menu">
                <div @click="addCustom('我的博客', 'fa-blog')">我的博客</div>
                <div @click="addCustom('音乐', 'fa-music')">音乐</div>
                <div @click="addCustom('AI工具', 'fa-robot')">AI工具</div>
                <div @click="addCustom('ChatGPT', 'fa-brain')">ChatGPT</div>
              </div>
            </div>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <main :class="['main-content', isCollapsed ? 'no-margin' : 'with-margin']">
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
              <!-- 左侧：日期 (还原 text-5xl 和 text-2xl) -->
              <div class="data-wrapper">
                <div class="date-big">{{ today }}</div>
                <div class="date-small">{{ weekday }}</div>
              </div>

              <!-- 中间：搜索栏 -->
              <div class="search-bar">
                <div class="engine-wrapper">
                  <div class="engine-trigger" @click.stop="engineMenuOpen = !engineMenuOpen">
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
                  placeholder="输入想要搜索的内容..."
                  class="search-input"
                />
                <button @click="doSearch" class="search-btn">搜索</button>
              </div>

              <!-- 右侧：时间 (还原 text-6xl) -->
              <div class="time-wrapper">
                <!-- 头像 -->
                <div class="avatar-container">
                  <button @click.stop="dropdownOpen = !dropdownOpen" class="avatar-btn">
                    <span :class="['avatar-initial', user.isLogin ? 'login-avatar' : 'guest-avatar']">
                      {{ userInitial }}
                    </span>
                  </button>
                  <div v-if="dropdownOpen" class="dropdown-menu">
                    <a href="/profile" class="dropdown-item login-option">个人主页</a>
                    <a v-if="user.isLogin" href="/logout" class="dropdown-item login-option">退出登陆</a>
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
              <a href="#" class="more-btn-small">更多 →</a>
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
                  v-for="(tool, i) in tools"
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
                  v-for="(p, i) in projects"
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
          <div v-if="user.role === 'admin'" class="section-container">
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
import { ref, computed, onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import logoImg from '@/assets/logo.png'

const router = useRouter()

const user = ref({
  isLogin: true,
  role: 'admin',
  nickName: '',
  avatar: ''
})

const activeSection = ref('common')
const isCollapsed = ref(false)
const showAddMenu = ref(false)
const dropdownOpen = ref(false)
const engineMenuOpen = ref(false)

const searchEngine = ref('https://www.baidu.com/s?wd=')
const searchInput = ref('')

const today = ref('')
const weekday = ref('')
const currentTime = ref('')
const bgUrl = ref('')

const sidebarItems = ref([
  { id: 'common', name: '常用', icon: 'fa-star' },
  { id: 'tools', name: '精选工具', icon: 'fa-tools' },
  { id: 'course', name: '课程浏览', icon: 'fa-book-open' },
  { id: 'projects', name: '项目情况', icon: 'fa-project-diagram' },
  { id: 'audit', name: '审核中心', icon: 'fa-gavel', adminOnly: true, route: '/check/audit' },
  // { id: 'review', name: '审核状态', icon: 'fa-shield-alt', adminOnly: true }
])

const visibleSidebarItems = computed(() =>
  sidebarItems.value.filter(item => !item.adminOnly || user.value.role === 'admin')
)

const userInitial = computed(() => user.value.isLogin ? (user.value.nickName?.[0] || '我') : '访')

function handleNavItem(item) {
  if (item.route) {
    router.push(item.route)
    return
  }
  scrollToSection(item.id)
}

const engines = [
  { name: '百度', value: 'https://www.baidu.com/s?wd=' },
  { name: '搜狗', value: 'https://www.sogou.com/web?query=' },
  { name: 'Google', value: 'https://www.google.com/search?q=' },
  { name: 'Bing', value: 'https://cn.bing.com/search?q=' },
  { name: '知乎', value: 'https://www.zhihu.com/search?q=' },
  { name: '本站', value: '/search?q=' }
]

const currentEngineName = computed(() => {
  const engine = engines.find(e => e.value === searchEngine.value)
  return engine ? engine.name : '百度'
})
// ========== 互动背景相关代码 ==========

const mainWrapper = ref(null)
const interactiveBg = ref(null)
const particleRefs = ref([])

// 鼠标状态
const mousePos = reactive({ x: 0, y: 0 })
const highlightSize = ref(0)
const highlightOpacity = ref(0)
const isMouseActive = ref(false)
const lastMouseMoveTime = ref(Date.now())

// 增强的粒子系统
const particles = ref([])
const connections = ref([]) // 连接线
const mouseTrails = ref([]) // 鼠标轨迹
const animationId = ref(null)
const frameCount = ref(0)

// 粒子类型配置 - 增加更多类型和数量
const particleTypes = [
  { class: 'type-1', baseSize: 8, count: 20, opacity: 0.7, speed: 0.4 }, // 主粒子
  { class: 'type-2', baseSize: 6, count: 15, opacity: 0.6, speed: 0.3 }, // 次级粒子
  { class: 'type-3', baseSize: 12, count: 10, opacity: 0.8, speed: 0.5 }, // 大粒子
  { class: 'type-4', baseSize: 4, count: 25, opacity: 0.4, speed: 0.2 }, // 微粒子
  { class: 'type-5', baseSize: 10, count: 8, opacity: 0.9, speed: 0.6 } // 特殊粒子
]

// 系统配置
const systemConfig = reactive({
  particleCount: 78, // 总粒子数
  connectionDistance: 150, // 连接线最大距离
  trailLifetime: 40, // 轨迹点生存时间（帧）
  maxTrails: 15, // 最大轨迹点数
  mouseInfluenceRadius: 200, // 鼠标影响半径
  performanceMode: false // 性能模式
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
        originalX: 0,
        originalY: 0,
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

  // 更新每个粒子
  particles.value.forEach(particle => {
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
      const dx = mousePos.x - particle.x
      const dy = mousePos.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < systemConfig.mouseInfluenceRadius) {
        const force = 1 - distance / systemConfig.mouseInfluenceRadius
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
  })

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

      if (distance < systemConfig.connectionDistance && distance > 20) {
        const opacity = 0.3 * (1 - distance / systemConfig.connectionDistance)

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
    mouseTrails.value.push({
      id: Date.now() + Math.random(),
      x: mousePos.x,
      y: mousePos.y,
      size: Math.random() * 6 + 4,
      opacity: 0.5,
      life: systemConfig.trailLifetime
    })

    // 限制轨迹点数量
    if (mouseTrails.value.length > systemConfig.maxTrails) {
      mouseTrails.value.shift()
    }
  }

  // 更新现有轨迹点
  mouseTrails.value.forEach((trail, index) => {
    trail.life--
    trail.opacity = trail.life / systemConfig.trailLifetime * 0.5

    if (trail.life <= 0) {
      mouseTrails.value.splice(index, 1)
    }
  })
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
  mousePos.x = event.clientX - rect.left
  mousePos.y = event.clientY - rect.top
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

// 增强的搜索效果
const enhancedDoSearch = () => {
  const q = searchInput.value.trim()
  if (q) {
    // 粒子爆炸效果
    particles.value.forEach(particle => {
      const dx = particle.x - mousePos.x
      const dy = particle.y - mousePos.y
      const distance = Math.sqrt(dx * dy)
      const force = 1 / (distance / 100 + 1)

      particle.speedX += (dx / distance) * force * 5 || 0
      particle.speedY += (dy / distance) * force * 5 || 0

      // 恢复速度
      setTimeout(() => {
        particle.speedX *= 0.8
        particle.speedY *= 0.8
      }, 500)
    })

    window.open(searchEngine.value + encodeURIComponent(q), '_blank')
    searchInput.value = ''
  }
}
// 选择引擎的方法
const selectEngine = (value) => {
  searchEngine.value = value
  engineMenuOpen.value = false
}

const commonSites = [
  { name: '微信文件', url: 'https://file.fengfengzhidao.com', icon: 'https://file.fengfengzhidao.com/logo/wechat.png', desc: '快速传输文件到设备' },
  { name: '和风天气', url: 'https://www.qweather.com', icon: 'https://cdn.heweather.com/img/logo.png', desc: '实时天气预报服务' },
  { name: '小红书', url: 'https://www.xiaohongshu.com', icon: 'https://ci.xiaohongshu.com/logo_2023.png', desc: '生活方式分享社区' },
  { name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: 'https://www.bilibili.com/favicon.ico', desc: '视频弹幕网站' },
  { name: '知乎', url: 'https://www.zhihu.com', icon: 'https://static.zhihu.com/static/favicon.ico', desc: '高质量问答平台' },
  { name: '百度翻译', url: 'https://fanyi.baidu.com', icon: 'https://fanyi.bdstatic.com/static/translation/img/favicon.ico', desc: '多语言翻译工具' },
  { name: '淘宝', url: 'https://www.taobao.com', icon: 'https://www.taobao.com/favicon.ico', desc: '在线购物平台' },
  { name: '抖音', url: 'https://www.douyin.com', icon: 'https://lf1-cdn2-tos.bytego.com/obj/ies-fe-bee-prod/cn/fe/bee_prod_cn_bee_home_page_logo.png', desc: '短视频分享应用' },
  { name: '京东', url: 'https://www.jd.com', icon: 'https://www.jd.com/favicon.ico', desc: '电商购物网站' },
  { name: '微博', url: 'https://www.weibo.com', icon: 'https://weibo.com/favicon.ico', desc: '社交媒体平台' }
]

const tools = [
  { name: 'DeepL', url: 'https://www.deepl.com', icon: 'https://www.deepl.com/img/logo/deepl-logo-blue.svg', desc: '高精度翻译工具' },
  { name: 'SmallPDF', url: 'https://smallpdf.com', icon: 'https://smallpdf.com/images/favicon.png', desc: 'PDF 处理在线工具' },
  { name: 'Canvas', url: 'https://www.canva.com', icon: 'https://static.canva.com/static/images/favicon-96x96.png', desc: '在线设计平台' },
  { name: 'Figma', url: 'https://www.figma.com', icon: 'https://static.figma.com/uploads/logo.png', desc: 'UI/UX 设计工具' },
  { name: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/favicons/favicon.png', desc: '代码托管平台' },
  { name: 'Excalibur', url: 'https://excalidraw.com', icon: 'https://excalidraw.com/favicon.ico', desc: '手绘风格绘图' },
  { name: 'ProcessOn', url: 'https://www.processon.com', icon: 'https://www.processon.com/favicon.ico', desc: '在线流程图工具' },
  { name: 'Wormhole', url: 'https://wormhole.app', icon: 'https://wormhole.app/favicon.ico', desc: '安全文件共享' },
  { name: 'PhotoKit', url: 'https://www.photokit.com', icon: 'https://www.photokit.com/favicon.ico', desc: '在线照片编辑' },
  { name: 'VirScan', url: 'https://www.virscan.org', icon: 'https://www.virscan.org/favicon.ico', desc: '病毒扫描工具' }
]

const course = [
  { name: '慕课网', url: 'https://www.imooc.com', icon: 'https://www.imooc.com/favicon.ico', desc: 'IT技能学习平台' },
  { name: 'B站课堂', url: 'https://www.bilibili.com/cheese', icon: 'https://www.bilibili.com/favicon.ico', desc: '视频课程学习' },
  { name: 'Coursera', url: 'https://www.coursera.org', icon: 'https://www.coursera.org/favicon.ico', desc: '在线大学课程' },
  { name: '网易云课堂', url: 'https://study.163.com', icon: 'https://study.163.com/favicon.ico', desc: '职业技能培训' },
  { name: '腾讯课堂', url: 'https://ke.qq.com', icon: 'https://ke.qq.com/favicon.ico', desc: '在线教育平台' },
  { name: '极客时间', url: 'https://time.geekbang.org', icon: 'https://time.geekbang.org/favicon.ico', desc: '技术学习社区' },
  { name: '实验楼', url: 'https://www.shiyanlou.com', icon: 'https://www.shiyanlou.com/favicon.ico', desc: '在线编程实验' },
  { name: '菜鸟教程', url: 'https://www.runoob.com', icon: 'https://www.runoob.com/favicon.ico', desc: '编程语言教程' },
  { name: 'MDN', url: 'https://developer.mozilla.org', icon: 'https://developer.mozilla.org/favicon.ico', desc: 'Web开发文档' },
  { name: 'W3School', url: 'https://www.w3school.com.cn', icon: 'https://www.w3school.com.cn/favicon.ico', desc: 'Web技术教程' }
]

const projects = [
  { name: '项目管理', url: '/admin/projects', icon: 'https://fakeicon.com/project.svg', desc: '管理所有项目' },
  { name: '任务看板', url: '/kanban', icon: 'https://fakeicon.com/kanban.svg', desc: '可视化任务跟踪' },
  { name: '代码仓库', url: '/repo', icon: 'https://fakeicon.com/repo.svg', desc: '代码存储与协作' },
  { name: '文档中心', url: '/docs', icon: 'https://fakeicon.com/docs.svg', desc: '项目文档库' },
  { name: '统计报表', url: '/report', icon: 'https://fakeicon.com/chart.svg', desc: '数据分析报告' },
  { name: '成员管理', url: '/members', icon: 'https://fakeicon.com/team.svg', desc: '团队成员设置' },
  { name: '文件共享', url: '/files', icon: 'https://fakeicon.com/folder.svg', desc: '安全文件交换' },
  { name: '会议记录', url: '/meeting', icon: 'https://fakeicon.com/note.svg', desc: '会议纪要管理' },
  { name: '反馈收集', url: '/feedback', icon: 'https://fakeicon.com/message.svg', desc: '用户反馈系统' },
  { name: '设置', url: '/settings', icon: 'https://fakeicon.com/setting.svg', desc: '项目配置中心' }
]

const reviewItems = [
  { name: '待审用户', url: '/admin/review/users', icon: 'https://fakeicon.com/review-user.svg', desc: '审核新注册用户' },
  { name: '内容审核', url: '/admin/review/content', icon: 'https://fakeicon.com/review-content.svg', desc: '检查用户上传内容' },
  { name: '举报处理', url: '/admin/review/reports', icon: 'https://fakeicon.com/report.svg', desc: '处理用户举报' },
  { name: '敏感词库', url: '/admin/review/words', icon: 'https://fakeicon.com/filter.svg', desc: '管理敏感词汇' },
  { name: '日志审计', url: '/admin/review/logs', icon: 'https://fakeicon.com/log.svg', desc: '查看系统日志' },
  { name: '封禁列表', url: '/admin/review/ban', icon: 'https://fakeicon.com/ban.svg', desc: '管理封禁用户' },
  { name: '权限调整', url: '/admin/review/roles', icon: 'https://fakeicon.com/role.svg', desc: '调整用户权限' },
  { name: '系统通知', url: '/admin/review/notice', icon: 'https://fakeicon.com/notice.svg', desc: '发送系统公告' },
  { name: '备份恢复', url: '/admin/review/backup', icon: 'https://fakeicon.com/backup.svg', desc: '数据备份与恢复' },
  { name: '安全中心', url: '/admin/review/security', icon: 'https://fakeicon.com/shield.svg', desc: '系统安全设置' }
]

const updateTime = () => {
  const d = new Date()
  today.value = d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
  weekday.value = d.toLocaleDateString('zh-CN', { weekday: 'long' })
  currentTime.value = d.toTimeString().slice(0, 8)
}

const scrollToSection = (id) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const doSearch = enhancedDoSearch

const addCustom = (name, icon) => {
  sidebarItems.value.push({ id: `custom-${Date.now()}`, name, icon, custom: true })
  showAddMenu.value = false
}

const closeMenus = (e) => {
  if (!e.target.closest('.avatar-btn') &&
    !e.target.closest('.add-item') &&
    !e.target.closest('.engine-wrapper')) {
    dropdownOpen.value = false
    showAddMenu.value = false
    engineMenuOpen.value = false
  }
}

onMounted(async () => {
  // 等待DOM完全加载
  await nextTick()

  // 初始化原有功能
  updateTime()
  const timer = setInterval(updateTime, 1000)
  bgUrl.value = `https://api.dujin.org/bing/1920.php?t=${Date.now()}`
  document.addEventListener('click', closeMenus)

  // 初始化增强的粒子系统
  initParticles()

  // 确保容器存在
  if (mainWrapper.value && interactiveBg.value) {
    // 初始化鼠标位置
    mousePos.x = window.innerWidth / 2
    mousePos.y = window.innerHeight / 2

    // 开始动画
    animate()

    // 添加事件监听
    window.addEventListener('resize', handleResize)

    // 为搜索框添加事件
    const searchInputEl = document.querySelector('.search-input')
    if (searchInputEl) {
      searchInputEl.addEventListener('focus', handleSearchFocus)
    }
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

    const searchInputEl = document.querySelector('.search-input')
    if (searchInputEl) {
      searchInputEl.removeEventListener('focus', handleSearchFocus)
    }
  })
})
</script>

<style lang="scss" scoped>
@import '../assets/css/home';
</style>

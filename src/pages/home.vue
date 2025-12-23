<template>
  <div class="min-h-screen relative">
    <div class = "main-wrapper">
      <div class="relative z-10 container mx-auto pt-8 pb-20">
        <!-- 左侧可折叠侧边栏 -->
        <aside :class="['sidebar sticky top-0 transition-all duration-400', isCollapsed ? 'w-64' : 'w-20']">
          <div class="sidebar-header">
            <h2 v-if="!isCollapsed" class="text-xs font-bold text-[#0066ff]">软工资源平台</h2>
            <button @click="isCollapsed = !isCollapsed" class="toggle-btn">
              <i :class="['fas text-xl', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
            </button>
          </div>
          <nav class="nav-list">
            <div
              v-for="item in visibleSidebarItems"
              :key="item.id"
              :class="['nav-item', { active: activeSection === item.id }]"
              @click="scrollToSection(item.id)"
            >
              <i :class="['fas text-xl', item.icon, !isCollapsed ? 'mr-4' : '']"></i>
              <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
            </div>
            <!-- 添加自定义导航 -->
            <div
              v-if="!isCollapsed"
              class="nav-item add-item relative"
              @click.stop="showAddMenu = !showAddMenu"
            >
              <i class="fas fa-plus text-xl"></i>
              <span class="nav-text ml-4">添加导航</span>
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
        <main :class="['transition-all duration-400', isCollapsed ? 'ml-0' : 'ml-4']">
          <div class="flex flex-col items-center mt-12 mb-20 space-y-8">
            <!-- 三个快捷按钮（正对搜索框上方，水平居中）-->
            <div class="item-wrapper">
              <div class="flex gap-5">
                <a href="https://www.msn.com/zh-cn/lifestyle/calendar" target="_blank" class="quick-bubble">
                  <i class="far fa-calendar-alt mr-2"></i>日历
                </a>
                <a href="https://image.baidu.com/" target="_blank" class="quick-bubble">
                  <i class="far fa-image mr-2"></i>图片搜索
                </a>
                <a href="https://www.bilibili.com/v/popular/all" target="_blank" class="quick-bubble">
                  <i class="fas fa-fire mr-2"></i>B站热点
                </a>
              </div>
            </div>
            <!-- 原来的搜索框（保持不动）-->
            <div class="search-wrapper">
              <div class="data-wrapper">
                <div class="text-5xl font-bold tracking-tighter">{{ today }}</div>
                <div class="text-2xl font-medium opacity-95">{{ weekday }}</div>
              </div>
              <div class="search-bar">
                <select v-model="searchEngine" class="engine-select">
                  <option v-for="e in engines" :key="e.value" :value="e.value">{{ e.name }}</option>
                </select>
                <input
                  v-model="searchInput"
                  @keydown.enter="doSearch"
                  placeholder="输入想要搜索的内容..."
                  class="flex-1"
                />
                <button @click="doSearch" class="search-btn">搜索</button>
              </div>
              <div class="time-wrapper">
                <div class="text-6xl font-medium leading-none mb-2">{{ currentTime }}</div>
                <div class="text-lg opacity-90">今天也要加油哦！</div>
              </div>
              <!-- 头像放在搜索栏容器内，作为主内容区的一部分 -->
              <div class="avatar-container">
                <button @click.stop="dropdownOpen = !dropdownOpen" class="avatar-btn">
                    <span :class="['avatar-initial', user.isLogin ? 'login-avatar' : 'guest-avatar']">
                      {{ userInitial }}
                    </span>
                </button>
                <div v-if="dropdownOpen" class="dropdown-menu mt-2">
                  <a v-if="user.isLogin" href="/profile" class="dropdown-item">个人主页</a>
                  <a v-if="user.isLogin" href="/logout" class="dropdown-item text-red-600">退出登录</a>
                  <a v-else href="/" class="dropdown-item login-option">点击登录</a>
                </div>
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
              <div class="grid grid-cols-5 gap-4">
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
              <div class="grid grid-cols-5 gap-4">
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
              <router-link to="/courses" class="more-btn-small">更多 →</router-link>
            </div>
            <section id="courses" class="section-card">
              <div class="grid grid-cols-5 gap-4">
                <a
                  v-for="(c, i) in courses"
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
              <a href="#" class="more-btn-small">更多 →</a>
            </div>
            <section id="projects" class="section-card">
              <div class="grid grid-cols-5 gap-4">
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
              <h2 class="section-title-text text-red-600">审核状态</h2>
              <a href="#" class="more-btn-small">更多 →</a>
            </div>
            <section id="review" class="section-card">
              <div class="grid grid-cols-5 gap-4">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
// import LoginLogo from '../components/LoginLogo.vue'

// ==================== 用户信息 ====================
const user = ref({
  isLogin: true, // 测试访客状态
  role: 'guest', // guest | user | admin
  name: '',
  avatar: ''
})

// ==================== 响应式状态 ====================
const activeSection = ref('common')
const isCollapsed = ref(false)
const showAddMenu = ref(false)
const dropdownOpen = ref(false)

const searchEngine = ref('https://www.baidu.com/s?wd=')
const searchInput = ref('')

const today = ref('')
const weekday = ref('')
const currentTime = ref('')
const bgUrl = ref('')

// ==================== 侧边栏导航 ====================
const sidebarItems = ref([
  { id: 'common', name: '常用', icon: 'fa-star' },
  { id: 'tools', name: '精选工具', icon: 'fa-tools' },
  { id: 'courses', name: '课程浏览', icon: 'fa-book-open' },
  { id: 'projects', name: '项目情况', icon: 'fa-project-diagram' },
  { id: 'review', name: '审核状态', icon: 'fa-shield-alt', adminOnly: true }
])

const visibleSidebarItems = computed(() =>
  sidebarItems.value.filter(item => !item.adminOnly || user.value.role === 'admin')
)

const userInitial = computed(() => user.value.isLogin ? (user.value.name?.[0] || '我') : '访')

// ==================== 搜索引擎 ====================
const engines = [
  { name: '百度', value: 'https://www.baidu.com/s?wd=' },
  { name: '搜狗', value: 'https://www.sogou.com/web?query=' },
  { name: 'Google', value: 'https://www.google.com/search?q=' },
  { name: 'Bing', value: 'https://cn.bing.com/search?q=' },
  { name: '知乎', value: 'https://www.zhihu.com/search?q=' },
  { name: '本站', value: '/search?q=' }
]

// ==================== 所有卡片数据（完整保留原数据）===================
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

const courses = [
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

// ==================== 方法 ====================
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

const doSearch = () => {
  const q = searchInput.value.trim()
  if (q) {
    window.open(searchEngine.value + encodeURIComponent(q), '_blank')
    searchInput.value = ''
  }
}

const addCustom = (name, icon) => {
  sidebarItems.value.push({
    id: `custom-${Date.now()}`,
    name,
    icon,
    custom: true
  })
  showAddMenu.value = false
}

// 点击页面任意位置关闭所有下拉菜单
const closeMenus = (e) => {
  if (!e.target.closest('.avatar-btn') && !e.target.closest('.add-item')) {
    dropdownOpen.value = false
    showAddMenu.value = false
  }
}

// ==================== 生命周期 ====================
let timer = null
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  bgUrl.value = `https://api.dujin.org/bing/1920.php?t=${Date.now()}`
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('click', closeMenus)
})
</script>

<style scoped>
/* 字体 + 全局变量 */
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
  margin:0;
  padding:0;
  font-family:'MiSans',sans-serif;
  background:linear-gradient(180deg, #f3f7fc 0%, #eef3f7 100%);
  height:100%;
  overflow:hidden;
  color:var(--text);
}

/* 去掉所有文字下划线 */
a, button, .dropdown-item, .nav-text,
.quick-bubble, .nav-item, .sidebar-header h2, .section-title h2,
.search-bar input, .engine-select, .search-btn, .avatar-btn, .toggle-btn,
.add-menu div, .add-item, .nav-item span {
  text-decoration: none !important;
}

.container {
  max-width:100%;
  max-height: 100%;
  margin:0 auto;
  padding:0.2rem 0;
  display:flex;
  gap:2rem;
}

/* 搜索栏 */
.search-bar:hover { box-shadow:0 12px 40px rgba(0,0,0,.16); }
.engine-select { background:transparent; border:none; font-size:1.1rem; color:var(--text); cursor:pointer; outline:none; min-width:80px; }
.search-bar input { flex:1; border:none; background:transparent; font-size:1.2rem; color:var(--text); outline:none; }
.search-bar input::placeholder { color:#a0aec0; }
.search-btn {
  height: 56px;
  padding: 0 2rem;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
  transition: all 0.3s;
}
.search-btn:hover {
  background: #0052cc;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 102, 255, 0.4);
}

.search-bar {
  width:100%;
  max-width:720px;
  height:72px;
  background:rgba(255, 255, 255, 0.7);
  backdrop-filter:blur(var(--blur));
  border-radius:40px;
  box-shadow:var(--shadow);
  display:flex;
  align-items:center;
  padding:0 2rem;
  gap:1.2rem;
  transition:all .3s;
}

.main-wrapper {
  background: linear-gradient(135deg,
  rgba(240, 249, 255, 0.95) 0%,
  rgba(203, 235, 255, 0.85) 45%,
  rgba(240, 253, 255, 0.95) 100%
  );
}

.search-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 40px;
  position: relative;
}

.data-wrapper {
  width: 100%;
  flex: 1;
  display: block;
  justify-content: left;
  text-align: right;
  margin-top: 5px;
  margin-bottom: 10px !important;
  margin-right: 30px;
}
.time-wrapper {
  width: 100%;
  flex: 1;
  display: block;
  justify-content: right;
  margin-top: 10px;
  margin-bottom: 10px !important;
  margin-left: 30px;
}

/* 头像容器 - 放在搜索栏内，作为主内容区的一部分 */
.avatar-container {
  position: absolute;
  top: -60px;
  right: 30px;
  z-index: 50;
}

/* 头像样式 */
.avatar-initial {
  display: inline-flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

/* 登录用户头像样式 */
.login-avatar {
  background: linear-gradient(135deg, #0066ff 0%, #8a2be2 100%);
  animation: loginPulse 3s infinite alternate;
}

/* 访客头像样式 */
.guest-avatar {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  animation: guestPulse 2s infinite, guestShake 5s infinite;
}

/* 头像悬停效果 */
.avatar-btn:hover .avatar-initial {
  transform: scale(1.15) rotate(12deg);
  box-shadow: 0 15px 40px rgba(0,0,0,.35);
}

/* 登录用户头像动画 */
@keyframes loginPulse {
  0% { box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4); }
  100% { box-shadow: 0 10px 40px rgba(0, 102, 255, 0.6), 0 0 20px rgba(138, 43, 226, 0.4); }
}

/* 访客头像动画 */
@keyframes guestPulse {
  0% { box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4); }
  100% { box-shadow: 0 10px 40px rgba(255, 107, 107, 0.6), 0 0 20px rgba(255, 167, 38, 0.4); }
}

@keyframes guestShake {
  0%, 90%, 100% { transform: rotate(0deg); }
  92% { transform: rotate(-5deg); }
  96% { transform: rotate(5deg); }
}

/* 头像按钮 */
.avatar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1000;
  transition: all 0.3s;
}

/* 下拉菜单 */
.dropdown-menu {
  position:absolute;
  right:0;
  top:70px;
  width:200px;
  background:white;
  border-radius:20px;
  box-shadow:var(--shadow-hover);
  overflow:hidden;
  animation:dropdownShow .25s ease-out;
  z-index:1001;
}

.dropdown-item {
  display:block;
  padding:1rem 1.5rem;
  transition:all .2s;
}

.dropdown-item:hover {
  background:#f3f4f6;
}

/* 登录选项特殊样式 */
.login-option {
  color: #0066ff;
  font-weight: 600;
  background: linear-gradient(90deg, #e6f7ff 0%, #f0f9ff 100%);
  position: relative;
  overflow: hidden;
}

.login-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  transition: all 0.6s;
}

.login-option:hover::before {
  left: 100%;
}

/* 侧边栏 */
.sidebar {
  background:var(--card);
  backdrop-filter:blur(var(--blur));
  border-radius:32px;
  padding:2rem;
  box-shadow:var(--shadow);
  height:100%;
  flex-shrink:0;
  position:sticky;
  top:0;
}
.sidebar-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:2rem;
}
.toggle-btn { background:none; border:none; font-size:1.5rem; cursor:pointer; padding:.5rem; border-radius:50%; transition:all .2s; }
.toggle-btn:hover { background:#e0f2fe; }

.nav-item {
  display:flex;
  align-items:center;
  padding:1rem 1.2rem;
  border-radius:20px;
  cursor:pointer;
  transition:all .25s;
  position:relative;
  margin-bottom:.5rem;
}
.nav-item:hover, .nav-item.active {
  background:#dbeafe;
  color:var(--primary);
  font-weight:600;
}
.nav-text {
  font-size:1.1rem;
  margin-left:1rem;
}
.add-item { color:#64748b; }
.add-menu {
  position:absolute; left:100%; top:0; margin-left:12px; background:white; border-radius:20px;
  box-shadow:var(--shadow-hover); min-width:180px; overflow:hidden; z-index:100;
}
.add-menu div { padding:1rem 1.5rem; cursor:pointer; transition:all .2s; }
.add-menu div:hover { background:#f3f4f6; }

/* 主内容区 */
main {
  flex: 1;
  transition: all 0.4s;
}

/* 区块容器 */
.section-container {
  margin-bottom: 2rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

/* 区块标题栏 - 在卡片外面 */
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
  transition: all .4s cubic-bezier(.34,1.56,.64,1);
  width: 100%;
  height: auto;
}

.section-card:hover {
  transform:translateY(-8px);
  box-shadow:var(--shadow-hover);
}

.grid {
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:1.2rem;
}

/* 小尺寸卡片项 */
.item-card-small {
  display:flex;
  align-items:center;
  gap:0.8rem;
  background:rgba(255,255,255,.8);
  border-radius:16px;
  padding:0.8rem;
  box-shadow:0 4px 16px rgba(0,0,0,.08);
  transition:all .3s;
  cursor:pointer;
}
.item-card-small:hover {
  background:rgba(255,255,255,1);
  transform:translateY(-3px);
  box-shadow:0 8px 20px rgba(0,0,0,.15);
}

.item-icon-small {
  width:42px;
  height:42px;
  border-radius:12px;
  object-fit:contain;
  box-shadow:0 3px 8px rgba(0,0,0,.1);
}

.item-content-small {
  flex: 1;
  min-width: 0;
}

.item-name-small {
  font-size:0.95rem;
  font-weight:600;
  color:var(--text);
  margin-bottom:.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc-small {
  font-size:.75rem;
  color:var(--text-light);
  line-height:1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 40px auto 0 auto;
  padding-left: 40px;
  display: flex;
  justify-content: flex-start;
}

.item-wrapper .flex {
  display: flex;
  gap: 10px;
}

/* 快捷气泡 */
.quick-bubble {
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.25s;
  backdrop-filter: blur(8px);
}
.quick-bubble:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* 动画 */
@keyframes dropdownShow {
  from { opacity:0; transform:translateY(-12px); }
  to   { opacity:1; transform:translateY(0); }
}

/* 响应式 */
@media (max-width:1280px) { .grid { grid-template-columns:repeat(4,1fr); } }
@media (max-width:1024px) {
  .container { flex-direction:column; }
  .grid { grid-template-columns:repeat(3,1fr); }
  .sidebar { width:100px; margin-bottom:1rem; z-index: 10;}
  .avatar-container {
    right: 10px;
  }
  .section-container {
    width: 90%;
  }
}
</style>

<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
    <div class="flex items-center gap-2 text-sm text-gray-500 px-1">
      <span
        class="hover:text-blue-600 cursor-pointer flex items-center gap-1 transition-colors"
        @click="goBack"
      >
        <i class="fas fa-arrow-left"></i> 返回列表
      </span>
      <span class="text-gray-300">/</span>
      <span class="text-gray-800 font-medium">课程详情</span>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <div class="flex items-start gap-6 md:gap-8">
        <div
          class="w-48 shrink-0 flex flex-col gap-4 items-center"
          style="width: 144px"
        >
          <div class="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-gray-100 relative group">
            <img
              :src="courseInfo.cover || 'https://via.placeholder.com/300x400?text=Course'"
              alt="Course Cover"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
          </div>

          <button
            @click="toggleLike"
            class="group relative w-auto min-w-[110px] px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out active:scale-95 flex items-center justify-center gap-2 border"
            :class="[
              isLiked
                ? 'bg-red-50 border-red-200 text-red-500 shadow-inner'
                : 'bg-white border-gray-200 text-gray-600 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5'
            ]"
          >
            <i
              class="text-base transition-transform duration-300"
              :class="[
                isLiked
                  ? 'fas fa-heart scale-110 drop-shadow-sm'
                  : 'far fa-heart group-hover:scale-110'
              ]"
            ></i>
            <span>{{ isLiked ? '已收藏' : '收藏' }}</span>
          </button>
        </div>

        <div class="flex-1 min-w-0 flex flex-col">
          <div class="mb-4">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-3">
              {{ courseInfo.name }}
            </h1>

            <div class="flex flex-wrap gap-3 text-sm">
              <span class="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300">
                <i class="fas fa-user-tie mr-2 text-blue-500"></i> {{ courseInfo.teacher }}
              </span>
              <span class="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300">
                <i class="far fa-clock mr-2 text-green-500"></i> {{ courseInfo.semester }}
              </span>
              <span class="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300">
                <i class="fas fa-graduation-cap mr-2 text-orange-500"></i> {{ courseInfo.credit }} 学分
              </span>
            </div>
          </div>

          <div class="w-full h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mb-5"></div>

          <div class="flex-1">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="w-1 h-4 bg-blue-500 rounded-full"></span>
              课程简介
            </h3>
            <p class="text-gray-600 leading-7 text-justify whitespace-pre-line text-sm md:text-base">
              {{ courseInfo.description || '暂无简介' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          相关资源链接
        </h2>
        <button
          class="group relative overflow-hidden px-6 py-2.5 bg-white text-blue-600 text-sm font-bold rounded-full shadow-lg shadow-blue-500/10 border border-blue-100 hover:border-blue-300 hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
          @click="goToUpload"
        >
          <div
            class="absolute inset-0 bg-blue-600/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"
          ></div>

          <div class="relative z-10 flex items-center gap-2">
            <i
              class="fas fa-link text-lg group-hover:-translate-y-1 group-hover:scale-110 transform transition-transform duration-300 ease-out"
            ></i>
            <span class="tracking-wide">分享链接</span>
          </div>
        </button>
      </div>

      <div class="space-y-8">
        <div v-if="resources.docs.length > 0">
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm border border-blue-100">
              <i class="fas fa-book"></i>
            </span>
            书籍文档 / 网盘
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="item in resources.docs"
              :key="item.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md bg-white hover:bg-blue-50/10 transition-all duration-300 cursor-pointer group"
              @click="openLink(item.url)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <i class="fas fa-link text-blue-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-blue-700 text-sm truncate transition-colors">
                    {{ item.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5 truncate pr-2">
                    {{ item.url }}
                  </div>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0">
                <i class="fas fa-external-link-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="resources.videos.length > 0">
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm border border-purple-100">
              <i class="fas fa-video"></i>
            </span>
            视频网课链接
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="item in resources.videos"
              :key="item.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md bg-white hover:bg-purple-50/10 transition-all duration-300 cursor-pointer group"
              @click="openLink(item.url)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <i class="fas fa-play-circle text-purple-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-purple-700 text-sm truncate transition-colors">
                    {{ item.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5 truncate pr-2">
                    {{ item.url }}
                  </div>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-purple-600 hover:bg-purple-50 transition-all shrink-0">
                <i class="fas fa-external-link-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="resources.tools.length > 0">
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm border border-green-100">
              <i class="fas fa-tools"></i>
            </span>
            相关工具 / 网址
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="item in resources.tools"
              :key="item.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md bg-white hover:bg-green-50/10 transition-all duration-300 cursor-pointer group"
              @click="openLink(item.url)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                  <i class="fas fa-globe text-green-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-green-700 text-sm truncate transition-colors">
                    {{ item.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5 truncate pr-2">
                    {{ item.url }}
                  </div>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-green-600 hover:bg-green-50 transition-all shrink-0">
                <i class="fas fa-external-link-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="!resources.docs.length && !resources.videos.length && !resources.tools.length" class="text-center py-8 text-gray-400">
             <i class="fas fa-link text-2xl mb-2 opacity-30"></i>
             <p class="text-sm">暂无相关资源链接</p>
        </div>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
          评论分享
          <span class="text-sm font-normal text-gray-400 ml-2">({{ comments.length }})</span>
        </h2>

        <div class="flex bg-gray-100 rounded-lg p-1 text-xs font-medium">
          <button
            @click="changeSort('hot')"
            class="px-3 py-1.5 rounded-md transition-all duration-300"
            :class="sortType === 'hot' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            按热度
          </button>
          <button
            @click="changeSort('time')"
            class="px-3 py-1.5 rounded-md transition-all duration-300"
            :class="sortType === 'time' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            按时间
          </button>
        </div>
      </div>

      <div class="mb-10">
        <div v-if="isAuthenticated" class="flex gap-4 items-start animate-fade-in">
          <img
            :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'"
            class="w-10 h-10 rounded-full border border-gray-200 shadow-sm shrink-0 bg-white"
          >
          <div class="flex-1">
            <div class="relative group">
              <textarea
                v-model="newComment"
                rows="3"
                placeholder="分享你的课程评价、考试经验或学习心得..."
                class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-sm text-gray-700"
              ></textarea>
              <div class="absolute bottom-3 right-3">
                 <span class="text-xs text-gray-400" :class="{ 'text-red-500': newComment.length > 300 }">
                   {{ newComment.length }}/300
                 </span>
              </div>
            </div>
            <div class="flex justify-end mt-3">
              <button
                class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                :disabled="!newComment.trim()"
                @click="submitComment"
              >
                <i class="fas fa-paper-plane"></i> 发布评论
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div class="relative z-10 flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-1">
              <i class="fas fa-lock"></i>
            </div>
            <h3 class="text-gray-800 font-bold">登录后参与讨论</h3>
            <p class="text-gray-500 text-sm max-w-sm">
              登录账号即可发布课程评价，与其他同学交流学习心得。
            </p>
            <button
              class="mt-2 px-8 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
              @click="goToLogin"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6" id="comment-list-top">
        <div
          v-for="comment in paginatedComments"
          :key="comment.id"
          class="flex gap-4 animate-fade-in group"
        >
          <img
            :src="comment.avatar"
            class="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 shrink-0 transition-transform group-hover:scale-110"
            alt="avatar"
          >

          <div class="flex-1 border-b border-gray-50 pb-6">
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-bold text-gray-800 text-sm flex items-center gap-2">
                  {{ comment.user }}
                  <span v-if="comment.isLiked" class="text-xs font-normal text-amber-500 bg-amber-50 px-1.5 rounded border border-amber-100">
                    <i class="fas fa-star text-[10px] mr-0.5"></i> 优质评论
                  </span>
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  {{ comment.time }}
                </div>
              </div>

              <button
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors group/like"
                @click="likeComment(comment.id)"
              >
                <i :class="[comment.isLiked ? 'fas text-red-500' : 'far', 'fa-thumbs-up text-sm group-hover/like:scale-125 transition-transform']"></i>
                <span>{{ comment.likes }}</span>
              </button>
            </div>

            <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <div v-if="comments.length === 0" class="text-center py-10 text-gray-400">
          <i class="far fa-comment-alt text-2xl mb-2 opacity-30"></i>
          <p class="text-sm">还没有人评论，快来抢沙发吧~</p>
        </div>

        <div v-if="comments.length > 0 && totalPages > 1" class="flex justify-center items-center gap-2 pt-4">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
            :class="currentPage === page ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'"
          >
            {{ page }}
          </button>

          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api/index'

const router = useRouter()
const route = useRoute()
const store = useStore()

// 用户状态
const isAuthenticated = computed(() => store.getters.isLoggedIn)
const userInfo = computed(() => store.getters.userInfo)

const goToLogin = () => {
  router.push({ name: 'Login', query: { redirect: route.fullPath } })
}

// 状态
const isLiked = ref(false)
const sortType = ref('hot')
const newComment = ref('')
const currentPage = ref(1)
const pageSize = 5

// 数据容器
const courseInfo = ref({
  id: '',
  name: '',
  teacher: '',
  semester: '',
  credit: '',
  cover: '',
  description: ''
})

const resources = ref({
  docs: [],
  videos: [],
  tools: []
})

const comments = ref([])

// 4. 数据获取逻辑
const fetchData = async () => {
  const courseId = route.params.id
  if (!courseId) {
    ElMessage.error('参数错误：缺少课程ID')
    return
  }

  try {
    // 4.1 获取详情
    const detailRes = await HttpManager.getCourseDetail(courseId).catch(() => null)
    if (detailRes && (detailRes.data || detailRes.id)) {
      const d = detailRes.data || detailRes
      courseInfo.value = {
        id: d.id,
        name: d.name || d.courseName,
        teacher: d.teacher,
        semester: d.semester,
        credit: d.credit,
        cover: d.cover || 'https://via.placeholder.com/600x450/3b82f6/ffffff?text=Course',
        description: d.description || d.intro || '暂无简介',
        isLiked: d.isLiked || false
      }
      isLiked.value = !!d.isLiked
    }

    // 4.2 获取资源并分类 (重点修改部分)
    const resRes = await HttpManager.getCourseResources(courseId).catch(() => [])
    const resList = Array.isArray(resRes) ? resRes : (resRes.data || [])
    
    // 重置资源
    resources.value = { docs: [], videos: [], tools: [] }

    resList.forEach(item => {
      // 核心修改：只关注 type，不关注后缀
      const type = (item.type || 'tool').toLowerCase()
      
      const resItem = {
        id: item.id,
        title: item.name || item.title || '未命名资源',
        url: item.url || item.link || '', // 确保有 URL
        // 移除 size，改用链接展示
      }

      if (type === 'video') {
        resources.value.videos.push(resItem)
      } else if (type === 'doc') {
        resources.value.docs.push(resItem)
      } else {
        resources.value.tools.push(resItem)
      }
    })

    // 4.3 获取评论
    const comRes = await HttpManager.getCourseComments(courseId).catch(() => [])
    const comList = Array.isArray(comRes) ? comRes : (comRes.data || [])
    comments.value = comList.map(item => ({
      id: item.id,
      user: item.user_name || item.userName || '用户',
      avatar: item.user_avatar || item.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      time: item.create_time ? new Date(item.create_time).toLocaleDateString() : '最近',
      content: item.content,
      likes: item.likes || 0,
      isLiked: item.isLiked || false
    }))

  } catch (error) {
    console.error('Fetch Data Error:', error)
    ElMessage.error('加载数据失败，请刷新重试')
  }
}

// 5. 计算属性
const sortedAllComments = computed(() => {
  const list = [...comments.value]
  if (sortType.value === 'hot') {
    return list.sort((a, b) => b.likes - a.likes)
  } else {
    return list.sort((a, b) => new Date(b.time) - new Date(a.time))
  }
})

const totalPages = computed(() => Math.ceil(sortedAllComments.value.length / pageSize) || 1)

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedAllComments.value.slice(start, end)
})

// 6. 方法
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  document.getElementById('comment-list-top')?.scrollIntoView({ behavior: 'smooth' })
}

const changeSort = (type) => {
  sortType.value = type
  currentPage.value = 1
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'CourseList' })
  }
}

const toggleLike = async () => {
  if (!isAuthenticated.value) return ElMessage.warning('请先登录')
  try {
    await HttpManager.toggleCourseLike(courseInfo.value.id)
    isLiked.value = !isLiked.value
    if (isLiked.value) {
      ElMessage.success('课程已加入收藏夹')
    } else {
      ElMessage.info('已取消收藏')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const likeComment = async (commentId) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  const comment = comments.value.find(c => c.id === commentId)
  if (!comment) return
  const originalLiked = comment.isLiked
  const originalLikes = comment.likes
  if (comment.isLiked) {
    comment.likes--
    comment.isLiked = false
  } else {
    comment.likes++
    comment.isLiked = true
  }
  try {
    await HttpManager.toggleCourseCommentLike(courseInfo.value.id, commentId)
  } catch (error) {
    comment.likes = originalLikes
    comment.isLiked = originalLiked
    ElMessage.error('操作失败')
  }
}

// 修改：打开链接方法
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  } else {
    ElMessage.info('暂无链接')
  }
}

const goToUpload = () => {
  router.push({
    name: 'CourseSubmit',
    query: {
      courseId: courseInfo.value.id || route.params.id,
      courseName: courseInfo.value.name
    }
  })
}

const submitComment = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  try {
    await HttpManager.addCourseComment(courseInfo.value.id || route.params.id, {
      content: newComment.value
    })
    ElMessage.success('评论发布成功！')
    newComment.value = ''
    currentPage.value = 1
    const comRes = await HttpManager.getCourseComments(courseInfo.value.id || route.params.id)
    const comList = Array.isArray(comRes) ? comRes : (comRes.data || [])
    comments.value = comList.map(item => ({
      id: item.id,
      user: item.user_name || item.userName || userInfo.value.nickname,
      avatar: item.user_avatar || item.userAvatar || userInfo.value.avatar,
      time: '刚刚',
      content: item.content,
      likes: 0,
      isLiked: false
    }))
  } catch (error) {
    console.error(error)
    ElMessage.error('评论发布失败')
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  fetchData()
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/index';

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-grid-pattern {
  background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
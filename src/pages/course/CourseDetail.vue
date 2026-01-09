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
              :src="courseInfo.cover"
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
              {{ courseInfo.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          相关资料
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
              class="fas fa-cloud-upload-alt text-lg group-hover:-translate-y-1 group-hover:scale-110 transform transition-transform duration-300 ease-out"
            ></i>
            <span class="tracking-wide">资料上传</span>
          </div>
        </button>
      </div>

      <div class="space-y-8">
        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm border border-blue-100">
              <i class="fas fa-book"></i>
            </span>
            书籍文档
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="book in resources.docs"
              :key="book.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md bg-white hover:bg-blue-50/10 transition-all duration-300 cursor-pointer group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <i class="far fa-file-pdf text-red-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-blue-700 text-sm truncate transition-colors">
                    {{ book.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5">
                    {{ book.size }}
                  </div>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0">
                <i class="fas fa-download text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm border border-purple-100">
              <i class="fas fa-video"></i>
            </span>
            视频网课
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="video in resources.videos"
              :key="video.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md bg-white hover:bg-purple-50/10 transition-all duration-300 cursor-pointer group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <i class="fab fa-youtube text-red-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-purple-700 text-sm truncate transition-colors">
                    {{ video.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5">
                    {{ video.source }}
                  </div>
                </div>
              </div>
              <i class="fas fa-external-link-alt text-xs text-gray-300 group-hover:text-purple-500 transition-colors shrink-0"></i>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm border border-green-100">
              <i class="fas fa-tools"></i>
            </span>
            相关工具
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="tool in resources.tools"
              :key="tool.id"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md bg-white hover:bg-green-50/10 transition-all duration-300 cursor-pointer group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <i class="fas fa-cube text-gray-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-gray-700 font-medium group-hover:text-green-700 text-sm truncate transition-colors">
                    {{ tool.name }}
                  </div>
                </div>
              </div>
              <span class="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 shrink-0 font-medium">
                {{ tool.tag }}
              </span>
            </div>
          </div>
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

const router = useRouter()
const route = useRoute()
const store = useStore()

// 1. 用户状态
const isAuthenticated = computed(() => store.getters.isLoggedIn)
const userInfo = computed(() => store.getters.userInfo)

const goToLogin = () => {
  router.push({ name: 'Login', query: { redirect: route.fullPath } })
}

// 2. 状态管理
const isLiked = ref(false)
const sortType = ref('hot')
const newComment = ref('')

// 分页状态 (新增)
const currentPage = ref(1)
const pageSize = 5

// 3. Mock 数据
const courseInfo = ref({
  name: '面向对象程序设计',
  teacher: '张伟',
  semester: '大二上学期',
  credit: '4.0',
  cover: 'https://placehold.co/600x450/3b82f6/ffffff?text=C%2B%2B',
  description: '本课程旨在深入讲解面向对象编程（OOP）的核心思想。通过 C++ 语言，学生将学习封装、继承、多态三大特性，并掌握 STL 标准模板库的使用。\n\n课程难点在于虚函数表的理解以及内存管理。建议同学们提前预习指针相关知识，并在实验课中多动手调试代码。'
})

const resources = ref({
  docs: [
    { id: 1, title: 'C++ Primer Plus 重点章节笔记.pdf', size: '12MB' },
    { id: 2, title: '2023年期末考试押题卷.pdf', size: '2.4MB' },
    { id: 3, title: '实验报告通用模版.docx', size: '0.5MB' }
  ],
  videos: [
    { id: 101, title: 'B站 - 侯捷 C++内存管理', source: '哔哩哔哩', url: '#' },
    { id: 102, title: 'MOOC - 程序设计基础进阶', source: '中国大学MOOC', url: '#' }
  ],
  tools: [
    { id: 201, name: 'Visual Studio Code', tag: '编辑器' },
    { id: 202, name: 'CLion (JetBrains)', tag: 'IDE' }
  ]
})

// 增加 Mock 评论以展示分页效果
const comments = ref([
  { id: 1, user: '秃头学长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', time: '2023-12-20', content: '这门课的作业量真的很大！建议大家从期中就开始构思大作业。', likes: 124, isLiked: false },
  { id: 2, user: '萌新小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', time: '2024-01-05', content: '求问各位学长学姐，期末考试重点考不考 STL 源码分析呀？', likes: 5, isLiked: false },
  { id: 3, user: 'CodeMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', time: '2023-11-15', content: '推荐大家去看《Effective C++》，配合这门课食用效果更佳。', likes: 45, isLiked: true },
  { id: 4, user: '路人甲', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', time: '2023-10-01', content: '老师讲得很好，但是语速有点快，建议录音回去复习。', likes: 12, isLiked: false },
  { id: 5, user: 'C++之神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=God', time: '2023-09-20', content: '其实这门课只要掌握了多态的底层原理，其他都很简单。', likes: 88, isLiked: false },
  { id: 6, user: '补考战士', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cry', time: '2024-02-10', content: '我又来重修了...大家一定要好好做实验啊！', likes: 2, isLiked: false },
  { id: 7, user: '学霸君', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Smart', time: '2023-12-30', content: '期末复习资料我已经上传到资源区了，大家自取。', likes: 200, isLiked: true },
  { id: 8, user: '潜水员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fish', time: '2023-11-05', content: '冒个泡，这门课给分怎么样？', likes: 0, isLiked: false }
])

// 4. 计算属性
// 先排序
const sortedAllComments = computed(() => {
  const list = [...comments.value]
  if (sortType.value === 'hot') {
    return list.sort((a, b) => b.likes - a.likes)
  } else {
    return list.sort((a, b) => new Date(b.time) - new Date(a.time))
  }
})

// 再分页 (新增)
const totalPages = computed(() => Math.ceil(sortedAllComments.value.length / pageSize))

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedAllComments.value.slice(start, end)
})

// 5. 方法
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // 切换页面时，平滑滚动到评论列表顶部
  // 实际使用时可以定位到 id="comment-list-top"
}

const changeSort = (type) => {
  sortType.value = type
  currentPage.value = 1 // 切换排序重置页码
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'CourseList' })
  }
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    ElMessage.success('课程已加入收藏夹')
  } else {
    ElMessage.info('已取消收藏')
  }
}

const likeComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    if (comment.isLiked) {
      comment.likes--
      comment.isLiked = false
    } else {
      comment.likes++
      comment.isLiked = true
    }
  }
}

const goToUpload = () => {
  const currentCourseId = '123'
  router.push({
    name: 'CourseSubmit',
    query: {
      courseId: currentCourseId,
      courseName: courseInfo.value.name
    }
  })
}

const submitComment = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  const mockNewComment = {
    id: Date.now(),
    user: userInfo.value.nickname || userInfo.value.username || '我',
    avatar: userInfo.value.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    time: new Date().toLocaleDateString(),
    content: newComment.value,
    likes: 0,
    isLiked: false
  }

  comments.value.unshift(mockNewComment)
  newComment.value = ''
  currentPage.value = 1 // 发布评论后跳回第一页
  ElMessage.success('评论发布成功！')
}

onMounted(() => {
  window.scrollTo(0, 0)
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

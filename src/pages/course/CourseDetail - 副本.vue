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
      <div class="flex flex-col md:flex-row gap-8">

        <div class="w-full md:w-72 shrink-0 flex flex-col gap-4">
          <div class="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner border border-gray-100 relative group">
            <img
              :src="courseInfo.cover"
              alt="Course Cover"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
          </div>

          <button
            @click="toggleLike"
            class="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            :class="isLiked
              ? 'bg-red-50 text-red-500 border border-red-100'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
          >
            <i :class="[isLiked ? 'fas' : 'far', 'fa-heart']"></i>
            {{ isLiked ? '已收藏' : '加入收藏' }}
          </button>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="mb-4">
            <h1 class="text-3xl font-bold text-gray-800 tracking-tight mb-2">{{ courseInfo.name }}</h1>
            <div class="flex flex-wrap gap-3 text-sm">
              <span class="flex items-center text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                <i class="fas fa-user-tie mr-2 text-blue-500"></i> {{ courseInfo.teacher }}
              </span>
              <span class="flex items-center text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                <i class="far fa-clock mr-2 text-green-500"></i> {{ courseInfo.semester }}
              </span>
              <span class="flex items-center text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                <i class="fas fa-graduation-cap mr-2 text-orange-500"></i> {{ courseInfo.credit }} 学分
              </span>
            </div>
          </div>

          <div class="w-full h-px bg-gray-100 mb-5"></div>

          <div class="flex-1">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">课程简介</h3>
            <p class="text-gray-600 leading-7 text-justify whitespace-pre-line">
              {{ courseInfo.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
        相关资料
      </h2>

      <div class="space-y-8">
        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
              <i class="fas fa-book"></i>
            </span>
            书籍文档
          </h3>
          <div class="grid gap-3">
            <div v-for="book in resources.docs" :key="book.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow-sm bg-white hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-3">
                <i class="far fa-file-pdf text-red-500 text-lg"></i>
                <span class="text-gray-700 font-medium group-hover:text-blue-700">{{ book.title }}</span>
                <span class="text-xs text-gray-400 bg-gray-50 px-1.5 rounded">{{ book.size }}</span>
              </div>
              <button class="text-gray-400 hover:text-blue-600 px-2 transition-colors">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
              <i class="fas fa-video"></i>
            </span>
            视频网课
          </h3>
          <div class="grid gap-3">
             <div v-for="video in resources.videos" :key="video.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-purple-300 hover:shadow-sm bg-white hover:bg-purple-50/30 transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-3">
                <i class="fab fa-youtube text-red-500 text-lg"></i>
                <span class="text-gray-700 font-medium group-hover:text-purple-700">{{ video.title }}</span>
                <span class="text-xs text-gray-400">by {{ video.source }}</span>
              </div>
              <i class="fas fa-external-link-alt text-xs text-gray-300 group-hover:text-purple-500"></i>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
             <span class="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs">
              <i class="fas fa-tools"></i>
            </span>
            相关工具
          </h3>
          <div class="grid gap-3">
             <div v-for="tool in resources.tools" :key="tool.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white hover:bg-green-50/30 transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-cube text-gray-500 text-lg"></i>
                <span class="text-gray-700 font-medium group-hover:text-green-700">{{ tool.name }}</span>
              </div>
              <span class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                {{ tool.tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-sm border border-white/50">
      <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          评论分享
          <span class="text-sm font-normal text-gray-400 ml-2">({{ comments.length }})</span>
        </h2>

        <div class="flex bg-gray-100 rounded-lg p-1 text-xs font-medium">
          <button
            @click="sortType = 'hot'"
            class="px-3 py-1.5 rounded-md transition-all"
            :class="sortType === 'hot' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            按热度
          </button>
          <button
            @click="sortType = 'time'"
            class="px-3 py-1.5 rounded-md transition-all"
            :class="sortType === 'time' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            按时间
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div v-for="comment in sortedComments" :key="comment.id" class="flex gap-4 animate-fade-in">
          <img :src="comment.avatar" class="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 shrink-0">

          <div class="flex-1 border-b border-gray-50 pb-6">
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-bold text-gray-800 text-sm">{{ comment.user }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ comment.time }}</div>
              </div>

              <button
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors group"
                @click="likeComment(comment.id)"
              >
                <i :class="[comment.isLiked ? 'fas text-red-500' : 'far', 'fa-thumbs-up text-sm group-hover:scale-110 transition-transform']"></i>
                <span>{{ comment.likes }}</span>
              </button>
            </div>

            <p class="text-gray-600 text-sm leading-relaxed">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <div class="text-center pt-2">
          <button class="text-gray-400 text-sm hover:text-blue-600 transition-colors">
            查看更多评论 <i class="fas fa-chevron-down ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
// const route = useRoute() // 移除未使用的 route

// 1. 状态管理
const isLiked = ref(false)
const sortType = ref('hot') // 'hot' | 'time'

// 2. Mock 数据
// 注意：图片使用了占位图服务，实际开发请替换为真实资源
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

const comments = ref([
  { id: 1, user: '秃头学长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', time: '2023-12-20', content: '这门课的作业量真的很大！尤其是大作业，建议大家从期中就开始构思，不然期末会通宵写代码。老师人很好，给分比较公正。', likes: 124, isLiked: false },
  { id: 2, user: '萌新小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', time: '2024-01-05', content: '求问各位学长学姐，期末考试重点考不考 STL 源码分析呀？我看 PPT 上讲了很多。', likes: 5, isLiked: false },
  { id: 3, user: 'CodeMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', time: '2023-11-15', content: '推荐大家去看《Effective C++》，配合这门课食用效果更佳。', likes: 45, isLiked: true }
])

// 3. 计算属性：排序逻辑
const sortedComments = computed(() => {
  const list = [...comments.value]
  if (sortType.value === 'hot') {
    return list.sort((a, b) => b.likes - a.likes)
  } else {
    // 简单模拟时间排序，实际应比较时间戳
    return list.sort((a, b) => new Date(b.time) - new Date(a.time))
  }
})

// 4. 方法
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

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
@import '../../index.css';

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

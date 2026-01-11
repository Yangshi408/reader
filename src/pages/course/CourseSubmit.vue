<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
    <div class="flex items-center gap-2 text-sm text-gray-500 px-1">
      <span
        class="hover:text-blue-600 cursor-pointer flex items-center gap-1 transition-colors"
        @click="goBack"
      >
        <i class="fas fa-arrow-left"></i> 返回详情
      </span>
      <span class="text-gray-300">/</span>
      <span class="text-gray-800 font-medium">资料上传</span>
    </div>

    <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-sm border border-white/50 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none"></div>

      <div class="relative z-10">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">分享优质资源</h1>
        <p class="text-gray-500 text-sm mb-8">感谢您的贡献！您的分享将帮助更多同学掌握这门课程。</p>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">所属课程</label>
            <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm flex items-center gap-2">
              <i class="fas fa-book-open text-blue-500"></i>
              {{ formData.courseName || '未指定课程' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">资源类型</label>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="type in resourceTypes"
                :key="type.value"
                @click="formData.type = type.value"
                class="cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200"
                :class="formData.type === type.value ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'"
              >
                <i :class="[type.icon, 'text-xl']"></i>
                <span class="text-sm font-medium">{{ type.label }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">资源链接 / 网盘地址</label>
            <div class="relative">
              <i class="fas fa-link absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="formData.link"
                type="text"
                placeholder="请输入 http:// 或 https:// 开头的链接"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">资源描述</label>
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="请简要描述资源内容，如：20xx期末复习重点、算法PPT等..."
              class="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none"
            ></textarea>
          </div>

          <div class="pt-4 flex gap-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              {{ isSubmitting ? '提交中...' : '确认提交' }}
            </button>
            <button
              type="button"
              @click="goBack"
              class="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-all"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api/index'

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)

const formData = reactive({
  courseName: '',
  courseId: '',
  type: 'doc',
  link: '',
  description: ''
})

const resourceTypes = [
  { label: '文档资料', value: 'doc', icon: 'far fa-file-alt' },
  { label: '视频网课', value: 'video', icon: 'fas fa-video' },
  { label: '辅助工具', value: 'tool', icon: 'fas fa-tools' }
]

onMounted(() => {
  const { courseName, courseId } = route.query
  // 仅当有参数时才填充
  if (courseId) {
    formData.courseName = courseName || '未知课程'
    formData.courseId = courseId
  } else {
    ElMessage.warning('参数缺失：未指定课程')
  }
})

const goBack = () => {
  router.back()
}

// 提交
const handleSubmit = async () => {
  if (!formData.courseId) {
    ElMessage.error('无法提交：缺失课程ID')
    return
  }
  if (!formData.link) {
    ElMessage.error('请输入资源链接')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 调用接口
    await HttpManager.addCourseResource({
      courseId: formData.courseId,
      type: formData.type,
      url: formData.link, // 前端是 link，后端通常叫 url
      description: formData.description,
      // 如果后端必填 name，可以用描述的前20个字代替，或者前端增加 name 输入框
      name: formData.description ? formData.description.slice(0, 20) : '新分享资源'
    })

    ElMessage.success('提交成功，感谢您的分享！')
    
    // 延迟跳转，提升体验
    setTimeout(() => {
      goBack()
    }, 1000)
    
  } catch (error) {
    console.error(error)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/index.css';

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
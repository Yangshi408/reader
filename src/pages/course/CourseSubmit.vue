<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500 mb-6">
      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
        <i class="fas fa-exclamation-circle"></i> 投稿须知
      </h3>
      <div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-sm">
        <p class="font-medium mb-1">课程投稿要求：</p>
        <ul class="list-disc ml-5 space-y-1">
          <li>课程内容需为原创或获得合法授权。</li>
          <li>课程介绍需客观真实，符合平台定位。</li>
          <li>课程链接必须有效且无恶意内容。</li>
          <li><span class="text-green-600 font-bold">点击一键填写后调用LLM对课程进行分析，自动填充信息。</span></li>
        </ul>
      </div>
    </div>

    <div class="flex gap-6 items-start">
      <!-- 左侧表单 -->
      <div class="flex-1 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/60">
        <!-- 课程封面 -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程封面:</label>
          <div class="relative">
            <div class="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 group overflow-hidden">
              <img v-if="form.cover" :src="form.cover" class="w-full h-full object-cover">
              <div v-else class="text-center">
                <i class="fas fa-camera text-4xl text-gray-400 group-hover:text-gray-600 mb-2"></i>
                <p class="text-gray-500">上传课程封面</p>
                <p class="text-xs text-gray-400 mt-1">建议尺寸：1200×600px</p>
              </div>
              <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleCoverUpload">
            </div>
          </div>
        </div>

        <!-- 课程名称 -->
        <div class="mb-4">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程名称</label>
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 ring-green-100 transition-all">
            <i class="fas fa-book text-gray-400"></i>
            <input v-model="form.name" type="text" placeholder="请输入课程名称" class="bg-transparent border-none outline-none flex-1 text-gray-700 font-medium">
          </div>
        </div>

        <!-- 课程链接 -->
        <div class="mb-4 relative">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程链接</label>
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 ring-green-100 transition-all">
            <i class="fas fa-link text-gray-400"></i>
            <input v-model="form.url" type="text" placeholder="https://example.com/course" class="bg-transparent border-none outline-none flex-1 text-gray-700">
          </div>
          <button
            @click="handleAutoFill"
            :disabled="isAnalyzing"
            class="absolute right-1 top-8 bottom-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i v-if="isAnalyzing" class="fas fa-spinner fa-spin"></i>
            {{ isAnalyzing ? '分析中...' : '一键填写' }}
          </button>
        </div>

        <!-- 课程简介 -->
        <div class="mb-4">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程简介</label>
          <div class="flex gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-green-500 transition-all">
            <i class="fas fa-info-circle text-gray-400 mt-1"></i>
            <div class="flex-1">
              <input v-model="form.description" type="text" placeholder="一句话介绍课程" class="w-full bg-transparent border-none outline-none text-gray-700 mb-1">
              <div class="text-right text-xs text-gray-400">{{ form.description.length }}/100</div>
            </div>
          </div>
        </div>

        <!-- 课程详情 -->
        <div class="mb-4">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程详情</label>
          <textarea v-model="form.fullDescription" placeholder="详细介绍课程内容、特色、适合人群等..."
                    class="w-full h-48 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-green-500 outline-none resize-none text-gray-700"></textarea>
        </div>

        <!-- 课程大纲 -->
        <div class="mb-4">
          <label class="block text-sm font-bold text-gray-700 mb-2">课程大纲</label>
          <div class="space-y-3">
            <div v-for="(chapter, index) in syllabus" :key="index" class="flex items-center gap-3">
              <input v-model="chapter.title" placeholder="章节标题"
                     class="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:border-green-500 outline-none text-sm">
              <input v-model="chapter.duration" placeholder="时长"
                     class="w-24 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:border-green-500 outline-none text-sm">
              <button @click="removeChapter(index)" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button @click="addChapter" class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-2">
              <i class="fas fa-plus"></i> 添加章节
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="w-80 flex-shrink-0">
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 sticky top-24 flex flex-col h-[42rem]">
          <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="fas fa-cog"></i> 课程选项
          </h4>

          <!-- 可滚动区域 -->
          <div class="flex-1 overflow-y-auto pr-1 space-y-4">
            <!-- 分类 -->
            <div>
              <label class="text-xs text-gray-500 mb-1 block">课程分类</label>
              <div class="relative">
                <select v-model="form.semester" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:border-blue-500 text-sm">
                  <option value="" disabled selected>选择学期</option>
                  <option v-for="semester in ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下']"
                          :key="semester" :value="semester">
                    {{ semester }}
                  </option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-400 text-xs pointer-events-none"></i>
              </div>
            </div>

            <!-- 难度等级 -->
            <div>
              <label class="text-xs text-gray-500 mb-2 block">难度等级</label>
              <div class="flex flex-wrap gap-2">
                <label v-for="level in ['入门', '初级', '中级', '高级']" :key="level" class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.level" :value="level" class="accent-green-600">
                  <span class="text-sm">{{ level }}</span>
                </label>
              </div>
            </div>

            <!-- 课程类型 -->
            <div>
              <label class="text-xs text-gray-500 mb-2 block">课程类型</label>
              <div class="flex flex-wrap gap-2">
                <label v-for="type in ['视频课程', '图文教程', '直播课', '专栏']" :key="type" class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.type" :value="type" class="accent-green-600">
                  <span class="text-sm">{{ type }}</span>
                </label>
              </div>
            </div>

            <!-- 价格设置 -->
            <div>
              <label class="text-xs text-gray-500 mb-2 block">课程价格</label>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.isFree" :value="true" class="accent-green-600">
                  <span class="text-sm">免费</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.isFree" :value="false" class="accent-green-600">
                  <span class="text-sm">付费</span>
                </label>
              </div>
              <input v-if="!form.isFree" v-model.number="form.price" type="number" min="0" placeholder="价格（元）"
                     class="w-full mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm">
            </div>

            <!-- 标签选择 -->
            <div>
              <label class="text-xs text-gray-500 mb-2 block">标签选择（至少选择一个）</label>

              <!-- 标签搜索 -->
              <div class="mb-3">
                <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <i class="fas fa-search text-gray-400 text-xs"></i>
                  <input
                    v-model="tagSearch"
                    type="text"
                    placeholder="搜索标签..."
                    class="bg-transparent border-none outline-none flex-1 text-xs placeholder-gray-400"
                  >
                </div>
              </div>

              <!-- 标签区域 -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="max-h-64 overflow-y-auto p-3">
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="tag in filteredTags"
                      :key="tag.id"
                      :class="[
                        'cursor-pointer transition-all duration-200',
                        'inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs border',
                        selectedTags.includes(tag.id)
                          ? tag.color + ' border-transparent'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      ]"
                    >
                      <input
                        type="checkbox"
                        v-model="selectedTags"
                        :value="tag.id"
                        class="sr-only"
                        @change="handleTagChange"
                      >
                      <span class="flex items-center gap-1">
                        {{ tag.name }}
                        <span v-if="tag.id === 'general'" class="text-[10px] text-gray-500">(必选)</span>
                      </span>
                      <i
                        v-if="selectedTags.includes(tag.id)"
                        class="fas fa-check text-[10px] ml-1"
                      ></i>
                    </label>
                  </div>

                  <div v-if="filteredTags.length === 0" class="text-center py-4 text-gray-400 text-xs">
                    未找到匹配的标签
                  </div>
                </div>
              </div>

              <!-- 已选标签展示 -->
              <div v-if="selectedTags.length > 0" class="mt-3">
                <div class="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <i class="fas fa-tags text-xs"></i>
                  <span>已选标签 ({{ selectedTags.length }}个)</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tagId in selectedTags"
                    :key="tagId"
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                      getTagById(tagId).color
                    ]"
                  >
                    {{ getTagById(tagId).name }}
                    <i
                      v-if="tagId !== 'general'"
                      @click="removeTag(tagId)"
                      class="fas fa-times text-[10px] cursor-pointer hover:scale-110 transition-transform"
                    ></i>
                  </span>
                </div>
              </div>

              <!-- 提示信息 -->
              <div class="mt-3 text-xs text-gray-400">
                <i class="fas fa-exclamation-circle mr-1"></i>
                请至少选择一个标签
                <div v-if="!selectedTags.includes('general')" class="text-red-500 font-medium mt-1">
                  ⚠️ 必须包含"通用"标签
                </div>
              </div>
            </div>

            <!-- 讲师信息 -->
            <div>
              <label class="text-xs text-gray-500 mb-2 block">讲师信息</label>
              <input v-model="form.teacherName" placeholder="讲师姓名"
                     class="w-full mb-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm">
              <input v-model="form.teacherTitle" placeholder="讲师头衔"
                     class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 text-sm">
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="pt-4 border-t border-gray-100">
            <button @click="submit" :disabled="isSubmitting" class="w-full bg-[#10b981] hover:bg-[#0da271] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-gray-100 disabled:shadow-none disabled:opacity-70">
              <i class="fas fa-file-export"></i> 提交审核
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCoursesStore } from '@/store/courseStore'
import { ElMessage } from 'element-plus'
import { predefinedTags } from '@/data/course/tags'
// import { storeToRefs } from 'pinia'

const coursesStore = useCoursesStore()

// const {
//   isAuthenticated
// } = storeToRefs(coursesStore)

// 响应式数据
const isAnalyzing = ref(false)
const isSubmitting = ref(false)
const tagSearch = ref('')
const selectedTags = ref(['general'])
const syllabus = ref([{ title: '', duration: '' }])

const form = reactive({
  name: '',
  url: '',
  cover: '',
  description: '',
  fullDescription: '',
  semester: '', // 改为学期
  level: '入门',
  type: '视频课程',
  isFree: true,
  price: 0,
  teacherName: '',
  teacherTitle: ''
})

// 计算属性
const filteredTags = computed(() => {
  const searchTerm = tagSearch.value.toLowerCase()
  if (searchTerm) {
    return predefinedTags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm) ||
      tag.id.toLowerCase().includes(searchTerm)
    )
  }
  const commonTags = ['general', 'beginner', 'intermediate', 'advanced', 'video', 'text', 'live', 'frontend', 'backend', 'mobile']
  return predefinedTags.filter(tag => commonTags.includes(tag.id))
})

// 方法
const getTagById = (tagId) => {
  return predefinedTags.find(tag => tag.id === tagId) || { name: tagId, color: 'bg-gray-100' }
}

const handleTagChange = () => {
  if (selectedTags.value.length === 0) {
    selectedTags.value = ['general']
    ElMessage.warning('请至少选择一个标签')
  }
}

const removeTag = (tagId) => {
  if (tagId === 'general') {
    ElMessage.warning('"通用"标签是必选项，不能移除')
    return
  }
  if (selectedTags.value.length <= 1) {
    ElMessage.warning('请至少保留一个标签')
    return
  }
  selectedTags.value = selectedTags.value.filter(id => id !== tagId)
}

const addChapter = () => {
  syllabus.value.push({ title: '', duration: '' })
}

const removeChapter = (index) => {
  if (syllabus.value.length > 1) {
    syllabus.value.splice(index, 1)
  }
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.cover = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const validateForm = () => {
  if (!form.name.trim()) {
    ElMessage.error('请输入课程名称')
    return false
  }
  if (!form.url.trim()) {
    ElMessage.error('请输入课程链接')
    return false
  }
  if (!form.category) {
    ElMessage.error('请选择课程分类')
    return false
  }
  if (selectedTags.value.length === 0) {
    ElMessage.error('请至少选择一个标签')
    return false
  }
  if (!selectedTags.value.includes('general')) {
    ElMessage.error('必须包含"通用"标签')
    return false
  }
  return true
}

const handleAutoFill = async () => {
  if (!form.url.trim()) {
    ElMessage.warning('请先填写课程链接')
    return
  }

  isAnalyzing.value = true
  try {
    const data = await coursesStore.analyzeCourseUrl(form.url)
    form.name = data.name
    form.description = data.description?.substring(0, 100) || ''
    form.fullDescription = data.description || ''
    form.cover = data.cover || ''
    form.teacherName = data.teacherName || ''
    form.teacherTitle = data.teacherTitle || ''

    if (data.syllabus && data.syllabus.length > 0) {
      syllabus.value = data.syllabus.slice(0, 5)
    }

    ElMessage.success('AI 分析完成，内容已填充')
  } catch (error) {
    ElMessage.error('分析失败，请手动填写')
  } finally {
    isAnalyzing.value = false
  }
}

const submit = async () => {
  try {
    if (!validateForm()) {
      return;
    }

    // 构建符合store期望的课程数据
    const submitData = {
      name: form.name,
      description: form.description,
      semester: form.semester, // 重要：这里使用semester字段
      cover: form.cover,
      url: form.url,
      level: form.level,
      type: form.type,
      isFree: form.isFree,
      price: form.isFree ? 0 : form.price,
      teacherName: form.teacherName,
      teacherTitle: form.teacherTitle,
      fullDescription: form.fullDescription,
      tags: selectedTags.value,
      syllabus: syllabus.value.filter(chapter => chapter.title.trim() !== '')
    };

    const response = await coursesStore.submitCourse(submitData);

    if (response.code === 200) {
      ElMessage.success('课程提交成功！已添加到课程列表');

      // 重置表单
      Object.keys(form).forEach(key => {
        if (typeof form[key] === 'boolean') {
          form[key] = key === 'isFree' ? true : form[key];
        } else {
          form[key] = '';
        }
      });
      form.level = '入门';
      form.type = '视频课程';
      form.isFree = true;
      form.price = 0;
      form.semester = ''; // 重置学期选择

      selectedTags.value = ['general'];
      tagSearch.value = '';
      syllabus.value = [{
        title: '',
        duration: ''
      }];
    }
  } catch (error) {
    ElMessage.error(error.message || '提交失败');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/courseIndex';
</style>

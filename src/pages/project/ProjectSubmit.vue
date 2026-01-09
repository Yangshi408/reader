<template>
  <div class="max-w-4xl mx-auto">
    <!-- 投稿须知 -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500 mb-6">
      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
        <i class="fas fa-exclamation-circle"></i> 项目投稿须知
      </h3>
      <div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-sm">
        <p class="font-medium mb-1">提交要求：</p>
        <ul class="list-disc ml-5 space-y-1">
          <li>请确保项目为原创或已获得授权。</li>
          <li>提供完整的项目说明和技术栈信息。</li>
          <li>鼓励开源项目，请选择合适的许可证。</li>
        </ul>
      </div>
    </div>
    <div class="flex gap-6 items-start">
      <div class="flex-1 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/60">
        <!-- 左侧表单 -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">项目封面:</label>
          <div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 group overflow-hidden relative">
            <img v-if="form.coverImage" :src="form.coverImage" alt='' class="w-full h-full object-cover">
            <i v-else class="fas fa-plus text-3xl text-gray-400 group-hover:text-gray-600"></i>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer">
          </div>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fas fa-cube text-gray-400"></i>
            <input v-model="form.name" type="text" placeholder="项目名称" class="bg-transparent border-none outline-none flex-1 text-gray-700 font-medium">
          </div>
        </div>
        <div class="mb-4 relative">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fab fa-github text-gray-400"></i>
            <input v-model="form.githubUrl" type="text" placeholder="https://github.com/username/repo" class="bg-transparent border-none outline-none flex-1 text-gray-700">
          </div>
          <button
            @click="handleAutoFill"
            :disabled="isAnalyzing"
            class="absolute right-1 top-1 bottom-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i v-if="isAnalyzing" class="fas fa-spinner fa-spin"></i>
            {{ isAnalyzing ? '分析中...' : '一键填写' }}
          </button>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fas fa-external-link-alt text-gray-400"></i>
            <input v-model="form.demoUrl" type="text" placeholder="https://demo.example.com" class="bg-transparent border-none outline-none flex-1 text-gray-700">
          </div>
        </div>
        <div class="mb-4">
          <div class="flex gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 transition-all">
            <i class="fas fa-info-circle text-gray-400 mt-1"></i>
            <div class="flex-1">
              <input v-model="form.description" type="text" placeholder="项目简介" class="w-full bg-transparent border-none outline-none text-gray-700 mb-1">
              <div class="text-right text-xs text-gray-400">{{ form.description.length }}/80</div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <textarea v-model="form.details" placeholder="项目详情..." class="w-full h-40 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-blue-500 outline-none resize-none text-gray-700"></textarea>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fas fa-code text-gray-400"></i>
            <input v-model="techInput" @keyup.enter="addTechnology" type="text"
                   placeholder="输入技术栈后按Enter添加"
                   class="bg-transparent border-none outline-none flex-1 text-gray-700">
          </div>
          <div v-if="form.technologies.length > 0" class="mt-2 flex flex-wrap gap-2">
            <span v-for="(tech, index) in form.technologies" :key="index"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {{ tech }}
              <i @click="removeTechnology(index)" class="fas fa-times cursor-pointer hover:text-red-500"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="w-80 flex-shrink-0">
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 sticky top-24 flex flex-col h-[38.2rem]">
          <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="fas fa-cog"></i> 项目选项
          </h4>

          <!-- 可滚动区域 -->
          <div class="flex-1 overflow-y-auto pr-1">
            <div class="mb-4">
              <label class="text-xs text-gray-500 mb-1 block">分类</label>
              <div class="relative">
                <select v-model="form.category" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:border-blue-500 text-sm">
                  <option value="" disabled selected>选择分类</option>
                  <option v-for="cat in ['前端项目', '后端项目', '全栈项目', '移动应用', '桌面应用', '开源工具']" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-400 text-xs pointer-events-none"></i>
              </div>
            </div>

            <div class="mb-4">
              <label class="text-xs text-gray-500 mb-1 block">许可证</label>
              <div class="relative">
                <select v-model="form.license" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:border-blue-500 text-sm">
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache License 2.0</option>
                  <option value="GPL-3.0">GNU GPL v3</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                  <option value="None">无许可证</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-400 text-xs pointer-events-none"></i>
              </div>
            </div>

            <div class="mb-4">
              <label class="text-xs text-gray-500 mb-2 block">项目状态</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.status" value="active" class="accent-blue-600">
                  <span class="text-sm">活跃中</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.status" value="archived" class="accent-blue-600">
                  <span class="text-sm">已归档</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
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

              <!-- 标签分组区域 -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="max-h-64 overflow-y-auto p-3">
                  <!-- 简化显示，不分组，只展示过滤后的标签 -->
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="tag in filteredTags"
                      :key="tag.id"
                      :class="[
                        'cursor-pointer transition-all duration-200',
                        'inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs border',
                        selectedTags.indexOf(tag.id) !== -1
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
                      </span>
                      <i
                        v-if="selectedTags.indexOf(tag.id) !== -1"
                        class="fas fa-check text-[10px] ml-1"
                      ></i>
                    </label>
                  </div>

                  <!-- 无匹配标签提示 -->
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
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="pt-4 border-t border-gray-100">
            <button @click="submit" :disabled="isSubmitting" class="w-full bg-[#bf1e2e] hover:bg-[#a01825] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-gray-100 disabled:shadow-none disabled:opacity-70">
              <i class="fas fa-file-export"></i> 提交审核
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'  // 修改：使用 Vuex
import { ElMessage } from 'element-plus'
import { projectTags } from '@/data/project/projectTags'

const store = useStore()
const isAuthenticated = computed(() => store.getters.isLoggedIn)

// 响应式数据定义
const isAnalyzing = ref(false)
const form = reactive({
  name: '',
  githubUrl: '',
  demoUrl: '',
  coverImage: '',
  description: '',
  details: '',
  category: '',
  license: 'MIT',
  status: 'active',
  technologies: []
})
const isSubmitting = ref(false)
const tagSearch = ref('')
const selectedTags = ref([])
const techInput = ref('')

// 计算属性
const filteredTags = computed(() => {
  const searchTerm = String(tagSearch.value || '').toLowerCase()

  if (searchTerm) {
    return projectTags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm) ||
      tag.id.toLowerCase().includes(searchTerm)
    )
  }

  return projectTags.slice(0, 20)
})

// 方法
const getTagById = (tagId) => {
  return projectTags.find(tag => tag.id === tagId) || { name: tagId, color: 'bg-gray-100' }
}

const handleTagChange = () => {
  if (selectedTags.value.length === 0) {
    ElMessage.warning('请至少选择一个标签')
  }
}

const removeTag = (tagId) => {
  if (selectedTags.value.length <= 1) {
    ElMessage.warning('请至少保留一个标签')
    return
  }

  selectedTags.value = selectedTags.value.filter(id => id !== tagId)
}

const addTechnology = () => {
  if ((techInput.value || '').trim() && form.technologies.indexOf((techInput.value || '').trim()) === -1) {
    form.technologies.push((techInput.value || '').trim())
    techInput.value = ''
  }
}

const removeTechnology = (index) => {
  form.technologies.splice(index, 1)
}

const validateForm = () => {
  const errors = {}
  if (!(form.name || '').trim()) errors.name = '请输入项目名称'
  if (!(form.githubUrl || '').trim()) errors.githubUrl = '请输入GitHub链接'
  if (!form.category) errors.category = '请选择分类'
  if (!(form.description || '').trim()) errors.description = '请输入项目简介'
  if (form.description.length > 80) errors.description = '简介不能超过80字'
  if (selectedTags.value.length === 0) errors.tags = '请至少选择一个标签'

  return Object.keys(errors).length === 0
}

const handleAutoFill = async () => {
  if (!(form.githubUrl || '').trim()) {
    ElMessage.warning('请先填写GitHub链接')
    return
  }

  isAnalyzing.value = true
  try {
    // 模拟AI分析
    await new Promise(resolve => setTimeout(resolve, 2000))
    form.name = String(form.githubUrl || '').split('/').pop() || '项目'
    form.description = `这是一个基于 ${form.githubUrl} 的开源项目。`
    form.technologies = ['Vue', 'JavaScript', 'Node.js']
    ElMessage.success('AI 分析完成，内容已填充')
  } catch (error) {
    ElMessage.error('分析失败')
  } finally {
    isAnalyzing.value = false
  }
}

const submit = async () => {
  try {
    if (!validateForm()) {
      ElMessage.error('请完善必填信息')
      return
    }
    if (!isAuthenticated.value) {
      ElMessage.warning('请先登录')
      return
    }
    isSubmitting.value = true

    // const submitData = {
    //   ...form,
    //   tags: [...selectedTags.value]
    // }

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success('提交成功，等待管理员审核')

    // 重置表单
    Object.keys(form).forEach(key => {
      if (key === 'license') form[key] = 'MIT'
      else if (key === 'status') form[key] = 'active'
      else if (key === 'technologies') form[key] = []
      else form[key] = ''
    })
    selectedTags.value = []
    tagSearch.value = ''
    techInput.value = ''
  } catch (error) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    isSubmitting.value = false
  }
}

// 监听器
watch(() => form.category, (newCategory) => {
  if (newCategory) {
    const categoryTagsMap = {
      前端项目: ['frontend', 'vue', 'react', 'javascript', 'html', 'css'],
      后端项目: ['backend', 'nodejs', 'python', 'java', 'spring', 'database'],
      全栈项目: ['fullstack', 'vue', 'nodejs', 'mongodb', 'express'],
      移动应用: ['mobile', 'flutter', 'react-native', 'android', 'ios'],
      桌面应用: ['desktop', 'electron', 'csharp', 'java', 'python'],
      开源工具: ['open-source', 'tool', 'cli', 'library', 'framework']
    }

    const recommended = categoryTagsMap[newCategory] || []

    recommended.forEach(tagId => {
      if (selectedTags.value.indexOf(tagId) === -1 && projectTags.some(tag => tag.id === tagId)) {
        selectedTags.value.push(tagId)
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import '../../assets/css/indexPro';
</style>

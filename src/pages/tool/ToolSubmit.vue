<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500 mb-6">
      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
        <i class="fas fa-exclamation-circle"></i> 投稿须知
      </h3>
      <div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-sm">
        <p class="font-medium mb-1">里面是提交的要求：</p>
        <ul class="list-disc ml-5 space-y-1">
          <li>请确保工具链接有效且无恶意插件。</li>
          <li>简介请客观描述，禁止广告用语。</li>
          <li>若链接正确填写，<span class="text-purple-600 font-bold">点击一键填写后调用LLM对链接对应的网站进行分析，并自动填写各项内容。</span></li>
        </ul>
      </div>
    </div>
    <div class="flex gap-6 items-start">
      <div class="flex-1 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/60">
        <!-- 左侧内容保持不变 -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">图标:</label>
          <div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 group overflow-hidden relative">
            <img v-if="form.icon" :src="form.icon" alt='' class="w-full h-full object-cover">
            <i v-else class="fas fa-plus text-3xl text-gray-400 group-hover:text-gray-600"></i>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer">
          </div>
        </div>
        <div class="mb-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fas fa-bars text-gray-400"></i>
            <input v-model="form.name" type="text" placeholder="工具名称" class="bg-transparent border-none outline-none flex-1 text-gray-700 font-medium">
          </div>
        </div>
        <div class="mb-4 relative">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
            <i class="fas fa-link text-gray-400"></i>
            <input v-model="form.url" type="text" placeholder="https://example.com" class="bg-transparent border-none outline-none flex-1 text-gray-700">
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
          <div class="flex gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 transition-all">
            <i class="fas fa-info-circle text-gray-400 mt-1"></i>
            <div class="flex-1">
               <input v-model="form.desc" type="text" placeholder="简介" class="w-full bg-transparent border-none outline-none text-gray-700 mb-1">
               <div class="text-right text-xs text-gray-400">{{ form.desc.length }}/80</div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <textarea v-model="form.fullDesc" placeholder="工具使用说明..." class="w-full h-40 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-blue-500 outline-none resize-none text-gray-700"></textarea>
        </div>
      </div>

      <!-- 右侧边栏 - 优化布局 -->
      <div class="w-80 flex-shrink-0">
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 sticky top-24 flex flex-col h-[38.2rem]">
          <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="fas fa-cog"></i> 工具选项
          </h4>

          <!-- 可滚动区域 -->
          <div class="flex-1 overflow-y-auto pr-1">
            <div class="mb-4">
              <label class="text-xs text-gray-500 mb-1 block">分类</label>
              <div class="relative">
                <select v-model="form.category" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:border-blue-500 text-sm">
                  <option value="" disabled selected>选择分类</option>
                  <option v-for="cat in ['软件开发', '项目协作', '个人提升', '论文阅读']" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-400 text-xs pointer-events-none"></i>
              </div>
            </div>

            <div class="mb-4">
              <label class="text-xs text-gray-500 mb-2 block">内/外部工具</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.type" value="internal" class="accent-blue-600">
                  <span class="text-sm">内部工具</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.type" value="external" class="accent-blue-600">
                  <span class="text-sm">外部工具</span>
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

              <!-- 标签分组区域 - 设置固定高度并允许滚动 -->
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
                        selectedTags.value.indexOf(tag.id) !== -1
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
                        v-if="selectedTags.value.indexOf(tag.id) !== -1"
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
                <div v-if="selectedTags.value.indexOf('general') === -1" class="text-red-500 font-medium mt-1">
                  ⚠️ 必须包含"通用"标签
                </div>
              </div>
            </div>
          </div>

          <!-- 提交按钮 - 固定在底部 -->
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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'  // 替换 Pinia 导入
import { ElMessage } from 'element-plus'
import { predefinedTags } from '@/data/tool/tags'
// import { HttpManager } from '@/api'

const store = useStore()

const isAuthenticated = computed(() => store.getters.isAuthenticated)

// 一、响应式数据定义
const isAnalyzing = ref(false)
const form = reactive({
  name: '',
  url: '',
  icon: '',
  desc: '',
  fullDesc: '',
  category: '',
  type: 'external'
})
const isSubmitting = ref(false)
// 标签相关状态
const tagSearch = ref('')
const selectedTags = ref(['general'])
// 表单验证
const formErrors = reactive({})

// 二、计算属性
// 1. 通过搜索过滤后的标签，未搜索时显示常用标签
const filteredTags = computed(() => {
  const searchTerm = String(tagSearch.value || '').toLowerCase()

  if (searchTerm) {
    return predefinedTags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm) ||
      tag.id.toLowerCase().includes(searchTerm)
    )
  }

  // 无搜索时，只显示常用标签
  const commonTags = ['general', 'web', 'desktop', 'mobile', 'open-source', 'free', 'paid', 'frontend', 'backend']
  return predefinedTags.filter(tag => commonTags.includes(tag.id))
})

// 三、方法
// 1. 根据标签Id获取标签（主要目的是获取标签的css样式）
const getTagById = (tagId) => {
  return predefinedTags.find(tag => tag.id === tagId) || { name: tagId, color: 'bg-gray-100' }
}
// 2. 标签选择变更时激活的函数（绑定方法）
const handleTagChange = () => {
  // 确保至少有一个标签被选中
  if (selectedTags.value.length === 0) {
    selectedTags.value = ['general']
    ElMessage.warning('请至少选择一个标签')
  }
}
// 3. 取消选择标签
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
// 4. 表单验证
const validateForm = () => {
  formErrors.name = !(form.name || '').trim() ? '请输入工具名称' : ''
  formErrors.url = !(form.url || '').trim() ? '请输入工具链接' : ''
  formErrors.category = !form.category ? '请选择分类' : ''
  formErrors.desc = !(form.desc || '').trim() ? '请输入简介' : form.desc.length > 80 ? '简介不能超过80字' : ''

  // 标签验证
  if (selectedTags.value.length === 0) {
    formErrors.tags = '请至少选择一个标签'
  } else if (selectedTags.value.indexOf('general') === -1) {
    formErrors.tags = '必须包含"通用"标签'
  } else {
    formErrors.tags = ''
  }

  return !Object.values(formErrors).some(error => error)
}
// 5. 自动填充（未实现，后续需要调用AI + 爬虫）
const handleAutoFill = async () => {
  if (!(form.url || '').trim()) {
    ElMessage.warning('请先填写链接')
    return
  }

  isAnalyzing.value = true
  try {
    // 使用 Vuex action
    const data = await store.dispatch('analyzeUrl', form.url)
    form.name = data.name
    form.desc = data.desc.substring(0, 80)
    form.fullDesc = data.desc
    form.icon = data.icon
    ElMessage.success('AI 分析完成，内容已填充')
  } catch (error) {
    ElMessage.error('分析失败')
  } finally {
    isAnalyzing.value = false
  }
}
// 6. 提交
const submit = async () => {
  try {
    if (!validateForm()) {
      ElMessage.error('请完善必填信息')
      return
    }
    if (!isAuthenticated.value) {
      throw new Error('请先登录')
    }
    isSubmitting.value = true // 开启加载状态

    // 准备数据
    const submitData = {
      ...form, // 解包获取副本，对于引用类型非常需要注意的地方（但是仅是浅拷贝，不过好在form的属性中无引用类型）
      tags: [...selectedTags.value] // 数组也是引用类型，需要解包
    }
    // 验证标签
    if (submitData.tags.length === 0) {
      throw new Error('请至少选择一个标签')
    }

    // const response = await HttpManager.submitTool(submitData)
    const response = await mockSubmitTool(submitData)

    if (response.code === 200) {
      ElMessage.success(response.message || '提交成功，等待管理员审核')

      // 重置表单
      Object.keys(form).forEach(key => {
        form[key] = ''
      })
      form.type = 'external'
      selectedTags.value = ['general']
      tagSearch.value = ''
    } else {
      ElMessage.error(response.message || '提交失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    isSubmitting.value = false
  }
}
// 为方法6模拟后端API请求使用
// const mockSubmitTool = async (submitData) => {
//   // 返回一个Promise，模拟异步请求
//   return new Promise((resolve) => {
//     // 模拟网络延迟（1.5秒）
//     setTimeout(() => {
//       // 模拟响应数据（默认成功，也可以添加随机逻辑模拟失败）
//       // 如需模拟失败，可将code改为非200，比如：{ code: 500, message: '服务器内部错误' }
//       const mockResponse = {
//         code: 200,
//         message: '提交成功，等待管理员审核'
//       }
//
//       // 【可选】添加随机成功/失败逻辑，更贴近真实场景
//       // const isSuccess = Math.random() > 0.2; // 80%成功率
//       // const mockResponse = isSuccess
//       //   ? { code: 200, message: '提交成功，等待管理员审核' }
//       //   : { code: 500, message: '模拟提交失败：服务器忙，请稍后再试' };
//
//       resolve(mockResponse)
//     }, 1500) // 1500ms = 1.5秒延迟
//   })
// }

// 四、监听器
// 1. 工具分类自动推荐标签
watch(() => form.category, (newCategory) => {
  if (newCategory) {
    // 根据分类推荐标签
    const categoryTagsMap = {
      软件开发: ['web', 'ide', 'editor', 'frontend', 'backend', 'open-source'],
      项目协作: ['web', 'team', 'productivity'],
      个人提升: ['learning', 'productivity', 'mobile'],
      论文阅读: ['research', 'academic', 'pdf']
    }

    const recommended = categoryTagsMap[newCategory] || []

    // 保留已选标签，添加推荐的标签（不重复）
    recommended.forEach(tagId => {
      if (selectedTags.value.indexOf(tagId) === -1 && predefinedTags.some(tag => tag.id === tagId)) {
        selectedTags.value.push(tagId)
      }
    })
  }
})

// 五、生命周期函数
onMounted(async () => {
  console.log('ToolSubmit 组件被创建')
})

onUnmounted(() => {
  console.log('ToolSubmit 组件被销毁')
})
</script>

<style scoped>
@import '@/assets/css/index.css';

/* ::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
} */
</style>

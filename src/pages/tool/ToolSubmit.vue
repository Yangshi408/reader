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
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">图标:</label>
          <div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 group overflow-hidden relative">
            <img v-if="form.icon" :src="form.icon" class="w-full h-full object-cover">
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
      <div class="w-80">
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 sticky top-24">
          <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="fas fa-cog"></i> 工具选项
          </h4>
          <div class="mb-4">
            <label class="text-xs text-gray-500 mb-1 block">分类</label>
            <div class="relative">
              <select v-model="form.category" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:border-blue-500">
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
          <div class="mb-6">
            <label class="text-xs text-gray-500 mb-1 block">标签</label>
            <input v-model="form.tagInput" placeholder="输入标签" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm mb-2">
            <p class="text-xs text-gray-400"><i class="fas fa-exclamation-circle"></i> 填写标签，每个标签用逗号隔开</p>
          </div>
          <button @click="submit" class="w-full bg-[#bf1e2e] hover:bg-[#a01825] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2">
            <i class="fas fa-file-export"></i> 提交审核
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 修改 ToolSubmit.vue 的 script 部分 -->
<script setup>
import { ref, reactive } from 'vue'
import { useToolsStore } from '@/store/toolsStore'
import { ElMessage } from 'element-plus'

const toolsStore = useToolsStore()
const isAnalyzing = ref(false)

const form = reactive({
  name: '',
  url: '',
  icon: '',
  desc: '',
  fullDesc: '',
  category: '',
  type: 'external',
  tagInput: ''
})

// 表单验证
const formErrors = reactive({})
// const isFormValid = computed(() => {
//   return form.name.trim() &&
//          form.url.trim() &&
//          form.category &&
//          form.desc.trim() &&
//          form.desc.length <= 80
// })

const validateForm = () => {
  formErrors.name = !form.name.trim() ? '请输入工具名称' : ''
  formErrors.url = !form.url.trim() ? '请输入工具链接' : ''
  formErrors.category = !form.category ? '请选择分类' : ''
  formErrors.desc = !form.desc.trim() ? '请输入简介' : form.desc.length > 80 ? '简介不能超过80字' : ''

  return !Object.values(formErrors).some(error => error)
}

const handleAutoFill = async () => {
  if (!form.url.trim()) {
    ElMessage.warning('请先填写链接')
    return
  }

  isAnalyzing.value = true
  try {
    const data = await toolsStore.analyzeUrl(form.url)
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

const submit = async () => {
  if (!validateForm()) {
    ElMessage.error('请完善必填信息')
    return
  }

  try {
    const result = await toolsStore.submitTool(form)

    if (result.success) {
      ElMessage.success(result.message)
      // 重置表单
      Object.keys(form).forEach(key => {
        if (key !== 'type') form[key] = ''
      })
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('提交失败')
  }
}
</script>

<style scoped>
@import '../../index.css';
</style>

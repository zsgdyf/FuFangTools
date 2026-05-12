<!--
  ShortlinkView.vue - 短链接转换器
  支持批量输入短链接，按顺序调用后端 API 还原为长链接
  具备逐条解析、加载状态、单条/批量复制等功能
-->
<template>
  <ToolLayout title="短链接转换器" description="输入一个或多个短链接，按顺序还原它们的长链接">
    <!-- 输入区域 -->
    <div class="inputs-container">
      <div class="input-group">
        <label for="short-url">短链接 (每行一个)</label>
        <textarea
          id="short-url"
          class="tool-input"
          v-model="shortUrlInput"
          placeholder="https://v.kuaishou.com/xxxxxx&#10;https://v.kuaishou.com/yyyyyy"
          rows="5"
        ></textarea>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="btn-group">
      <button class="btn-calc" :disabled="isLoading" @click="convertUrls">批量转换 ✨</button>
      <button class="btn-clear" @click="clearAll">清空 ↺</button>
    </div>

    <!-- 解析结果区域 -->
    <div v-if="showResult" class="result-section">
      <div class="result-header">
        <span>{{ resultCountText }}</span>
        <button class="copy-btn" @click="copyAll">{{ copyAllBtnText }}</button>
      </div>
      <div class="results-list">
        <div
          v-for="(res, index) in results"
          :key="index"
          :class="['result-item', res.status]"
        >
          <div class="result-item-content">
            <div class="short-origin">{{ res.original }}</div>
            <div class="long-expanded">{{ res.long }}</div>
          </div>
          <!-- 解析成功时显示单条复制按钮 -->
          <button
            v-if="res.status === 'success'"
            class="copy-btn mini-copy-btn"
            @click="copySingle(res, index)"
          >
            {{ res.copyText || '复制' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ loadingText }}</p>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

/** 输入框内容 */
const shortUrlInput = ref('')
/** 解析结果数组 */
const results = ref([])
/** 是否显示结果区域 */
const showResult = ref(false)
/** 是否正在加载 */
const isLoading = ref(false)
/** 加载提示文字 */
const loadingText = ref('正在努力解析中...')
/** 结果统计文字 */
const resultCountText = ref('解析结果')
/** "全部复制"按钮文字 */
const copyAllBtnText = ref('全部复制')

/**
 * 批量转换短链接
 * 按顺序逐条调用后端 API 解析短链接
 */
async function convertUrls () {
  const rawInput = shortUrlInput.value.trim()
  if (!rawInput) {
    alert('请输入短链接')
    return
  }

  // 按行分割并过滤空行
  const urls = rawInput.split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0)

  if (urls.length === 0) {
    alert('请输入有效的链接')
    return
  }

  // 重置 UI 状态
  showResult.value = false
  results.value = []
  isLoading.value = true

  let successCount = 0
  const tempResults = []

  // 按顺序逐条解析
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    loadingText.value = `正在解析 (${i + 1}/${urls.length})...`

    try {
      // 自动补全协议头
      const targetUrl = url.startsWith('http') ? url : `https://${url}`
      // 调用后端 API 解析短链接
      const response = await fetch(`/api/expand?url=${encodeURIComponent(targetUrl)}`)
      const data = await response.json()

      if (data.longUrl) {
        // 移除快手分享参数 ?cc=share
        let processedLongUrl = data.longUrl
        const ccShareIndex = processedLongUrl.indexOf('?cc=share')
        if (ccShareIndex !== -1) {
          processedLongUrl = processedLongUrl.substring(0, ccShareIndex)
        }
        tempResults.push({ original: url, long: processedLongUrl, status: 'success', copyText: '复制' })
        successCount++
      } else {
        tempResults.push({ original: url, long: data.error || '解析失败', status: 'error' })
      }
    } catch {
      tempResults.push({ original: url, long: '请求出错', status: 'error' })
    }
  }

  // 更新结果
  results.value = tempResults
  resultCountText.value = `解析完成 (成功: ${successCount}/${urls.length})`
  showResult.value = true
  isLoading.value = false
}

/**
 * 复制单条结果到剪贴板
 * @param {Object} res - 结果对象
 * @param {number} index - 结果索引
 */
async function copySingle (res, index) {
  try {
    await navigator.clipboard.writeText(res.long)
    // 临时修改按钮文字为"已复制"
    results.value[index].copyText = '已复制'
    setTimeout(() => {
      results.value[index].copyText = '复制'
    }, 2000)
  } catch (err) {
    console.error('无法复制:', err)
  }
}

/**
 * 复制全部结果到剪贴板
 */
async function copyAll () {
  const allTexts = results.value
    .map(r => r.long)
    .join('\n')

  if (!allTexts) {
    alert('没有可复制的结果')
    return
  }

  try {
    await navigator.clipboard.writeText(allTexts)
    copyAllBtnText.value = '已复制全部！'
    setTimeout(() => {
      copyAllBtnText.value = '全部复制'
    }, 2000)
  } catch (err) {
    console.error('无法复制:', err)
  }
}

/**
 * 清空输入和结果
 */
function clearAll () {
  shortUrlInput.value = ''
  results.value = []
  showResult.value = false
  isLoading.value = false
}
</script>

<style scoped>
@import '../styles/shortlink-converter.css';
</style>

<!--
  QrcodeView.vue - 二维码生成工具
  输入文本或网址，使用 qrcode-generator 库生成对应的二维码图片
  支持中文字符（通过 UTF-8 编码转换）
-->
<template>
  <ToolLayout title="二维码生成工具" description="输入文本，立即生成二维码">
    <!-- 输入区域 -->
    <div class="inputs-container">
      <div class="input-group">
        <label for="qr-text">文本内容</label>
        <textarea
          id="qr-text"
          class="tool-input"
          rows="4"
          placeholder="输入任何文本或网址"
          v-model="qrText"
        ></textarea>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="btn-group">
      <button class="btn-calc" @click="generateQR">立即生成 ✨</button>
      <button class="btn-clear" @click="clearAll">清空 ↺</button>
    </div>

    <!-- 二维码显示区域 -->
    <div v-show="showResult" class="result-section">
      <div class="qr-code-container" v-html="qrHtml"></div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
// 从 npm 引入二维码生成库（替代原来的 CDN 方式）
import qrcode from 'qrcode-generator'

/** 输入的文本内容 */
const qrText = ref('')
/** 生成的二维码 HTML */
const qrHtml = ref('')
/** 是否显示结果 */
const showResult = ref(false)

/**
 * 将 Unicode 字符串转换为 UTF-8 编码的字符串
 * 解决二维码库不支持直接处理中文字符的问题
 *
 * @param {string} str - 原始 Unicode 字符串
 * @returns {string} UTF-8 编码后的字符串
 */
function toUtf8String (str) {
  let out = ''
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if (c >= 0x0001 && c <= 0x007F) {
      // ASCII 范围：直接使用
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      // 三字节 UTF-8 编码（中文等）
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      // 两字节 UTF-8 编码
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

/**
 * 生成二维码
 * 使用 qrcode-generator 库创建 img 标签
 */
function generateQR () {
  const text = qrText.value.trim()
  if (!text) {
    alert('请输入文本内容')
    return
  }

  try {
    // 创建二维码对象（类型 0=自动, 纠错级别 M=中等）
    const qr = qrcode(0, 'M')
    // 添加经过 UTF-8 转换的文本数据
    qr.addData(toUtf8String(text))
    // 计算二维码矩阵
    qr.make()
    // 生成 img 标签（单元格大小 6px, 边距 8px）
    qrHtml.value = qr.createImgTag(6, 8)
    showResult.value = true
  } catch (e) {
    console.error(e)
    alert('生成失败: ' + e.message)
  }
}

/**
 * 清空输入和结果
 */
function clearAll () {
  qrText.value = ''
  qrHtml.value = ''
  showResult.value = false
}
</script>

<style scoped>
@import '../styles/qrcode-generator.css';
</style>

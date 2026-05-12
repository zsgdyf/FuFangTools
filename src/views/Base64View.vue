<!--
  Base64View.vue - Base64 编码转换工具
  提供文本和 Base64 字符串的双向转换，支持中文字符
  使用左右双栏布局，中间放置操作按钮
-->
<template>
  <ToolLayout
    title="Base64 编码转换"
    description="在线文本 Base64 加密与解密工具"
    container-class="container-wide"
  >
    <div class="converter-wrapper">
      <!-- 左栏：普通文本 -->
      <div class="input-section">
        <label for="normalText">普通文本</label>
        <textarea
          class="tool-input text-area"
          id="normalText"
          placeholder="在此输入要编码的内容..."
          v-model="normalText"
        ></textarea>
      </div>

      <!-- 中间：操作按钮 -->
      <div class="controls-section">
        <button class="btn-calc btn-action" @click="doEncode">Base64 编码 &rarr;</button>
        <button class="btn-calc btn-action" @click="doDecode">&larr; Base64 解码</button>
        <button class="btn-clear btn-action" @click="clearAll">清空 ↺</button>
      </div>

      <!-- 右栏：Base64 编码 -->
      <div class="input-section">
        <label for="base64Text">Base64 编码</label>
        <textarea
          class="tool-input text-area"
          id="base64Text"
          placeholder="在此输入 Base64 字符串..."
          v-model="base64Text"
        ></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import { encodeBase64, decodeBase64 } from '../utils/base64Helper'

/** 普通文本输入 */
const normalText = ref('')
/** Base64 编码输入 */
const base64Text = ref('')

/**
 * 执行 Base64 编码
 * 将左栏的普通文本编码后显示在右栏
 */
function doEncode () {
  try {
    base64Text.value = encodeBase64(normalText.value)
  } catch (e) {
    alert('编码失败，请检查输入内容')
    console.error(e)
  }
}

/**
 * 执行 Base64 解码
 * 将右栏的 Base64 字符串解码后显示在左栏
 */
function doDecode () {
  const text = base64Text.value.trim()
  if (!text) {
    normalText.value = ''
    return
  }

  try {
    normalText.value = decodeBase64(text)
  } catch (e) {
    alert('解码失败：无效的 Base64 字符串')
    console.error(e)
  }
}

/**
 * 清空左右两栏的内容
 */
function clearAll () {
  normalText.value = ''
  base64Text.value = ''
}
</script>

<style scoped>
@import '../styles/base64-converter.css';
</style>

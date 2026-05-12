<!--
  BmiView.vue - BMI 计算器
  输入身高和体重，计算身体质量指数
  包含可视化的 BMI 指示条和指针动画
-->
<template>
  <ToolLayout title="BMI计算器" description="输入身高和体重，计算你的身体质量指数">
    <!-- 输入区域 -->
    <div class="inputs-container bmi-inputs">
      <div class="input-group">
        <label for="height">身高 (cm)</label>
        <input
          type="number"
          id="height"
          class="tool-input"
          placeholder="例如: 175"
          v-model="height"
          @keydown.enter="weightInput?.value?.focus()"
        >
      </div>
      <div class="input-group">
        <label for="weight">体重 (kg)</label>
        <input
          ref="weightInput"
          type="number"
          id="weight"
          class="tool-input"
          placeholder="例如: 65"
          v-model="weight"
          @keydown.enter="calculateBMI(); $event.target.blur()"
        >
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="btn-group">
      <button class="btn-calc" @click="calculateBMI">开始计算 ✨</button>
      <button class="btn-clear" @click="clearAll">清空 ↺</button>
    </div>

    <!-- 计算结果区域 -->
    <div v-show="showResult" class="result-section">
      <p>你的BMI值是: <strong>{{ bmiFormatted }}</strong></p>
      <p :class="categoryClass">结果: <strong>{{ category }}</strong></p>

      <!-- BMI 指示条 -->
      <div class="bmi-indicator-bar">
        <div class="indicator-segment underweight"></div>
        <div class="indicator-segment normal"></div>
        <div class="indicator-segment overweight"></div>
        <div class="indicator-pointer" :style="{ left: pointerPercentage + '%' }">
          <div class="pointer-arrow"></div>
        </div>
      </div>

      <!-- 指示条刻度标签 -->
      <div class="indicator-labels">
        <span>18.5</span>
        <span>24.0</span>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

/** 体重输入框的 DOM 引用 */
const weightInput = ref(null)
/** 身高输入值 (cm) */
const height = ref('')
/** 体重输入值 (kg) */
const weight = ref('')
/** 是否显示结果 */
const showResult = ref(false)
/** 格式化后的 BMI 数值 */
const bmiFormatted = ref('')
/** BMI 分类描述 */
const category = ref('')
/** BMI 分类对应的 CSS 类名 */
const categoryClass = ref('')
/** 指针在指示条上的位置百分比 */
const pointerPercentage = ref(0)

// BMI 指示条映射常量
const MIN_DISPLAY_BMI = 12
const MAX_DISPLAY_BMI = 40

/**
 * 计算 BMI 值并更新 UI
 * BMI = 体重(kg) / 身高(m)²
 */
function calculateBMI () {
  const h = parseFloat(height.value)
  const w = parseFloat(weight.value)

  // 输入校验
  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return

  // 计算 BMI
  const heightInMeters = h / 100
  const bmi = w / (heightInMeters * heightInMeters)
  bmiFormatted.value = bmi.toFixed(1)

  // 判断 BMI 分类
  if (bmi < 18.5) {
    category.value = '偏瘦'
    categoryClass.value = 'underweight'
  } else if (bmi >= 18.5 && bmi < 24) {
    category.value = '正常'
    categoryClass.value = 'normal'
  } else {
    category.value = '偏胖'
    categoryClass.value = 'overweight'
  }

  // 计算指针在指示条上的位置
  // 将 BMI 值限制在显示范围内
  const displayBmi = Math.max(MIN_DISPLAY_BMI, Math.min(MAX_DISPLAY_BMI, bmi))

  if (displayBmi < 18.5) {
    // 偏瘦范围 (MIN_DISPLAY_BMI 到 18.5) 映射到 0% - 25%
    pointerPercentage.value = ((displayBmi - MIN_DISPLAY_BMI) / (18.5 - MIN_DISPLAY_BMI)) * 25
  } else if (displayBmi < 24.0) {
    // 正常范围 (18.5 到 24.0) 映射到 25% - 60%
    pointerPercentage.value = 25 + ((displayBmi - 18.5) / (24.0 - 18.5)) * 35
  } else {
    // 偏胖范围 (24.0 到 MAX_DISPLAY_BMI) 映射到 60% - 100%
    pointerPercentage.value = 60 + ((displayBmi - 24.0) / (MAX_DISPLAY_BMI - 24.0)) * 40
  }

  showResult.value = true
}

/**
 * 清空输入和结果
 */
function clearAll () {
  height.value = ''
  weight.value = ''
  showResult.value = false
  categoryClass.value = ''
}
</script>

<style scoped>
@import '../styles/bmi-calculator.css';
</style>

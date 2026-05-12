<!--
  Calc24View.vue - 24点计算器
  输入4个数字，自动计算所有能得到24的表达式
  核心算法解耦到 utils/calc24Solver.js
-->
<template>
  <ToolLayout title="24点计算器" description="输入4个数字，自动算出答案">
    <!-- 数字输入区域 -->
    <div class="inputs-container input-row">
      <input
        v-for="(_, index) in 4"
        :key="index"
        :ref="el => inputRefs[index] = el"
        type="number"
        class="tool-input"
        placeholder="?"
        autocomplete="off"
        v-model="nums[index]"
        @input="onInput(index)"
        @keydown="onKeydown($event, index)"
      >
    </div>

    <!-- 操作按钮 -->
    <div class="btn-group">
      <button class="btn-calc" @click="runSolver">开始计算 ✨</button>
      <button class="btn-clear" @click="clearAll">清空 ↺</button>
    </div>

    <!-- 计算结果区域 -->
    <div v-show="showResult" class="result-section">
      <div class="status-bar">
        <span>{{ statusText }}</span>
        <span class="count-badge">{{ solutions.length }}</span>
      </div>
      <div class="solutions-grid">
        <!-- 无解提示 -->
        <div v-if="solutions.length === 0 && hasCalculated" class="no-solution">
          🤔 这组数字无法算出 24
        </div>
        <!-- 解法卡片列表 -->
        <div
          v-for="(sol, index) in solutions"
          :key="index"
          class="card"
          :style="{ animationDelay: `${index * 0.02}s` }"
        >
          {{ sol }}
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import { solveCalc24 } from '../utils/calc24Solver'

/** 四个输入框的值 */
const nums = ref(['', '', '', ''])
/** 计算结果数组 */
const solutions = ref([])
/** 是否显示结果区域 */
const showResult = ref(false)
/** 是否已执行过计算（用于区分"还没算"和"算了但无解"） */
const hasCalculated = ref(false)
/** 状态栏文字 */
const statusText = ref('计算结果')
/** 输入框的 DOM 引用数组 */
const inputRefs = ref([])

/**
 * 输入事件处理：当输入内容达到2位数时自动跳转到下一个输入框
 * @param {number} index - 当前输入框的索引
 */
function onInput (index) {
  if (nums.value[index].length >= 2 && index < 3) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

/**
 * 键盘事件处理
 * - Enter/空格：跳转下一个输入框，最后一个输入框按 Enter 触发计算
 * - Backspace：输入框为空时跳转到上一个输入框
 * @param {KeyboardEvent} e - 键盘事件对象
 * @param {number} index - 当前输入框的索引
 */
function onKeydown (e, index) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (index < 3) {
      inputRefs.value[index + 1]?.focus()
      if (nums.value[index + 1]) {
        inputRefs.value[index + 1]?.select()
      }
    } else if (e.key === 'Enter') {
      runSolver()
      inputRefs.value[index]?.blur()
    }
  }
  if (e.key === 'Backspace' && nums.value[index] === '' && index > 0) {
    inputRefs.value[index - 1].focus()
  }
}

/**
 * 执行24点计算
 * 校验输入后调用算法模块求解
 */
function runSolver () {
  // 检查是否所有输入框都已填写
  const emptyIdx = nums.value.findIndex(n => n === '')
  if (emptyIdx !== -1) {
    inputRefs.value[emptyIdx]?.focus()
    return
  }

  // 调用算法求解
  const floatNums = nums.value.map(Number)
  const result = solveCalc24(floatNums)

  // 更新UI状态
  solutions.value = result
  hasCalculated.value = true
  showResult.value = true
  statusText.value = result.length === 0 ? '无解' : '发现解法'
}

/**
 * 清空所有输入和结果
 */
function clearAll () {
  nums.value = ['', '', '', '']
  solutions.value = []
  showResult.value = false
  hasCalculated.value = false
  statusText.value = '计算结果'
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
}
</script>

<style scoped>
@import '../styles/calc-24.css';
</style>

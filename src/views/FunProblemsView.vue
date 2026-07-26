<!--
  FunProblemsView.vue - 趣味题解与图示
  展示有趣的数学和逻辑题目与详细解析，搭配交互式动态几何可视化实验室
-->
<template>
  <ToolLayout
    title="趣味题解与图示"
    description="收录精选高深与趣味兼备的题目解答，配备交互式几何动态图示实验室"
    container-class="container-wide"
  >
    <div class="fun-problems-wrapper">
      <!-- 题目切换导航栏 -->
      <div class="problem-selector">
        <button 
          :class="['selector-tab', activeTab === 'hyperbola' ? 'active' : '']"
          @click="activeTab = 'hyperbola'"
        >
          <span>📐 【01】2022年全国乙卷理科第11题：双曲线切线</span>
        </button>
        <button 
          :class="['selector-tab', activeTab === 'kakeya' ? 'active' : '']"
          @click="activeTab = 'kakeya'"
        >
          <span>✨ 【02】二维挂谷猜想动态图示与佩龙树</span>
        </button>
        <button class="selector-tab disabled" title="更多趣味题解与动态图示正在准备中">
          <span>💡 更多经典趣味题目与动态图示</span>
          <span class="badge-coming">敬请期待</span>
        </button>
      </div>

      <!-- 动态组件展示区域 -->
      <Transition name="fade" mode="out-in">
        <component :is="currentComponent"></component>
      </Transition>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import Problem01Hyperbola from './problems/Problem01Hyperbola.vue'
import Problem02Kakeya from './problems/Problem02Kakeya.vue'

const activeTab = ref('kakeya') // 默认展示新题

const currentComponent = computed(() => {
  if (activeTab.value === 'hyperbola') return Problem01Hyperbola
  if (activeTab.value === 'kakeya') return Problem02Kakeya
  return Problem01Hyperbola
})
</script>

<style scoped>
@import '../styles/fun-problems.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

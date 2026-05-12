<!--
  ToolLayout.vue - 工具页面通用布局组件
  为所有工具页面提供统一的布局结构：
  - 返回首页的链接
  - 标题和描述
  - 通过 slot 插入工具特定的内容

  使用 scoped 样式隔离布局样式，避免与首页 CSS 冲突
  使用 :deep() 穿透选择器将共享控件样式传递给插槽内容
-->
<template>
  <div :class="['tool-container', containerClass]">
    <!-- 返回首页链接 -->
    <router-link to="/" class="back-link">← 返回工具箱</router-link>

    <!-- 页面标题区域 -->
    <header>
      <h1>{{ title }}</h1>
      <p class="desc">{{ description }}</p>
    </header>

    <!-- 工具特定内容插槽 -->
    <slot />
  </div>
</template>

<script setup>
/**
 * Props 定义
 * @param {string} title - 工具页面标题
 * @param {string} description - 工具页面描述
 * @param {string} containerClass - 额外的容器 CSS 类名（如 Base64 页面的宽布局 'container-wide'）
 */
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* ===================================
   工具页面布局样式（scoped 避免与首页冲突）
   =================================== */
.tool-container {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 550px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Base64 转换页面需要更宽的布局 */
.container-wide {
  max-width: 900px;
}

.back-link {
  display: block;
  text-align: left;
  margin-bottom: 20px;
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--primary);
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

p.desc {
  color: var(--text-light);
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .tool-container {
    padding: 25px;
  }
}

/* ===================================
   以下使用 :deep() 穿透选择器
   将共享控件样式传递给插槽（slot）内容
   因为 slot 内容属于父组件的作用域，
   scoped 样式无法直接作用于 slot 内容
   =================================== */

/* --- 通用输入框样式 --- */
:deep(.inputs-container) {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

:deep(.input-group) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.input-group label) {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 8px;
  padding-left: 4px;
}

:deep(.tool-input) {
  width: 100%;
  height: 64px;
  border: 2px solid #cbd5e1;
  border-radius: 16px;
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
  outline: none;
}

:deep(.tool-input:focus) {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

:deep(textarea.tool-input) {
  height: auto;
  padding: 16px;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
}

:deep(input[type=number]::-webkit-inner-spin-button),
:deep(input[type=number]::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* --- 按钮组样式 --- */
:deep(.btn-group) {
  display: flex;
  gap: 12px;
}

:deep(.btn-calc) {
  flex: 2;
  padding: 18px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
}

:deep(.btn-calc:hover) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

:deep(.btn-calc:active) {
  transform: scale(0.98);
}

:deep(.btn-calc:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

:deep(.btn-clear) {
  flex: 1;
  padding: 18px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.btn-clear:hover) {
  background: #e2e8f0;
  color: #334155;
  transform: translateY(-1px);
}

:deep(.btn-clear:active) {
  transform: scale(0.98);
}

/* --- 通用结果区域 --- */
:deep(.result-section) {
  margin-top: 30px;
  border-top: 2px dashed #e2e8f0;
  padding: 25px 0 0 0;
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* --- 媒体查询 --- */
@media (max-width: 480px) {
  :deep(.inputs-container) {
    flex-direction: column;
    gap: 15px;
  }
  :deep(.input-group) {
    width: 100%;
  }
  :deep(.tool-input) {
    height: 55px;
    font-size: 22px;
  }
}
</style>

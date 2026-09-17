<!--
  ToolLayout.vue - 工具页面通用布局组件
  为所有工具页面提供统一的日系无印极简布局结构：
  - 精致面包屑/返回导航
  - 沉着层次的标题和描述
  - 通过 slot 插入工具特定的内容
  - 统一沉稳内敛的输入框、按钮和结果面板规范
-->
<template>
  <div :class="['tool-container', containerClass]">
    <!-- 顶部轻量快捷返回链接 -->
    <div class="tool-nav-bar">
      <router-link to="/" class="back-link" title="返回首页">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span>返回工具箱</span>
      </router-link>
    </div>

    <!-- 页面标题区域 -->
    <header class="tool-header">
      <h1 class="tool-title">{{ title }}</h1>
      <p v-if="description" class="tool-desc">{{ description }}</p>
    </header>

    <!-- 工具特定内容插槽 -->
    <div class="tool-content">
      <slot />
    </div>
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
   工具页面极简纸质布局样式
   =================================== */
.tool-container {
  background: var(--bg-surface);
  padding: 32px 36px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 580px;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

/* 宽屏工具自适应（如 Base64 转换、趣味题解等） */
.container-wide {
  max-width: 960px;
}

/* 顶部轻量返回链接 */
.tool-nav-bar {
  margin-bottom: 20px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.86rem;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.back-link:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

/* 标题区域 */
.tool-header {
  text-align: left;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-color);
}

.tool-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.tool-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .tool-container {
    padding: 22px 18px;
    border-radius: var(--radius-md);
  }

  .tool-header {
    margin-bottom: 22px;
    padding-bottom: 14px;
  }

  .tool-title {
    font-size: 1.35rem;
  }

  .tool-desc {
    font-size: 0.85rem;
  }
}

/* ===================================
   穿透选择器：共享输入框、按钮与结果面板样式
   =================================== */

/* --- 通用输入框样式 --- */
:deep(.inputs-container) {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

:deep(.input-group) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.input-group label) {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  padding-left: 2px;
}

:deep(.tool-input) {
  width: 100%;
  height: 46px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: var(--text-main);
  background: #ffffff;
  transition: var(--transition);
  outline: none;
}

:deep(.tool-input:hover) {
  border-color: var(--border-hover);
}

:deep(.tool-input:focus) {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

:deep(textarea.tool-input) {
  height: auto;
  min-height: 110px;
  padding: 12px 14px;
  text-align: left;
  font-size: 0.92rem;
  font-weight: 400;
  line-height: 1.6;
  resize: vertical;
}

:deep(input[type=number]::-webkit-inner-spin-button),
:deep(input[type=number]::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* --- 按钮组样式 --- */
:deep(.btn-group) {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

:deep(.btn-calc) {
  flex: 2;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 20px;
  background: var(--primary-gradient);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

:deep(.btn-calc:hover) {
  box-shadow: 0 6px 18px rgba(14, 165, 233, 0.35);
  transform: translateY(-1px);
}

:deep(.btn-calc:active) {
  transform: scale(0.99);
}

:deep(.btn-calc:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

:deep(.btn-clear) {
  flex: 1;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  background: var(--bg-hover);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

:deep(.btn-clear:hover) {
  background: var(--bg-active);
  color: var(--text-main);
  border-color: var(--border-hover);
}

:deep(.btn-clear:active) {
  transform: scale(0.99);
}

/* --- 通用结果区域：清新浅蓝嵌板 --- */
:deep(.result-section) {
  margin-top: 24px;
  border: 1px solid #e0f2fe;
  border-radius: var(--radius-md);
  background: #f0f9ff;
  padding: 20px;
  text-align: center;
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- 移动端表单自适应 --- */
@media (max-width: 640px) {
  :deep(.inputs-container:not(.input-row)) {
    flex-direction: column;
    gap: 12px;
  }
  :deep(.tool-input) {
    height: 44px;
    font-size: 17px;
  }
  :deep(.btn-group) {
    flex-direction: row;
    gap: 8px;
  }
  :deep(.btn-calc),
  :deep(.btn-clear) {
    height: 42px;
    font-size: 14px;
  }
}
</style>

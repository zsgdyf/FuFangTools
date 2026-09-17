<!--
  Navbar.vue - 全局统一顶部导航栏
  风格：日系无印极简 / Notion & Craft 纸质温润风
  功能：
  - 响应式自适应吸顶导航
  - 首页显示品牌与关于信息
  - 子工具页面显示面包屑与快捷返回
  - 右侧提供 GitHub 仓库快捷链接
-->
<template>
  <header class="navbar-container">
    <div class="navbar-inner">
      <!-- 左侧品牌与导航 -->
      <div class="nav-left">
        <router-link to="/" class="brand-link" title="返回浮方工具箱首页">
          <span class="brand-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1.5" />
              <rect width="7" height="7" x="14" y="3" rx="1.5" />
              <rect width="7" height="7" x="14" y="14" rx="1.5" />
              <rect width="7" height="7" x="3" y="14" rx="1.5" />
            </svg>
          </span>
          <span class="brand-name">浮方工具箱</span>
        </router-link>

        <!-- 工具页面时的面包屑指示 -->
        <div v-if="isToolPage" class="nav-breadcrumb">
          <span class="separator">/</span>
          <span class="current-page">{{ currentToolTitle }}</span>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="nav-right">
        <router-link v-if="isToolPage" to="/" class="nav-home-btn" title="返回主页">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="desktop-only">返回列表</span>
        </router-link>

        <a
          href="https://github.com/zsgdyf/FuFangTools"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-action-btn"
          title="查看 GitHub 源码"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断当前是否处于具体工具页面
const isToolPage = computed(() => route.path !== '/')

// 根据路由路径匹配工具中文名称
const toolTitleMap = {
  '/calc-24': '24点计算器',
  '/fun-problems': '趣味题解与图示',
  '/shortlink': '短链接转换器',
  '/bmi': 'BMI计算器',
  '/qrcode': '二维码生成',
  '/base64': 'Base64 转换',
  '/web-preview': '网页内容预览',
  '/poetry-card': '古诗词卡片'
}

const currentToolTitle = computed(() => {
  return toolTitleMap[route.path] || '工具'
})
</script>

<style scoped>
/* 导航容器与吸顶 */
.navbar-container {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(251, 251, 250, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.navbar-inner {
  max-width: 1040px;
  margin: 0 auto;
  height: 54px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 左侧区域 */
.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  white-space: nowrap;
}

.brand-link:hover {
  background-color: var(--bg-hover);
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--primary-gradient);
  color: #ffffff;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.brand-name {
  letter-spacing: -0.2px;
  font-weight: 700;
}

/* 面包屑 */
.nav-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.separator {
  color: var(--text-light);
  font-size: 0.85rem;
}

.current-page {
  font-weight: 600;
  color: var(--primary);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧区域 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: none;
  background-color: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.nav-home-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
}

.icon-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: var(--transition);
}

.icon-action-btn:hover {
  color: var(--text-main);
  background-color: var(--bg-hover);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .navbar-inner {
    padding: 0 14px;
    height: 50px;
  }

  .desktop-only {
    display: none;
  }

  .nav-home-btn {
    padding: 5px 8px;
  }

  .brand-name {
    font-size: 0.9rem;
  }
}
</style>

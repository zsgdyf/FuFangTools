<!--
  App.vue - 根组件
  整合全局极简顶栏 Navbar、路由视图与备案页脚
  适配移动端安全区与自然流式布局
-->
<template>
  <div class="app-layout">
    <!-- 全局统一极简顶栏 -->
    <Navbar />

    <!-- 页面核心内容区域 -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- ICP 备案页脚：在阿里云部署时显示，Cloudflare 部署时隐藏 -->
    <IcpFooter />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import IcpFooter from './components/IcpFooter.vue'
</script>

<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 48px;
}

@media (max-width: 640px) {
  .app-main {
    padding: 16px 14px 32px;
  }
}
</style>


<!--
  App.vue - 根组件
  包含路由视图和全局 ICP 备案页脚
  所有页面都会渲染此组件，页面内容通过 <router-view> 动态切换
-->
<template>
  <router-view />
  <!-- ICP 备案页脚：在阿里云部署时显示，Cloudflare 部署时隐藏 -->
  <IcpFooter />
</template>

<script setup>
import IcpFooter from './components/IcpFooter.vue'
</script>

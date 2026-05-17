<!--
  HomeView.vue - 首页视图
  展示工具箱的网格布局，包含所有工具的入口卡片
  使用 router-link 实现 SPA 内部导航
-->
<template>
  <div class="home-container">
    <header>
      <h1>浮方工具箱</h1>
      <p class="desc">浮方方的在线工具集合</p>
    </header>

    <!-- 工具卡片网格 -->
    <main class="tool-grid">
      <router-link
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        class="tool-card"
      >
        <div class="card-icon">{{ tool.icon }}</div>
        <div class="card-body">
          <h2 class="card-title">{{ tool.title }}</h2>
          <p class="card-desc">{{ tool.desc }}</p>
        </div>
      </router-link>
    </main>
  </div>
</template>

<script setup>
/**
 * 工具列表配置
 * 集中管理所有工具的元数据，便于后期添加新工具
 */
const tools = [
  {
    path: '/calc-24',
    icon: '🧮',
    title: '24点计算器',
    desc: '输入4个数字，自动寻找所有可能的24点解法。'
  },
  {
    path: '/shortlink',
    icon: '🔗',
    title: '短链接转换器',
    desc: '一键还原短链接背后的原始长地址。'
  },
  {
    path: '/bmi',
    icon: '⚖️',
    title: 'BMI计算器',
    desc: '根据身高和体重计算身体质量指数（BMI）。'
  },
  {
    path: '/qrcode',
    icon: '📱',
    title: '二维码生成工具',
    desc: '输入文本或网址，生成对应的二维码图片。'
  },
  {
    path: '/base64',
    icon: '🔠',
    title: 'Base64 转换',
    desc: '在线文本 Base64 编码与解码工具。'
  },
  {
    path: '/web-preview',
    icon: '🌍',
    title: '网页内容预览',
    desc: '输入网址即可预览X、YouTube、B站等网页内容。'
  }
]
</script>

<style scoped>
/* ===================================
   首页特定样式（scoped 避免与工具页冲突）
   =================================== */
.home-container {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 900px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-align: center;
}

header {
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

p.desc {
  color: var(--text-light);
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  padding: 25px;
  text-align: left;
  text-decoration: none;
  color: var(--text-main);
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
  border-color: var(--primary);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  line-height: 1;
  color: var(--primary);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .home-container {
    padding: 30px;
  }
  .tool-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 20px;
  }
  h1 {
    font-size: 2rem;
  }
  p.desc {
    font-size: 1rem;
  }
}
</style>

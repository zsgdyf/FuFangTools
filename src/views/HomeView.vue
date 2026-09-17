<!--
  HomeView.vue - 首页视图
  风格：日系无印极简 / Notion & Craft 纸质温润风
  功能：
  - 精致矢量图标取代原生 Emoji
  - 工具即时搜索与快捷分类筛选
  - 响应式自适应网格（桌面多列，移动端单列横向卡片）
-->
<template>
  <div class="home-container">
    <!-- 首页头部标语与搜索区域 -->
    <header class="home-header">
      <div class="header-badge">Online Utilities</div>
      <h1 class="main-title">浮方工具箱</h1>
      <p class="main-desc">克制、安静且触手可及的在线小工具集</p>

      <!-- 搜索与分类控制台 -->
      <div class="filter-bar">
        <!-- 搜索输入框 -->
        <div class="search-box">
          <Search class="search-icon" :size="16" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索工具，例如：24点、短链、二维码..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">
            &times;
          </button>
        </div>

        <!-- 分类标签切换 -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="['tab-btn', { active: currentCategory === cat.id }]"
            @click="currentCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </header>

    <!-- 工具卡片网格 -->
    <main class="tool-grid">
      <router-link
        v-for="tool in filteredTools"
        :key="tool.path"
        :to="tool.path"
        class="tool-card"
      >
        <div class="card-icon-box">
          <component :is="tool.iconComponent" :size="20" class="card-icon" />
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <h2 class="card-title">{{ tool.title }}</h2>
            <span class="card-tag">{{ tool.categoryLabel }}</span>
          </div>
          <p class="card-desc">{{ tool.desc }}</p>
        </div>
      </router-link>

      <!-- 无搜索结果提示 -->
      <div v-if="filteredTools.length === 0" class="empty-state">
        <p>未找到匹配 “{{ searchQuery }}” 的工具</p>
        <button class="reset-search-btn" @click="searchQuery = ''; currentCategory = 'all'">
          重置筛选条件
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Calculator,
  Compass,
  Link2,
  Scale,
  QrCode,
  Code,
  Globe,
  Feather,
  Search
} from 'lucide-vue-next'

// 搜索关键字
const searchQuery = ref('')
// 当前选中的分类
const currentCategory = ref('all')

// 分类列表
const categories = [
  { id: 'all', name: '全部' },
  { id: 'calc', name: '计算与趣味' },
  { id: 'text', name: '编码与转换' },
  { id: 'media', name: '媒体与工具' }
]

/**
 * 完整工具配置元数据
 */
const allTools = [
  {
    path: '/calc-24',
    iconComponent: Calculator,
    title: '24点计算器',
    category: 'calc',
    categoryLabel: '计算',
    desc: '输入4个数字，自动寻找所有可行的24点运算表达式。'
  },
  {
    path: '/fun-problems',
    iconComponent: Compass,
    title: '趣味题解与图示',
    category: 'calc',
    categoryLabel: '数学',
    desc: '收录精选题解，搭配交互式动态几何图示实验室。'
  },
  {
    path: '/shortlink',
    iconComponent: Link2,
    title: '短链接转换器',
    category: 'text',
    categoryLabel: '网络',
    desc: '一键还原快手等短链接背后的真实长地址。'
  },
  {
    path: '/bmi',
    iconComponent: Scale,
    title: 'BMI 计算器',
    category: 'calc',
    categoryLabel: '健康',
    desc: '根据身高与体重，计算并可视化身体质量指数。'
  },
  {
    path: '/qrcode',
    iconComponent: QrCode,
    title: '二维码生成',
    category: 'media',
    categoryLabel: '图形',
    desc: '输入任意文本或网址，即时生成清晰二维码图片。'
  },
  {
    path: '/base64',
    iconComponent: Code,
    title: 'Base64 转换',
    category: 'text',
    categoryLabel: '编码',
    desc: '在线文本与 Base64 编码的双向即时互转工具。'
  },
  {
    path: '/web-preview',
    iconComponent: Globe,
    title: '网页内容预览',
    category: 'media',
    categoryLabel: '预览',
    desc: '输入网址快速预览 X、YouTube、B站等网页内容。'
  },
  {
    path: '/poetry-card',
    iconComponent: Feather,
    title: '古诗词卡片',
    category: 'media',
    categoryLabel: '创作',
    desc: '一键生成极具中国传统美学底蕴的诗词精美卡片。'
  }
]

/**
 * 根据域名过滤（阿里云域名隐藏部分非备案功能）
 */
const availableTools = computed(() => {
  const hostname = window.location.hostname
  if (hostname.includes('tool.fufang.site')) {
    return allTools.filter(tool => tool.path !== '/web-preview')
  }
  return allTools
})

/**
 * 响应式过滤后的工具列表
 */
const filteredTools = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return availableTools.value.filter(tool => {
    const matchCategory = currentCategory.value === 'all' || tool.category === currentCategory.value
    const matchQuery = !query || 
      tool.title.toLowerCase().includes(query) || 
      tool.desc.toLowerCase().includes(query)
    return matchCategory && matchQuery
  })
})
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
}

/* 头部样式 */
.home-header {
  text-align: center;
  margin-bottom: 36px;
  padding: 10px 0 20px;
}

.header-badge {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--primary);
  background-color: #e0f2fe;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.main-title {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #0284c7 0%, #0f172a 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* 过滤栏：搜索与分类标签 */
.filter-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--primary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 36px 0 40px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-main);
  outline: none;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.search-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: var(--bg-muted);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.clear-search-btn:hover {
  background: var(--bg-hover);
  color: var(--text-main);
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-btn {
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn:hover {
  background-color: #e0f2fe;
  color: var(--primary);
}

.tab-btn.active {
  background: var(--primary-gradient);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
  font-weight: 600;
}

/* 工具网格 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 工具卡片：轻盈灵动的微蓝纸质卡片 */
.tool-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.tool-card:hover {
  border-color: #7dd3fc;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
}

.tool-card:active {
  transform: scale(0.99);
}

.card-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background-color: #f0f9ff;
  color: var(--primary);
  border: 1px solid #e0f2fe;
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.tool-card:hover .card-icon-box {
  background: var(--primary-gradient);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.2px;
  transition: var(--transition);
}

.tool-card:hover .card-title {
  color: var(--primary);
}

.card-tag {
  font-size: 0.72rem;
  color: var(--primary);
  background-color: #f0f9ff;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid #e0f2fe;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px 20px;
  color: var(--text-secondary);
}

.reset-search-btn {
  margin-top: 12px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.reset-search-btn:hover {
  background: var(--bg-hover);
}

/* 移动端响应式优化 */
@media (max-width: 640px) {
  .home-header {
    margin-bottom: 24px;
    padding: 0 0 10px;
  }

  .main-title {
    font-size: 1.65rem;
  }

  .main-desc {
    font-size: 0.88rem;
    margin-bottom: 18px;
  }

  .tool-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .tool-card {
    padding: 16px;
    gap: 14px;
    border-radius: var(--radius-md);
  }

  .card-icon-box {
    width: 38px;
    height: 38px;
  }

  .card-title {
    font-size: 0.98rem;
  }

  .card-desc {
    font-size: 0.82rem;
  }
}
</style>


/**
 * 路由配置
 * 使用 Hash 模式，确保在 Cloudflare Pages 和阿里云部署环境下都能正常工作
 * Hash 模式下 URL 格式为: /#/calc-24, /#/bmi 等
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 路由表定义
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '浮方工具箱' }
  },
  {
    path: '/calc-24',
    name: 'calc24',
    // 路由懒加载：只在访问时才加载组件，减小首屏体积
    component: () => import('../views/Calc24View.vue'),
    meta: { title: '24点计算器 - 浮方工具箱' }
  },
  {
    path: '/shortlink',
    name: 'shortlink',
    component: () => import('../views/ShortlinkView.vue'),
    meta: { title: '短链接转换器 - 浮方工具箱' }
  },
  {
    path: '/bmi',
    name: 'bmi',
    component: () => import('../views/BmiView.vue'),
    meta: { title: 'BMI计算器 - 浮方工具箱' }
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: () => import('../views/QrcodeView.vue'),
    meta: { title: '二维码生成工具 - 浮方工具箱' }
  },
  {
    path: '/base64',
    name: 'base64',
    component: () => import('../views/Base64View.vue'),
    meta: { title: 'Base64 编码转换 - 浮方工具箱' }
  },
  {
    path: '/web-preview',
    name: 'webPreview',
    component: () => import('../views/WebPreviewView.vue'),
    meta: { title: '网页内容预览 - 浮方工具箱' }
  },
  {
    path: '/poetry-card',
    name: 'poetryCard',
    component: () => import('../views/PoetryCardView.vue'),
    meta: { title: '古诗词卡片生成器 - 浮方工具箱' }
  },
  {
    path: '/fun-problems',
    name: 'funProblems',
    component: () => import('../views/FunProblemsView.vue'),
    meta: { title: '趣味题解与图示 - 浮方工具箱' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 路由跳转时自动滚动到页面顶部
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // 浏览器前进/后退时保持历史位置
      return savedPosition
    } else {
      // 页面新跳转时瞬间复位至顶部
      return { top: 0, left: 0 }
    }
  }
})

// 全局路由守卫：根据路由 meta 信息动态设置页面标题
router.beforeEach((to, from, next) => {
  // 1. 设置标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 2. 环境限制：阿里云域名隐藏「网页内容预览」
  const hostname = window.location.hostname;
  if (to.path === '/web-preview' && hostname.includes('tool.fufang.site')) {
    next({ name: 'home' });
  } else {
    next();
  }
})

// 全局后置钩子：双重保障确保每次路由切换页面视口滚回顶部
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router

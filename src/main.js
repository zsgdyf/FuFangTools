/**
 * 应用入口文件
 * 初始化 Vue 应用，挂载路由和全局样式
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式（主题变量）
import './styles/theme.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册路由
app.use(router)

// 挂载到 DOM
app.mount('#app')

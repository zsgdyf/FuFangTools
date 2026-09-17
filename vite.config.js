import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite 构建配置
 * - 使用 Vue 插件支持 .vue 单文件组件
 * - 开发模式下代理 /api 请求到本地 Express 服务器
 */
export default defineConfig({
  plugins: [vue()],
  server: {
    // 监听所有网络接口，允许局域网设备（如手机）访问
    host: '0.0.0.0',
    // 开发服务器代理配置：将 API 请求转发到 Express 后端
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

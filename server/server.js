/**
 * Express 服务器
 * 用途：
 * 1. 本地开发时提供 API 接口（短链接解析、应用配置）
 * 2. 阿里云部署时作为生产服务器（通过 PM2 管理）
 * 3. pkg 打包为桌面应用时作为内置服务器
 */
const express = require('express')
const path = require('path')
const open = require('open')

const app = express()
const port = 3000

// 提供静态文件服务
// 开发环境：指向项目根目录（由 Vite 处理前端资源）
// 生产环境/打包环境：指向 Vite 构建产物 dist/ 目录
const publicPath = process.pkg
  ? path.join(path.dirname(process.execPath), '/')  // pkg 打包后指向 exe 所在目录
  : path.join(__dirname, '../dist/')                  // 常规部署指向构建产物

app.use(express.static(publicPath))

// --- API 接口 ---

/**
 * 获取应用配置
 * 前端通过此接口判断是否显示备案号等信息
 * 逻辑：如果是 tool.fufang.site 域名，则不返回备案号（实现子域名隐藏）
 * ICP_NUMBER 环境变量由阿里云部署流程注入
 */
app.get('/api/app-config', (req, res) => {
  const host = req.get('host') || ''
  const isToolSubdomain = host.includes('tool.fufang.site')

  res.json({
    icpNumber: isToolSubdomain ? '' : (process.env.ICP_NUMBER || '')
  })
})

/**
 * 短链接解析接口
 * 通过服务端发起 HTTP 请求跟随重定向，获取短链接的原始长链接
 * 优先使用 HEAD 请求（更轻量），失败时降级为 GET 请求
 */
app.get('/api/expand', async (req, res) => {
  const shortUrl = req.query.url

  if (!shortUrl) {
    return res.status(400).json({ error: '缺少 url 参数' })
  }

  try {
    // 首先尝试 HEAD 请求（仅获取响应头，不下载 body）
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        // 使用标准桌面 Chrome UA，避免被服务端识别为爬虫
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.kuaishou.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    })
    res.json({ longUrl: response.url })
  } catch (error) {
    try {
      // 降级方案：某些服务可能禁用 HEAD 请求
      const response = await fetch(shortUrl, { method: 'GET', redirect: 'follow' })
      res.json({ longUrl: response.url })
    } catch (innerError) {
      // 解析彻底失败
      res.status(500).json({ error: '解析链接失败', details: innerError.message })
    }
  }
})

// --- 启动服务器 ---
app.listen(port, () => {
  const url = `http://localhost:${port}`
  console.log(`浮方工具箱已启动！请勿关闭此窗口。`)
  console.log(`服务器正在运行，请访问: ${url}`)

  // 非生产环境下自动打开浏览器
  if (process.env.NODE_ENV !== 'production') {
    open(url)
  }
})

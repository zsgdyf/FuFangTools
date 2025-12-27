const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const port = 3000;

// 提供静态文件服务
// __dirname 在 pkg 打包后会指向虚拟路径, 不可靠
// process.execPath 指向 .exe 文件本身, path.dirname(process.execPath) 就能得到它所在的真实目录
const publicPath = process.pkg ? path.join(path.dirname(process.execPath), '/') : path.join(__dirname, '/');
app.use(express.static(publicPath));

// 解析短链接的 API 端点
app.get('/api/expand', async (req, res) => {
    const shortUrl = req.query.url;

    if (!shortUrl) {
        return res.status(400).json({ error: '缺少 url 参数' });
    }

    try {
        const response = await fetch(shortUrl, {
            method: 'HEAD',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.kuaishou.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });
        res.json({ longUrl: response.url });
    } catch (error) {
        try {
            const response = await fetch(shortUrl, { method: 'GET', redirect: 'follow' });
            res.json({ longUrl: response.url });
        } catch (innerError) {
            res.status(500).json({ error: '解析链接失败', details: innerError.message });
        }
    }
});

// 启动服务器
app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`浮方工具箱已启动！请勿关闭此窗口。`);
    console.log(`服务器正在运行，请访问: ${url}`);
    // 自动在用户的默认浏览器中打开URL
    open(url);
});

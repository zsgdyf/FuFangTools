# 阿里云轻量应用服务器部署指南

本项目（浮方工具箱 v2.0，Vue 3 + Vite）支持通过 GitHub Actions 自动部署到阿里云服务器。本指南将帮助你完成服务器环境准备和 CI/CD 流水线配置。

## 1. 服务器环境准备

登录到你的阿里云服务器（推荐使用 SSH），执行以下步骤：

### 1.1 安装 Node.js (v18+)

```bash
# 更新包列表
sudo apt update

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 1.2 安装 PM2 (进程管理器)

```bash
sudo npm install -g pm2
```

### 1.3 创建项目目录

项目默认部署路径为 `/www/wwwroot/fufangtools`，与 GitHub Actions 配置一致。

```bash
sudo mkdir -p /www/wwwroot/fufangtools
# 修改目录权限，确保你的 SSH 用户有权写入
sudo chown -R $USER:$USER /www/wwwroot/fufangtools
```

---

## 2. GitHub Secrets 配置

在你的 GitHub 项目仓库页面，进入 `Settings` -> `Secrets and variables` -> `Actions`，点击 `New repository secret`，添加以下 **四个** 密钥：

| Secret Name | 值说明 |
|-------------|--------|
| `ALIYUN_HOST` | 服务器的公网 IP 地址 |
| `ALIYUN_USER` | SSH 登录用户名 (例如 `root`) |
| `ALIYUN_KEY` | SSH 私钥内容（你的本地私钥文件 `id_rsa` 的完整内容，或专门生成的部署密钥） |
| `ICP_NUMBER` | **你的真实 ICP 备案号** (例如 `鄂ICP备XXXXXXXX号`) |

**注意：**
1. `ICP_NUMBER` 必须配置，否则阿里云页面底部不会显示备案号。
2. 确保服务器的 `~/.ssh/authorized_keys` 文件中包含对应的 SSH **公钥**，GitHub Actions 才能免密登录。
3. 本项目 SSH 连接使用**非标准端口 `51208`**（已在 `deploy.yml` 中配置），请确保该端口在服务器防火墙（阿里云安全组）中已放行。

---

## 3. 自动部署流程说明

当你向 GitHub 的 `main` 分支推送代码时，Actions 会自动按以下步骤执行：

### 步骤一：构建 Vue 应用 (在 Actions Runner 上)
```bash
npm ci           # 安装所有依赖
npm run build    # 使用 Vite 构建，产物输出到 dist/ 目录
```

### 步骤二：上传文件到服务器 (SCP)

通过 SCP 将以下文件上传到服务器 `/www/wwwroot/fufangtools`：

| 文件/目录 | 说明 |
|-----------|------|
| `dist/` | Vite 构建产物（前端静态资源） |
| `server/` | Express 服务端代码 |
| `functions/` | Cloudflare Pages Functions（上传但不在阿里云执行） |
| `package.json` | 项目配置（用于服务端依赖安装） |
| `package-lock.json` | 依赖锁定文件 |

### 步骤三：服务端安装依赖并重启

SSH 连接到服务器后执行：
```bash
cd /www/wwwroot/fufangtools
npm install --production           # 仅安装服务端运行依赖（express 等）

export NODE_ENV=production
export ICP_NUMBER=$ICP_NUMBER      # 注入 GitHub Secrets 中配置的备案号

# 使用 PM2 重启或首次启动服务
if pm2 list | grep -q "fufangtools"; then
  pm2 reload fufangtools --update-env   # 已运行时热重载并更新环境变量
else
  pm2 start server/server.js --name fufangtools  # 首次启动
fi

pm2 save                           # 保存进程列表，实现开机自启
```

### 备案号注入机制

`ICP_NUMBER` 通过环境变量注入到 PM2 进程，Express 服务器通过 `/api/app-config` 接口返回给前端：
- **阿里云**：`server.js` 正常运行，前端成功获取备案号并显示在页面底部。
- **Cloudflare Pages**：纯静态环境，无 `server.js`，`/api/app-config` 返回 404，前端**不显示**备案号。

---

## 4. PM2 常用操作命令

部署完成后，可通过以下命令手动管理服务：

```bash
pm2 list                           # 查看所有进程状态
pm2 logs fufangtools               # 查看服务日志
pm2 restart fufangtools            # 重启服务
pm2 reload fufangtools --update-env  # 热重载（更新环境变量时使用）
pm2 stop fufangtools               # 停止服务
pm2 delete fufangtools             # 删除 PM2 进程记录
pm2 startup                        # 生成开机自启脚本
pm2 save                           # 保存当前进程列表
```

---

## 5. (可选) Nginx 反向代理配置

为了使用 80/443 端口访问（而不是直接暴露 3000 端口），建议配置 Nginx。

1. 安装 Nginx: `sudo apt install nginx`
2. 创建配置: `sudo nano /etc/nginx/sites-available/fufangtools`

```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为你的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 启用配置并重启 Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/fufangtools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

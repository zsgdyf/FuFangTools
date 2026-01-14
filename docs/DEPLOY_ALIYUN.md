# 阿里云轻量应用服务器部署指南

本指南将帮助你将项目部署到阿里云服务器，并实现与 GitHub 的自动同步。

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

我们假设项目部署在 `/www/wwwroot/fufangtools`（这也是 GitHub Action 默认配置的路径）。

```bash
sudo mkdir -p /www/wwwroot/fufangtools
# 修改目录权限，确保你的 SSH 用户有权写入 (假设用户名为 root，如果是其他用户请修改)
sudo chown -R $USER:$USER /www/wwwroot/fufangtools
```

---

## 2. GitHub Secrets 配置

在你的 GitHub 项目仓库页面，进入 `Settings` -> `Secrets and variables` -> `Actions`，点击 `New repository secret`，添加以下 **四个** 密钥：

| Secret Name | 值说明 |
|-------------|--------|
| `ALIYUN_HOST` | 服务器的公网 IP 地址 |
| `ALIYUN_USER` | SSH 登录用户名 (例如 `root`) |
| `ALIYUN_KEY` | SSH 私钥内容 (即你的本地私钥文件 `id_rsa` 的内容，或者是专门生成的部署密钥) |
| `ICP_NUMBER` | **你的真实备案号** (例如 `京ICP备XXXXXXXX号`) |

**注意：** 
1. `ICP_NUMBER` 是必须配置的，否则阿里云页面底部不会显示备案号。
2. 确保服务器上的 `~/.ssh/authorized_keys` 文件中包含了对应的公钥，这样 GitHub 才能免密登录。

---

## 3. 部署与验证

当你推送到 GitHub 的 `main` 分支时，Actions 会自动执行：
1. 将代码上传到服务器。
2. 注入你在 Secrets 中配置的 `ICP_NUMBER`。
3. 重启 Node.js 服务。

### 验证逻辑
- **Cloudflare Pages**: 由于它是纯静态环境，不运行 `server.js`，前端请求 `/api/app-config` 会失败（404），因此**不会显示**备案号。
- **阿里云**: 运行 `server.js`，前端请求 `/api/app-config` 成功返回 `ICP_NUMBER`，因此**会显示**备案号。

---

## 4. (可选) Nginx 反向代理配置

为了使用 80/443 端口访问（而不是 3000 端口），建议配置 Nginx。

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

## 5. (进阶) 双域名分离配置
如果你希望 **主域名** (如 `example.com`) 只展示一个带备案号的静态页，而将 **应用** 放在 **子域名** (如 `app.example.com`)，请参考以下方案：

### 5.1 准备工作
1. 项目根目录下已自动生成 `landing_page` 文件夹，其中包含简单的静态主页。
2. **重要**：请手动修改 `landing_page/index.html`，将 `鄂ICP备XXXXXXXX号` 替换为你真实的 ICP 备案号。
3. 确保你的域名 DNS 解析已设置：
   - `@` (主域名) -> 服务器 IP
   - `app` (子域名) -> 服务器 IP (或你喜欢的其他前缀)

### 5.2 Nginx 配置 (修改 /etc/nginx/sites-available/fufangtools)

将配置修改为两个 server 块：

```nginx
# 1. 主域名服务器块 (纯静态，展示备案页)
server {
    listen 80;
    server_name example.com www.example.com; # 【修改】替换为你的主域名

    # 指向项目中的 landing_page 目录
    # 注意：根据你的实际部署路径调整，假设项目在 /www/wwwroot/fufangtools
    root /www/wwwroot/fufangtools/landing_page;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# 2. 子域名服务器块 (反向代理，指向 Node 应用)
server {
    listen 80;
    server_name app.example.com; # 【修改】替换为你的子域名

    location / {
        proxy_pass http://localhost:3000; # 指向 Node 服务端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

修改完成后，记得运行 `sudo nginx -t` 测试配置，并 `sudo systemctl restart nginx` 重启服务。
# 打包为 Windows 桌面应用

此应用可以通过 `pkg` 工具打包成一个独立的 Windows `.exe` 可执行文件。

## 先决条件

1.  **Node.js**: 确保你的系统上已安装 Node.js (推荐 LTS 版本)。

## 打包步骤

### 1. 安装项目依赖

如果尚未安装，请在项目根目录运行：
```bash
npm install
```
这会安装 `express`, `open` 以及打包工具 `pkg` 等依赖。

### 2. 生成 `.exe` 文件

在项目根目录运行以下命令来生成可执行文件：
```bash
npm run build
```
*   此命令会在项目根目录创建一个 `dist` 文件夹，并在其中生成 `fufangtools.exe` 文件。
*   **注意**: 如果构建失败并提示文件占用错误 (`EPERM`)，请确保你已经关闭了所有正在运行的 `fufangtools.exe` 进程，然后重试。

### 3. 复制静态资源文件

`.exe` 文件本身不包含前端的 HTML, CSS, JavaScript 等文件。你需要将它们复制到 `dist` 文件夹，与 `fufangtools.exe` 放在一起。

在项目根目录运行以下命令完成复制（推荐使用 PowerShell）：

```powershell
# 复制 css, html, js 文件夹到 dist
Copy-Item -Path css, html, js -Destination dist -Recurse -Force

# 复制根目录文件到 dist
Copy-Item -Path index.html, favicon.ico, favicon.svg, favicon-96x96.png -Destination dist -Force
```

### 4. 如何运行

1.  进入 `dist` 文件夹。
2.  双击 `fufangtools.exe`。
3.  应用程序启动后，会弹出一个命令行窗口。
4.  请手动或等待浏览器自动打开 `http://localhost:3000`。

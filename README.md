# 浮方工具箱 - 桌面应用版

这是一个将在线工具箱打包成 Windows 桌面应用的项目，方便离线使用（短链接功能需要联网）。

## 功能列表

*   **24点计算器**: 输入4个数字，自动寻找所有可能的24点解法。
*   **短链接转换器**: 一键还原短链接背后的原始长地址。

## 如何运行（开发模式）

如果你想在本地开发环境中运行此应用（无需打包成 `.exe`），可以执行以下步骤：

1.  **安装依赖**:
    ```bash
    npm install
    ```
2.  **启动服务器**:
    ```bash
    npm start
    ```
    服务器启动后，通常会自动在你的浏览器中打开 `http://localhost:3000`。

## 如何打包成独立的 `.exe` 文件

此应用可以通过 `pkg` 工具打包成一个独立的 Windows `.exe` 可执行文件。

### 先决条件

1.  **Node.js**: 确保你的系统上已安装 Node.js (推荐 LTS 版本)。

### 打包步骤

1.  **安装项目依赖**:
    如果尚未安装，请在项目根目录运行：
    ```bash
    npm install
    ```
    这会安装 `express`, `open` 以及打包工具 `pkg` 等依赖。

2.  **生成 `.exe` 文件**:
    在项目根目录运行以下命令来生成可执行文件：
    ```bash
    npm run build
    ```
    *   此命令会在项目根目录创建一个 `dist` 文件夹，并在其中生成 `fufangtools.exe` 文件。
    *   **注意**: 如果构建失败并提示文件占用错误 (`EPERM`)，请确保你已经关闭了所有正在运行的 `fufangtools.exe` 进程，然后重试。

3.  **复制静态资源文件**:
    `.exe` 文件本身不包含前端的 HTML, CSS, JavaScript 等文件。你需要将它们复制到 `dist` 文件夹，与 `fufangtools.exe` 放在一起。
    在项目根目录运行以下命令完成复制（适用于 Windows）：
    ```powershell
    xcopy css dist\css\ /E /I /Y
    xcopy html dist\html\ /E /I /Y
    xcopy js dist\js\ /E /I /Y
    copy /Y index.html dist\
    copy /Y favicon.ico dist\
    copy /Y favicon.svg dist\
    copy /Y favicon-96x96.png dist\
    ```
    *   `/E`: 复制目录和子目录，包括空目录。
    *   `/I`: 如果目标不存在并且复制多个文件，则假定目标是目录。
    *   `/Y`: 禁止提示确认要覆盖现有文件。

### 如何运行打包后的 `.exe`

1.  进入 `dist` 文件夹。
2.  双击 `fufangtools.exe`。
3.  应用程序启动后，会弹出一个命令行窗口。
4.  **手动打开浏览器**: 在浏览器中访问 `http://localhost:3000`。
    *   **关于自动打开浏览器功能**: 为了解决 `pkg` 打包时 `open` 库（用于自动打开浏览器）的模块系统兼容性问题，我们特意在项目中使用了 `open@8.4.2` 这个版本。尽管我们已尽力确保兼容性，但在某些环境下，该功能在打包后的 `.exe` 中可能仍无法稳定工作。因此，如果发现浏览器没有自动弹出，请手动访问 `http://localhost:3000`。

## 更新和重新打包

如果你修改了 `server.js` (后端逻辑) 或任何前端文件 (HTML, CSS, JS)，你需要执行以下步骤来更新你的 `.exe` 应用：

1.  **修改代码**: 在项目根目录修改你的源文件。
2.  **执行更新流程**:
    在项目根目录运行：
    ```powershell
    npm run build
    xcopy css dist\css\ /E /I /Y
    xcopy html dist\html\ /E /I /Y
    xcopy js dist\js\ /E /I /Y
    copy /Y index.html dist\
    copy /Y favicon.ico dist\
    copy /Y favicon.svg dist\
    copy /Y favicon-96x96.png dist\
    ```
    *   这会重新生成 `fufangtools.exe` 并更新 `dist` 文件夹中的所有静态资源。
    *   请确保在运行这些命令之前，没有 `fufangtools.exe` 进程正在运行。

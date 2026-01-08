(async function() {
    try {
        // 尝试从服务器获取配置
        // 在 Cloudflare Pages 环境下，这个请求会返回 404 (或者被 Function 捕获但无此路由)，前端捕获异常即可
        // 在 阿里云 (Node.js) 环境下，server.js 会返回对应的 JSON
        const response = await fetch('/api/app-config');
        
        if (!response.ok) {
            return; // 请求失败，说明可能是在纯静态环境，不显示备案号
        }

        const config = await response.json();

        // 只有当服务端明确返回了 icpNumber 时才显示
        if (config && config.icpNumber) {
            renderFooter(config.icpNumber);
        }

    } catch (error) {
        // 忽略错误，保持页面整洁
        // console.log('ICP Footer: Running in static mode or config fetch failed.');
    }

    function renderFooter(icpNumber) {
        const beianLink = "https://beian.miit.gov.cn/";
        
        // 创建 Footer 元素
        const footer = document.createElement('div');
        footer.id = 'icp-footer';
        
        // 设置样式
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        footer.style.padding = '10px';
        footer.style.fontSize = '12px';
        footer.style.color = '#94a3b8'; // 对应 theme.css 的 --text-light
        footer.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 半透明背景
        footer.style.zIndex = '9999';
        footer.style.pointerEvents = 'none';

        // 创建链接
        const link = document.createElement('a');
        link.href = beianLink;
        link.target = '_blank';
        link.innerText = icpNumber;
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        link.style.pointerEvents = 'auto';
        
        link.onmouseover = () => { link.style.textDecoration = 'underline'; };
        link.onmouseout = () => { link.style.textDecoration = 'none'; };

        footer.appendChild(link);
        document.body.appendChild(footer);
    }
})();
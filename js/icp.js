(async function() {
    try {
        // 尝试从服务器获取配置
        const response = await fetch('/api/app-config');
        
        if (!response.ok) {
            return;
        }

        const config = await response.json();

        // 只有当服务端明确返回了 icpNumber 时才显示
        if (config && config.icpNumber) {
            renderFooter(config.icpNumber);
        }

    } catch (error) {
        // 静默失败
    }

    function renderFooter(icpNumber) {
        const beianLink = "https://beian.miit.gov.cn/";
        
        // 创建简单的 footer 元素
        const footer = document.createElement('footer');
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        footer.style.padding = '30px 0 20px 0'; // 增加顶部间距，使其与主体内容分离
        footer.style.fontSize = '12px';
        footer.style.color = '#94a3b8';

        // 创建链接
        const link = document.createElement('a');
        link.href = beianLink;
        link.target = '_blank';
        link.innerText = icpNumber;
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        
        link.onmouseover = () => { link.style.textDecoration = 'underline'; };
        link.onmouseout = () => { link.style.textDecoration = 'none'; };

        footer.appendChild(link);

        // 直接追加到 body 的最末尾
        document.body.appendChild(footer);
    }
})();
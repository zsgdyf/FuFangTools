(async function () {
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

    function renderFooter (icpNumber) {
        const beianLink = "https://beian.miit.gov.cn/";

        // 创建简单的 footer 元素
        const footer = document.createElement('footer');
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        footer.style.padding = '30px 0 20px 0'; // 增加顶部间距，使其与主体内容分离
        footer.style.fontSize = '12px';
        footer.style.color = '#94a3b8';

        // 1. ICP 备案号部分
        const icpDiv = document.createElement('div');
        const icpLink = document.createElement('a');
        icpLink.href = beianLink;
        icpLink.target = '_blank';
        icpLink.innerText = icpNumber;
        icpLink.style.color = 'inherit';
        icpLink.style.textDecoration = 'none';

        icpLink.onmouseover = () => { icpLink.style.textDecoration = 'underline'; };
        icpLink.onmouseout = () => { icpLink.style.textDecoration = 'none'; };

        icpDiv.appendChild(icpLink);
        footer.appendChild(icpDiv);

        // 2. 公安备案号部分
        const gongAnDiv = document.createElement('div');
        gongAnDiv.style.marginTop = '5px';
        gongAnDiv.style.display = 'flex';
        gongAnDiv.style.alignItems = 'center';
        gongAnDiv.style.justifyContent = 'center';
        gongAnDiv.style.gap = '5px';

        const iconImg = document.createElement('img');
        iconImg.src = "/assets/备案图标.png";
        iconImg.style.width = "20px";
        iconImg.style.height = "20px";

        const gongAnLink = document.createElement('a');
        gongAnLink.href = "https://beian.mps.gov.cn/#/query/webSearch?code=42010302002809";
        gongAnLink.rel = "noreferrer";
        gongAnLink.target = "_blank";
        gongAnLink.innerText = "鄂公网安备42010302002809号";
        gongAnLink.style.color = 'inherit';
        gongAnLink.style.textDecoration = 'none';

        gongAnLink.onmouseover = () => { gongAnLink.style.textDecoration = 'underline'; };
        gongAnLink.onmouseout = () => { gongAnLink.style.textDecoration = 'none'; };

        gongAnDiv.appendChild(iconImg);
        gongAnDiv.appendChild(gongAnLink);

        footer.appendChild(gongAnDiv);

        // 直接追加到 body 的最末尾
        document.body.appendChild(footer);
    }
})();
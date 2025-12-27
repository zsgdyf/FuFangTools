/**
 * 短链接转换器前端逻辑
 */
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面 DOM 元素
    const shortUrlInput = document.getElementById('short-url');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultsList = document.getElementById('results-list');
    const resultCount = document.getElementById('result-count');
    const copyBtn = document.getElementById('copy-btn');
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');

    /**
     * 处理转换按钮点击事件
     */
    convertBtn.addEventListener('click', async () => {
        const rawInput = shortUrlInput.value.trim();
        if (!rawInput) {
            alert('请输入短链接');
            return;
        }

        // 将输入内容按行分割，并过滤掉空行
        const urls = rawInput.split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0);

        if (urls.length === 0) {
            alert('请输入有效的链接');
            return;
        }

        // 重置 UI 状态
        resultBox.style.display = 'none';
        resultsList.innerHTML = '';
        loading.style.display = 'block';
        convertBtn.disabled = true;

        let successCount = 0;
        const results = [];

        // 按顺序遍历处理每个 URL
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            loadingText.textContent = `正在解析 (${i + 1}/${urls.length})...`;

            try {
                // 确保链接包含协议头
                const targetUrl = url.startsWith('http') ? url : `https://${url}`;
                // 调用后端 Function API
                const response = await fetch(`/api/expand?url=${encodeURIComponent(targetUrl)}`);
                const data = await response.json();

                if (data.longUrl) {
                    let processedLongUrl = data.longUrl;
                    const ccShareIndex = processedLongUrl.indexOf('?cc=share');
                    if (ccShareIndex !== -1) {
                        processedLongUrl = processedLongUrl.substring(0, ccShareIndex);
                    }
                    results.push({ original: url, long: processedLongUrl, status: 'success' });
                    successCount++;
                } else {
                    results.push({ original: url, long: data.error || '解析失败', status: 'error' });
                }
            } catch (error) {
                results.push({ original: url, long: '请求出错', status: 'error' });
            }
        }

        // 渲染处理结果
        results.forEach(res => {
            const item = document.createElement('div');
            item.className = `result-item ${res.status}`;
            item.innerHTML = `
                <div class=\"result-item-content\">
                    <div class=\"short-origin\">${res.original}</div>
                    <div class=\"long-expanded\">${res.long}</div>
                </div>
                ${res.status === 'success' ? '<button class=\"copy-btn mini-copy-btn\">复制</button>' : ''}
            `;

            // 如果解析成功，为单个结果绑定复制功能
            if (res.status === 'success') {
                const btn = item.querySelector('.mini-copy-btn');
                btn.addEventListener('click', () => {
                    navigator.clipboard.writeText(res.long).then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = '已复制';
                        setTimeout(() => btn.textContent = originalText, 2000);
                    });
                });
            }

            resultsList.appendChild(item);
        });

        // 显示结果区域并更新计数
        resultCount.textContent = `解析完成 (成功: ${successCount}/${urls.length})`;
        resultBox.style.display = 'block';
        loading.style.display = 'none';
        convertBtn.disabled = false;
    });

    /**
     * 清空按钮点击事件
     */
    clearBtn.addEventListener('click', () => {
        shortUrlInput.value = '';
        resultBox.style.display = 'none';
        resultsList.innerHTML = '';
        loading.style.display = 'none';
    });

    /**
     * 全部复制按钮点击事件
     */
    copyBtn.addEventListener('click', () => {
        // 提取所有成功解析的长链接，用换行符连接
        const longUrls = Array.from(document.querySelectorAll('.result-item.success .long-expanded'))
            .map(el => el.textContent)
            .join('\n');

        if (!longUrls) {
            alert('没有可复制的成功解析结果');
            return;
        }

        navigator.clipboard.writeText(longUrls).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制全部！';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('无法复制:', err);
        });
    });
});
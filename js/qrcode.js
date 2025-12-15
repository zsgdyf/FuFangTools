document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const qrTextInput = document.getElementById('qr-text');
    const resultBox = document.getElementById('result-box');
    const qrcodeContainer = document.getElementById('qrcode');

    generateBtn.addEventListener('click', function () {
        const text = qrTextInput.value.trim();

        if (text) {
            try {
                // 1. 创建二维码对象 (类型 0=自动, 纠错级别 L/M/Q/H)
                // 这里选 'M' 中等纠错，平衡密度和识别率
                var qr = qrcode(0, 'M');

                // 2. 传入经过 UTF-8 转换后的字符串
                // 解决 "t.charCodeAt is not a function" 报错的根源
                qr.addData(toUtf8String(text));

                // 3. 计算数据
                qr.make();

                // 4. 生成 img 标签并插入页面 (单元格大小 6, 边距 8)
                qrcodeContainer.innerHTML = qr.createImgTag(6, 8);

            } catch (e) {
                console.error(e);
                alert('生成失败: ' + e.message);
            }
            resultBox.style.display = 'block';
        } else {
            alert('请输入文本内容');
        }
    });

    clearBtn.addEventListener('click', function () {
        qrTextInput.value = '';
        resultBox.style.display = 'none';
    });

    // 【关键修复】将 Unicode 字符串转换为 UTF-8 编码的字符串
    // 之前报错是因为传了数组，现在改为返回 String，完美兼容库文件
    function toUtf8String (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
});

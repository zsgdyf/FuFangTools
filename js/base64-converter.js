function encodeBase64 () {
    const normalInput = document.getElementById('normalText');
    const base64Input = document.getElementById('base64Text');
    const text = normalInput.value;

    try {
        // 使用 encodeURIComponent 解决中文乱码问题
        const encoded = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes (match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        base64Input.value = encoded;
    } catch (e) {
        alert('编码失败，请检查输入内容');
        console.error(e);
    }
}

function decodeBase64 () {
    const normalInput = document.getElementById('normalText');
    const base64Input = document.getElementById('base64Text');
    const text = base64Input.value.trim();

    if (!text) {
        normalInput.value = '';
        return;
    }

    try {
        // 对应编码时的处理，先 atob 再 decodeURIComponent
        const decoded = decodeURIComponent(atob(text).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        normalInput.value = decoded;
    } catch (e) {
        // 尝试直接 atob (兼容非 UTF-8 编码或标准 ASCII)
        try {
            normalInput.value = atob(text);
        } catch (e2) {
            alert('解码失败：无效的 Base64 字符串');
        }
    }
}

function clearAll () {
    document.getElementById('normalText').value = '';
    document.getElementById('base64Text').value = '';
    document.getElementById('normalText').focus();
}

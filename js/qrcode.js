document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const qrTextInput = document.getElementById('qr-text');
    const resultBox = document.getElementById('result-box');
    const qrcodeContainer = document.getElementById('qrcode');

    // Instantiate QRCode object
    const qrcode = new QRCode(qrcodeContainer, {
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    generateBtn.addEventListener('click', function () {
        const text = qrTextInput.value.trim();

        if (text) {
            qrcode.makeCode(text);
            resultBox.style.display = 'block';
        } else {
            alert('请输入文本内容');
        }
    });

    clearBtn.addEventListener('click', function () {
        qrTextInput.value = '';
        qrcode.clear();
        resultBox.style.display = 'none';
    });
});

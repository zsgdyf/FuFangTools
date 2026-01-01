document.addEventListener('DOMContentLoaded', () => {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultBox = document.getElementById('result-box');
    const bmiValueEl = document.getElementById('bmi-value').querySelector('strong');
    const bmiCategoryEl = document.getElementById('bmi-category');
    const bmiCategoryStrongEl = bmiCategoryEl.querySelector('strong');
    const bmiPointer = document.getElementById('bmi-pointer');
    const clearBtn = document.getElementById('clear-btn');

    function clearAll() {
        heightInput.value = '';
        weightInput.value = '';
        resultBox.style.display = 'none';
        // 清除类别样式类以重置样式
        bmiCategoryEl.className = ''; 
        heightInput.focus();
    }

    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            return;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiFormatted = bmi.toFixed(1);

        let category = '';
        let categoryClass = '';

        if (bmi < 18.5) {
            category = '偏瘦';
            categoryClass = 'underweight';
        } else if (bmi >= 18.5 && bmi < 24) {
            category = '正常';
            categoryClass = 'normal';
        } else { // bmi >= 24
            category = '偏胖';
            categoryClass = 'overweight';
        }
        
        // 更新指针位置
        let pointerPercentage;
        const MIN_DISPLAY_BMI = 12;
        const MAX_DISPLAY_BMI = 40;
        
        // 限制 BMI 数值用于显示计算
        const displayBmi = Math.max(MIN_DISPLAY_BMI, Math.min(MAX_DISPLAY_BMI, bmi));

        if (displayBmi < 18.5) {
            // 偏瘦范围 (MIN_DISPLAY_BMI 到 18.5) 映射到 0% - 25%
            pointerPercentage = ((displayBmi - MIN_DISPLAY_BMI) / (18.5 - MIN_DISPLAY_BMI)) * 25;
        } else if (displayBmi < 24.0) {
            // 正常范围 (18.5 到 24.0) 映射到 25% - 60%
            pointerPercentage = 25 + ((displayBmi - 18.5) / (24.0 - 18.5)) * 35;
        } else {
            // 偏胖范围 (24.0 到 MAX_DISPLAY_BMI) 映射到 60% - 100%
            pointerPercentage = 60 + ((displayBmi - 24.0) / (MAX_DISPLAY_BMI - 24.0)) * 40;
        }

        bmiPointer.style.left = `${pointerPercentage}%`;

        bmiValueEl.textContent = bmiFormatted;
        bmiCategoryStrongEl.textContent = category;
        bmiCategoryEl.className = categoryClass;

        resultBox.style.display = 'block';
    }

    calculateBtn.addEventListener('click', calculateBMI);

    // 允许使用 'Enter' 键触发计算
    weightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            calculateBMI();
            e.target.blur();
        }
    });
    heightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            weightInput.focus();
        }
    });

    clearBtn.addEventListener('click', clearAll);
});

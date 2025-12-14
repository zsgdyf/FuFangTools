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
        // Clear category class to reset styling if any
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
        
        // Update pointer position
        const MIN_BMI_DISPLAY = 12;
        const MAX_BMI_DISPLAY = 40;
        let pointerPercentage = (bmi - MIN_BMI_DISPLAY) / (MAX_BMI_DISPLAY - MIN_BMI_DISPLAY) * 100;
        pointerPercentage = Math.max(0, Math.min(100, pointerPercentage)); // Clamp between 0 and 100
        bmiPointer.style.left = `${pointerPercentage}%`;

        bmiValueEl.textContent = bmiFormatted;
        bmiCategoryStrongEl.textContent = category;
        bmiCategoryEl.className = categoryClass;

        resultBox.style.display = 'block';
    }

    calculateBtn.addEventListener('click', calculateBMI);

    // Allow 'Enter' key to trigger calculation
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

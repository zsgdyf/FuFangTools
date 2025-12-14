const EPS = 1e-6;
let globalSolutions = new Set();

function solve (values, forms) {
    if (values.length === 1) {
        if (Math.abs(values[0] - 24) < EPS) {
            let solution = forms[0];
            // 如果解的最外层是括号，则移除它们
            if (solution.startsWith('(') && solution.endsWith(')')) {
                solution = solution.substring(1, solution.length - 1);
            }
            globalSolutions.add(solution);
        }
        return;
    }
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values.length; j++) {
            if (i === j) continue;
            let nextValues = [], nextForms = [];
            for (let k = 0; k < values.length; k++) {
                if (k !== i && k !== j) {
                    nextValues.push(values[k]);
                    nextForms.push(forms[k]);
                }
            }
            const a = values[i], b = values[j];
            const fa = forms[i], fb = forms[j];

            // 去重排序辅助函数
            const sortForms = (s1, s2) => s1 < s2 ? [s1, s2] : [s2, s1];

            const [add1, add2] = sortForms(fa, fb);
            solve([...nextValues, a + b], [...nextForms, `(${add1}+${add2})`]);

            solve([...nextValues, a - b], [...nextForms, `(${fa}-${fb})`]);

            const [mul1, mul2] = sortForms(fa, fb);
            solve([...nextValues, a * b], [...nextForms, `(${mul1}×${mul2})`]);

            if (Math.abs(b) > EPS) solve([...nextValues, a / b], [...nextForms, `(${fa}÷${fb})`]);
        }
    }
}

function getPermutations (arr) {
    if (arr.length <= 1) return [arr];
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
        const remainingPerms = getPermutations(remaining);
        for (let perm of remainingPerms) {
            result.push([current].concat(perm));
        }
    }
    return result;
}

const inputs = document.querySelectorAll('.tool-input');

inputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length >= 2 && idx < inputs.length - 1) {
            inputs[idx + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (idx < inputs.length - 1) {
                inputs[idx + 1].focus();
                if (inputs[idx + 1].value) inputs[idx + 1].select();
            } else if (e.key === 'Enter') {
                runSolver();
                input.blur();
            }
        }
        if (e.key === 'Backspace' && e.target.value === '' && idx > 0) {
            inputs[idx - 1].focus();
        }
    });
});

function runSolver () {
    const nums = Array.from(inputs).map(i => i.value);
    if (nums.some(n => n === '')) {
        const emptyIdx = nums.findIndex(n => n === '');
        if (emptyIdx !== -1) inputs[emptyIdx].focus();
        return;
    }

    globalSolutions.clear();
    const resultBox = document.getElementById('resultBox');
    const grid = document.getElementById('grid');
    const countBadge = document.getElementById('countBadge');
    const statusText = document.getElementById('statusText');

    resultBox.style.display = 'block';
    grid.innerHTML = '';

    const floatNums = nums.map(Number);
    const strExprs = floatNums.map(n => Number.isInteger(n) ? String(n) : String(n));

    const permsIndices = getPermutations([0, 1, 2, 3]);
    permsIndices.forEach(indices => {
        const orderedVals = indices.map(i => floatNums[i]);
        const orderedForms = indices.map(i => strExprs[i]);
        solve(orderedVals, orderedForms);
    });

    const sortedSolutions = Array.from(globalSolutions).sort((a, b) => a.length - b.length);
    countBadge.textContent = sortedSolutions.length;

    if (sortedSolutions.length === 0) {
        statusText.textContent = "无解";
        grid.innerHTML = '<div class="no-solution">🤔 这组数字无法算出 24</div>';
    } else {
        statusText.textContent = "发现解法";
        sortedSolutions.forEach((sol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = sol;
            card.style.animationDelay = `${index * 0.02}s`;
            grid.appendChild(card);
        });
    }
}

function clearAll () {
    inputs.forEach(input => { input.value = ''; });
    document.getElementById('resultBox').style.display = 'none';
    document.getElementById('grid').innerHTML = '';
    inputs[0].focus();
}
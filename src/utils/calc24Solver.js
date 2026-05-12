/**
 * 24点计算器核心算法
 * 通过穷举所有数字排列和运算符组合，找出所有能得到 24 的表达式
 *
 * 算法思路：
 * 1. 枚举4个数字的所有排列 (4! = 24 种)
 * 2. 对每种排列，递归地选取两个数进行四则运算
 * 3. 将运算结果放回数组，继续递归直到只剩一个数
 * 4. 判断最终结果是否等于 24（考虑浮点精度）
 */

/** 浮点数精度阈值 */
const EPS = 1e-6

/**
 * 递归求解函数
 * @param {number[]} values - 当前可用的数值数组
 * @param {string[]} forms - 对应的表达式字符串数组
 * @param {Set<string>} solutions - 收集所有解的集合（用于去重）
 */
function solve (values, forms, solutions) {
  // 递归终止条件：只剩一个数时，检查是否等于 24
  if (values.length === 1) {
    if (Math.abs(values[0] - 24) < EPS) {
      let solution = forms[0]
      // 移除最外层多余的括号
      if (solution.startsWith('(') && solution.endsWith(')')) {
        solution = solution.substring(1, solution.length - 1)
      }
      solutions.add(solution)
    }
    return
  }

  // 枚举所有两个数的组合
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      if (i === j) continue

      // 构建除选中两个数之外的剩余数组
      const nextValues = []
      const nextForms = []
      for (let k = 0; k < values.length; k++) {
        if (k !== i && k !== j) {
          nextValues.push(values[k])
          nextForms.push(forms[k])
        }
      }

      const a = values[i]
      const b = values[j]
      const fa = forms[i]
      const fb = forms[j]

      // 去重排序辅助函数：对于交换律运算（加法、乘法），统一排序避免重复解
      const sortForms = (s1, s2) => s1 < s2 ? [s1, s2] : [s2, s1]

      // 加法（满足交换律，排序去重）
      const [add1, add2] = sortForms(fa, fb)
      solve([...nextValues, a + b], [...nextForms, `(${add1}+${add2})`], solutions)

      // 减法（不满足交换律，不排序）
      solve([...nextValues, a - b], [...nextForms, `(${fa}-${fb})`], solutions)

      // 乘法（满足交换律，排序去重）
      const [mul1, mul2] = sortForms(fa, fb)
      solve([...nextValues, a * b], [...nextForms, `(${mul1}×${mul2})`], solutions)

      // 除法（避免除以零）
      if (Math.abs(b) > EPS) {
        solve([...nextValues, a / b], [...nextForms, `(${fa}÷${fb})`], solutions)
      }
    }
  }
}

/**
 * 生成数组的所有排列
 * @param {any[]} arr - 输入数组
 * @returns {any[][]} 所有排列的二维数组
 */
function getPermutations (arr) {
  if (arr.length <= 1) return [arr]

  const result = []
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1))
    const remainingPerms = getPermutations(remaining)
    for (const perm of remainingPerms) {
      result.push([current].concat(perm))
    }
  }
  return result
}

/**
 * 24点计算器主入口函数
 * @param {number[]} nums - 4个输入数字
 * @returns {string[]} 按表达式长度排序的所有解法数组
 */
export function solveCalc24 (nums) {
  const solutions = new Set()

  // 将数字转为字符串表达式
  const strExprs = nums.map(n => Number.isInteger(n) ? String(n) : String(n))

  // 枚举所有排列顺序
  const permsIndices = getPermutations([0, 1, 2, 3])
  permsIndices.forEach(indices => {
    const orderedVals = indices.map(i => nums[i])
    const orderedForms = indices.map(i => strExprs[i])
    solve(orderedVals, orderedForms, solutions)
  })

  // 按表达式长度排序后返回
  return Array.from(solutions).sort((a, b) => a.length - b.length)
}

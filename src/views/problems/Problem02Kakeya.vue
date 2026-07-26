<!--
  Problem02Kakeya.vue - 二维挂谷猜想动态图示
-->
<template>
  <div class="problem-container">
    <!-- 题目展示卡片 -->
    <section class="problem-card">
      <div class="problem-header">
        <div class="problem-title">
          <span>🌟 经典数学猜想</span>
        </div>
        <span class="problem-tag">二维挂谷猜想 (Kakeya Conjecture)</span>
      </div>
      <div class="problem-content">
        <strong>挂谷问题 (Kakeya Problem)：</strong>1917年，日本数学家挂谷宗一（Soichi Kakeya）提出了一个著名的问题：“在平面上，能使长度为 1 的线段（针）在其中连续转动 360°（或180°使其完全调转方向）的图形中，面积最小的是什么图形？”<br><br>
        一开始，许多数学家（包括挂谷本人）认为最小面积的图形是<strong>三尖瓣形（Deltoid）</strong>。但到了1919年，俄罗斯数学家亚伯兰·贝西科维奇（Abram Besicovitch）给出了一个惊人的证明：<strong>不存在面积最小的图形！</strong>因为你可以构造出一个面积“任意小”（极限为0）的图形，依然能让这根针在里面完全掉头。
      </div>
    </section>

    <!-- 交互式可视化实验室 -->
    <section class="vis-section">
      <div class="vis-header">
        <div class="vis-title">🔬 挂谷集构造动画实验室</div>
        <div class="vis-desc">选择不同的图形，观察长度固定的“针”是如何在其中旋转的。最后探索贝西科维奇是如何利用“佩龙树”将面积无限压缩的。</div>
      </div>

      <div class="controls">
        <button
          :class="['ctrl-btn', currentMode === 'circle' ? 'active-kakeya' : 'inactive']"
          @click="switchMode('circle')"
        >
          <span>🔴 圆形 (面积 ≈ 0.785)</span>
        </button>
        <button
          :class="['ctrl-btn', currentMode === 'triangle' ? 'active-kakeya' : 'inactive']"
          @click="switchMode('triangle')"
        >
          <span>🔺 等边三角形 (面积 ≈ 0.577)</span>
        </button>
        <button
          :class="['ctrl-btn', currentMode === 'deltoid' ? 'active-kakeya' : 'inactive']"
          @click="switchMode('deltoid')"
        >
          <span>🌸 三尖瓣形 (面积 ≈ 0.393)</span>
        </button>
        <button
          :class="['ctrl-btn', currentMode === 'perron' ? 'active-kakeya-special' : 'inactive']"
          @click="switchMode('perron')"
        >
          <span>🌲 佩龙树面积压缩 (极限趋于 0)</span>
        </button>
      </div>

      <div class="canvas-container" title="挂谷猜想动态演示">
        <canvas ref="kakeyaCanvas"></canvas>
      </div>

      <div :class="['info-panel', currentData.panelClass]">
        <div class="panel-header">
          <span class="panel-title">📊 图形特性解析</span>
        </div>
        <div v-html="currentData.desc"></div>
      </div>
    </section>

    <!-- 详细解答过程 -->
    <section class="solution-section">
      <h2 class="solution-title">📐 贝西科维奇证明的数学原理</h2>

      <div class="step-card">
        <h3>💡 核心思想：鲍尔平移 (Páll's shift)</h3>
        <p>要想缩小面积，关键在于如何让原本分散的面积尽可能重叠。鲍尔平移提供了一种绝妙的方法：</p>
        <ul>
          <li>想象一个高为 1 的三角形。一根长度为 1 的针可以从三角形的一个底角滑动到顶点，从而旋转一定角度。</li>
          <li>如果我们把这个大三角形从顶点到底边切成两半（两个小三角形），然后将这两个小三角形沿着底边向内平移，直到它们的底边部分重叠。</li>
          <li><strong>奇迹发生了：</strong>两个三角形的总面积因为重叠而变小了！但是，那根针依然可以先在左边的三角形里旋转，然后平移到重叠部分，再过渡到右边的三角形里继续旋转。针的旋转总角度没有改变！</li>
        </ul>
      </div>

      <div class="step-card official">
        <h3>🌲 极限构造：佩龙树 (Perron Tree)</h3>
        <p>基于鲍尔平移，我们可以不断地进行这个过程，从而构造出面积趋于 0 的“佩龙树”：</p>
        <ul>
          <li><strong>第一步：</strong>将一个大三角形切成 2 个，平移重叠，面积减小。</li>
          <li><strong>第二步：</strong>将这 2 个三角形分别再切成 2 个（共4个），将这 4 个“树枝”再次平移重叠，面积进一步减小，看起来就像一棵长满枝桠的树（佩龙树）。</li>
          <li><strong>无限重复：</strong>如果我们把三角形切分成 $2^n$ 份并重叠，当 $n \to \infty$ 时，重叠部分极其密集，树的“树干”面积趋于 0，“树冠”也通过某种方式可以被压缩。</li>
          <li><strong>最终结论：</strong>通过巧妙地排列一组这样的佩龙树（通常是 6 棵，每棵覆盖 60° 方向），贝西科维奇构造出了一个面积可以任意小，但包含所有方向上长度为 1 的线段的集合——即<strong>贝西科维奇集（挂谷集）</strong>。</li>
        </ul>
      </div>

      <div class="summary-box">
        <h4>🌟 挂谷猜想的现代意义</h4>
        <p>
          虽然二维平面上的挂谷问题在 1919 年就被解决了，但高维空间（$n \ge 3$）的挂谷猜想至今仍未被完全证明或证伪！<br><br>
          令人惊奇的是，这个看似属于纯粹几何的游戏，竟然在现代数学中与<strong>调和分析、偏微分方程（波动方程）、解析数论（多项式方法）</strong>等前沿领域产生了极深的联系。陶哲轩（Terence Tao）等菲尔兹奖得主都曾在高维挂谷猜想上做出过重要贡献。
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const kakeyaCanvas = ref(null)
const currentMode = ref('circle')
let animationId = null
let startTime = 0

// 动画状态参数
const L = 160 // 针的长度 (可视缩放基准)

const modes = {
  circle: {
    desc: '<strong>圆形：</strong>最直观的挂谷集。直径为 1 的圆面积为 $\\frac{\\pi}{4} \\approx 0.785$。针围绕圆心旋转，完美无阻。',
    panelClass: ''
  },
  triangle: {
    desc: '<strong>等边三角形：</strong>高为 1 的等边三角形，面积为 $\\frac{\\sqrt{3}}{3} \\approx 0.577$。针的端点沿着三角形的边滑动，可以在三角形内部完成 60° 的方向扭转，通过组合可以完成180°旋转。',
    panelClass: ''
  },
  deltoid: {
    desc: '<strong>三尖瓣形 (Deltoid)：</strong>在一个特定的三尖瓣形中，可以在任何方向放置一条长度为 1 的切线。面积为 $\\frac{\\pi}{8} \\approx 0.393$。挂谷宗一曾错误地猜测这是最小面积。',
    panelClass: ''
  },
  perron: {
    desc: '<strong>佩龙树面积压缩：</strong>演示鲍尔平移（Páll\'s shift）。将三角形切开并重叠底边，使得<strong>旋转角度不变，但占据的总面积显著减小</strong>。不断细分即可让面积趋于0！',
    panelClass: 'panel-special'
  }
}

const currentData = computed(() => modes[currentMode.value])

function switchMode(mode) {
  currentMode.value = mode
  startTime = Date.now()
}

function renderMath() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise().catch(err => console.error('MathJax error:', err))
  } else {
    setTimeout(renderMath, 150)
  }
}

watch(currentMode, () => {
  setTimeout(renderMath, 100)
})

// 动画渲染主循环
function drawFrame() {
  const canvas = kakeyaCanvas.value
  if (!canvas) {
    animationId = requestAnimationFrame(drawFrame)
    return
  }
  
  const ctx = canvas.getContext('2d')
  const containerWidth = canvas.parentElement.clientWidth || 860
  const displayWidth = Math.min(900, containerWidth - 30)
  const displayHeight = 450 // 固定高度
  const dpr = window.devicePixelRatio || 1
  
  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  canvas.width = displayWidth * dpr
  canvas.height = displayHeight * dpr
  
  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, displayWidth, displayHeight)
  
  const cx = displayWidth / 2
  const cy = displayHeight / 2
  
  const t = (Date.now() - startTime) / 1000 // elapsed time in seconds

  if (currentMode.value === 'circle') {
    // 绘制圆
    const r = L / 2
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(14, 165, 233, 0.1)'
    ctx.fill()
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制旋转的针
    const angle = t * 1.5 // 旋转速度
    const x1 = cx - Math.cos(angle) * r
    const y1 = cy - Math.sin(angle) * r
    const x2 = cx + Math.cos(angle) * r
    const y2 = cy + Math.sin(angle) * r
    
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
    
  } else if (currentMode.value === 'triangle') {
    // 绘制等边三角形 (高为 L)
    const h = L
    const a = 2 * h / Math.sqrt(3) // 边长
    
    const p1 = { x: cx, y: cy - h * 2 / 3 } // 顶点
    const p2 = { x: cx - a / 2, y: cy + h / 3 } // 左底角
    const p3 = { x: cx + a / 2, y: cy + h / 3 } // 右底角
    
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(14, 165, 233, 0.1)'
    ctx.fill()
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 针在三角形内滑动旋转 (在夹角为60度的两边上滑动)
    // 简单的参数化：让针的一个端点在一条边上，长度为 L，限制在三角形内。
    // 为了简化动画演示，使针在 p2 (底角) 到 p1 的边 和 p2 到 p3 的边之间转动。
    
    // 周期性滑动，每3秒一个来回
    const phase = (Math.sin(t * 2) + 1) / 2 // 0 to 1
    // angle from 0 to 60 degrees (0 to PI/3) relative to the bottom edge
    const angle = phase * (Math.PI / 3) 
    
    // 针的长度为 L。我们让针保持一端在左侧边，一端在底边。
    // 左侧边与底边夹角为 60度。针端点坐标：A 在底边，B在左边。
    // A = p2.x + x_a, p2.y
    // B 在线上，B_x = p2.x + x_b*cos(60), B_y = p2.y - x_b*sin(60)
    // 根据正弦定理，A和B的距离为L。
    // a_len = L * sin(60 - angle) / sin(60)
    // b_len = L * sin(angle) / sin(60)
    const sin60 = Math.sin(Math.PI / 3)
    const a_len = L * Math.sin(Math.PI / 3 - angle) / sin60
    const b_len = L * Math.sin(angle) / sin60
    
    const needleX1 = p2.x + a_len
    const needleY1 = p2.y
    const needleX2 = p2.x + b_len * Math.cos(Math.PI / 3)
    const needleY2 = p2.y - b_len * Math.sin(Math.PI / 3)
    
    ctx.beginPath()
    ctx.moveTo(needleX1, needleY1)
    ctx.lineTo(needleX2, needleY2)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // 绘制滑动轨迹辅助线
    ctx.beginPath()
    ctx.arc(needleX1, needleY1, 4, 0, Math.PI*2)
    ctx.arc(needleX2, needleY2, 4, 0, Math.PI*2)
    ctx.fillStyle = '#10b981'
    ctx.fill()
    
  } else if (currentMode.value === 'deltoid') {
    // 绘制三尖瓣形
    const r = L / 4 // 参数方程中的 r
    const drawDeltoid = (ctx, cx, cy, r) => {
      ctx.beginPath()
      for(let theta = 0; theta <= Math.PI * 2 + 0.1; theta += 0.05) {
        const x = cx + 2 * r * Math.cos(theta) + r * Math.cos(2 * theta)
        const y = cy + 2 * r * Math.sin(theta) - r * Math.sin(2 * theta)
        if (theta === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
    }
    
    drawDeltoid(ctx, cx, cy, r)
    ctx.fillStyle = 'rgba(14, 165, 233, 0.1)'
    ctx.fill()
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 针在三尖瓣内滑动并相切
    // 在 Deltoid 中，长度为 4r 的切线段端点始终在曲线上，且切点在中间滑动。
    // 针的倾斜角 alpha = theta / 2
    const theta = (t * 1.5) % (Math.PI * 2)
    
    // 两个端点的参数（数学性质：相差 2/3 * PI 并不是端点，端点是切线的交点，实际上端点的坐标参数有复杂关系。
    // 为了平滑演示，我们可以直接利用切线角度 alpha。Deltoid的一条切线角度为 alpha 时，它上面的线段长度 4r 刚好两头碰到边界）
    const alpha = -theta / 2
    const tangentPointX = cx + 2 * r * Math.cos(theta) + r * Math.cos(2 * theta)
    const tangentPointY = cy + 2 * r * Math.sin(theta) - r * Math.sin(2 * theta)
    
    // 根据几何特性，这条长度为 L (4r) 的切线段的中点轨迹是一个圆（内切圆），圆心在原点，半径为 r。
    const midX = cx + r * Math.cos(-alpha)
    const midY = cy + r * Math.sin(-alpha)
    
    // 针的两个端点
    const nx1 = midX + (L / 2) * Math.cos(-alpha + Math.PI/2)
    const ny1 = midY + (L / 2) * Math.sin(-alpha + Math.PI/2)
    const nx2 = midX - (L / 2) * Math.cos(-alpha + Math.PI/2)
    const ny2 = midY - (L / 2) * Math.sin(-alpha + Math.PI/2)
    
    ctx.beginPath()
    ctx.moveTo(nx1, ny1)
    ctx.lineTo(nx2, ny2)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(tangentPointX, tangentPointY, 3, 0, Math.PI*2)
    ctx.fillStyle = '#10b981'
    ctx.fill()

  } else if (currentMode.value === 'perron') {
    // 佩龙树 (Páll's shift) 演示
    const h = L * 1.2
    const base = h * 0.8 // 窄高的三角形
    const baseY = cy + h / 2
    const topY = cy - h / 2
    
    // 动画周期: 0~1 (原三角形), 1~2 (劈开), 2~3 (平移重叠), 3~4 (保持), >4 (循环)
    const cycle = (t * 0.8) % 4
    
    let shiftDist = 0
    let splitDist = 0
    
    if (cycle < 1) {
      // 保持原始
    } else if (cycle < 1.5) {
      // 劈开并拉开一点距离
      splitDist = (cycle - 1) * 2 * 20
    } else if (cycle < 2) {
      splitDist = 20
    } else if (cycle < 3) {
      // 鲍尔平移：沿着底边相互靠近并重叠
      splitDist = 20
      shiftDist = (cycle - 2) * (base / 1.5 + 20) 
    } else {
      // 保持重叠状态
      splitDist = 20
      shiftDist = base / 1.5 + 20
    }
    
    // 绘制左半边
    ctx.beginPath()
    ctx.moveTo(cx - splitDist - shiftDist, topY) // 顶点
    ctx.lineTo(cx - splitDist - base/2 - shiftDist, baseY) // 左下角
    ctx.lineTo(cx - splitDist - shiftDist, baseY) // 右下角 (原底边中点)
    ctx.closePath()
    ctx.fillStyle = 'rgba(14, 165, 233, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // 绘制右半边
    ctx.beginPath()
    ctx.moveTo(cx + splitDist + shiftDist, topY) // 顶点
    ctx.lineTo(cx + splitDist + shiftDist, baseY) // 左下角 (原底边中点)
    ctx.lineTo(cx + splitDist + base/2 + shiftDist, baseY) // 右下角
    ctx.closePath()
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)' // 橙色透明
    ctx.fill()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // 绘制重叠提示文字
    if (cycle > 2.5) {
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('▼ 面积缩小，但保留了所有的旋转方向', cx, topY - 20)
    }
  }
  
  ctx.restore()
  animationId = requestAnimationFrame(drawFrame)
}

onMounted(() => {
  startTime = Date.now()
  animationId = requestAnimationFrame(drawFrame)
  renderMath()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
@import '../../styles/fun-problems.css';

.active-kakeya {
  background-color: #0ea5e9;
  color: white;
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.3);
}

.active-kakeya-special {
  background-color: #10b981;
  color: white;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.panel-special {
  background: #ecfdf5;
  color: #047857;
  border-color: #a7f3d0;
  border-left-color: #10b981;
}

.canvas-container {
  min-height: 450px;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

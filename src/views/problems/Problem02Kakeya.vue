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
          :class="['ctrl-btn', currentMode === 'pall' ? 'active-kakeya-special' : 'inactive']"
          @click="switchMode('pall')"
        >
          <span>✂️ 鲍尔平移 (Páll's shift)</span>
        </button>
        <button
          :class="['ctrl-btn', currentMode === 'perron' ? 'active-kakeya-special' : 'inactive']"
          @click="switchMode('perron')"
        >
          <span>🌲 佩龙树面积压缩 (Perron Tree)</span>
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
          虽然二维平面上的挂谷问题在 1919 年就被解决了，但高维空间（$n \ge 3$）的挂谷猜想在很长一段时间内悬而未决。<br><br>
          令人振奋的是，就在 <strong>2025年2月</strong>，中国数学家<strong>王虹</strong>与合作者约书亚·扎尔（Joshua Zahl）成功证明了<strong>三维挂谷猜想</strong>，彻底解决了这个困扰数学界百年的难题！凭借在三维挂谷猜想等领域的卓越贡献，王虹在 <strong>2026年7月</strong> 荣获了数学界最高荣誉<strong>菲尔兹奖</strong>，成为中国籍数学家首次获得此项殊荣的人。<br><br>
          这证明了，这个看似属于纯粹几何的游戏，实际上在现代数学中与<strong>调和分析、偏微分方程（波动方程）、解析数论（多项式方法）</strong>等前沿领域产生了极深远的联系。
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
    desc: '<strong>等边三角形：</strong>高为 1 的等边三角形，面积为 $\\frac{\\sqrt{3}}{3} \\approx 0.577$。针的端点沿着三角形的边滑动，经历“滑动-旋转-滑动-旋转-滑动-旋转”六个阶段，可以在三角形内部完成完整的 180° 完全调头！',
    panelClass: ''
  },
  deltoid: {
    desc: '<strong>三尖瓣形 (Deltoid)：</strong>在一个特定的三尖瓣形中，可以在任何方向放置一条长度为 1 的线段，且它的<strong>两个端点始终完美贴合在曲线上</strong>。面积为 $\\frac{\\pi}{8} \\approx 0.393$。挂谷宗一曾错误地猜测这是最小面积。',
    panelClass: ''
  },
  pall: {
    desc: '<strong>鲍尔平移 (Páll\'s shift)：</strong>将三角形从顶点劈开，并将两半沿着底边向内平移重叠。<strong>旋转角度没有丢失，但占据的总面积显著减小！</strong>',
    panelClass: 'panel-special'
  },
  perron: {
    desc: '<strong>佩龙树面积压缩：</strong>将鲍尔平移无限细分！将三角形切分成 $2^n$ 份并让底边高度重叠。随着层级加深，图形像树枝一样散开，覆盖所有角度，但“树干”面积极度收缩。',
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
    
    const p1 = { x: cx, y: cy - h * 2 / 3 } // 顶点 (Top)
    const p2 = { x: cx - a / 2, y: cy + h / 3 } // 左底角 (Bottom-Left)
    const p3 = { x: cx + a / 2, y: cy + h / 3 } // 右底角 (Bottom-Right)
    
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
    
    // 实现完整的 180 度调头状态机 (6个阶段，每阶段1.5秒)
    const stageDuration = 1.5
    const cycleTime = 6 * stageDuration
    const currentT = t % cycleTime
    const stage = Math.floor(currentT / stageDuration)
    const progress = (currentT % stageDuration) / stageDuration
    // 使用 easeInOut 平滑过渡
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
    
    let needleX1, needleY1, needleX2, needleY2
    
    if (stage === 0) {
      // 阶段 0: 绕左底角 p2 旋转
      const angle = -Math.PI / 3 + ease * (Math.PI / 3)
      needleX1 = p2.x + L * Math.cos(angle)
      needleY1 = p2.y + L * Math.sin(angle)
      needleX2 = p2.x
      needleY2 = p2.y
    } else if (stage === 1) {
      // 阶段 1: 沿底边向右滑动
      needleX2 = p2.x + ease * (a - L)
      needleY2 = p2.y
      needleX1 = needleX2 + L
      needleY1 = p2.y
    } else if (stage === 2) {
      // 阶段 2: 绕右底角 p3 旋转
      const angle = Math.PI + ease * (Math.PI / 3)
      needleX1 = p3.x + L * Math.cos(angle)
      needleY1 = p3.y + L * Math.sin(angle)
      needleX2 = p3.x
      needleY2 = p3.y
    } else if (stage === 3) {
      // 阶段 3: 沿右侧边向上滑动
      const dx = -0.5, dy = -Math.sqrt(3) / 2
      const slideDist = ease * (a - L)
      needleX2 = p3.x + slideDist * dx
      needleY2 = p3.y + slideDist * dy
      needleX1 = needleX2 + L * dx
      needleY1 = needleY2 + L * dy
    } else if (stage === 4) {
      // 阶段 4: 绕顶部顶点 p1 旋转
      const angle = Math.PI / 3 + ease * (Math.PI / 3)
      needleX2 = p1.x + L * Math.cos(angle)
      needleY2 = p1.y + L * Math.sin(angle)
      needleX1 = p1.x
      needleY1 = p1.y
    } else if (stage === 5) {
      // 阶段 5: 沿左侧边向下滑动
      const dx = -0.5, dy = Math.sqrt(3) / 2
      const slideDist = ease * (a - L)
      needleX1 = p1.x + slideDist * dx
      needleY1 = p1.y + slideDist * dy
      needleX2 = needleX1 + L * dx
      needleY2 = needleY1 + L * dy
    }
    
    ctx.beginPath()
    ctx.moveTo(needleX1, needleY1)
    ctx.lineTo(needleX2, needleY2)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // 绘制两端端点
    ctx.beginPath()
    ctx.arc(needleX1, needleY1, 4, 0, Math.PI*2)
    ctx.arc(needleX2, needleY2, 4, 0, Math.PI*2)
    ctx.fillStyle = '#10b981'
    ctx.fill()
    
  } else if (currentMode.value === 'deltoid') {
    // 绘制三尖瓣形
    const r = L / 4 // 参数方程中的 r，使得相切线段长为 4r = L
    const drawDeltoid = (ctx, cx, cy, r) => {
      ctx.beginPath()
      for(let theta = 0; theta <= Math.PI * 2 + 0.1; theta += 0.02) {
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
    
    // 针在三尖瓣内旋转并完美相切，且端点落在曲线上
    // 根据数学特性，长度为 4r 的切线段，其中点在一个半径为 r 的内切圆上移动。
    // 切线角度设为 alpha
    const alpha = (t * 1.5) % (Math.PI * 2)
    
    // 中点坐标 (位于半径为 r 的内切圆上，相位为 -2 * alpha)
    const midX = cx + r * Math.cos(2 * alpha)
    const midY = cy - r * Math.sin(2 * alpha)
    
    // 针的两个端点 (从中点向两端延伸 2r)
    const nx1 = midX + 2 * r * Math.cos(alpha)
    const ny1 = midY + 2 * r * Math.sin(alpha)
    
    const nx2 = midX - 2 * r * Math.cos(alpha)
    const ny2 = midY - 2 * r * Math.sin(alpha)
    
    // 切点 (参数 theta = -2 * alpha)
    const theta = -2 * alpha
    const tx = cx + 2 * r * Math.cos(theta) + r * Math.cos(2 * theta)
    const ty = cy + 2 * r * Math.sin(theta) - r * Math.sin(2 * theta)
    
    ctx.beginPath()
    ctx.moveTo(nx1, ny1)
    ctx.lineTo(nx2, ny2)
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()
    
    // 绘制端点，展示它们完美贴在曲线上
    ctx.beginPath()
    ctx.arc(nx1, ny1, 4, 0, Math.PI*2)
    ctx.arc(nx2, ny2, 4, 0, Math.PI*2)
    ctx.fillStyle = '#10b981'
    ctx.fill()
    
    // 绘制切点，证明它不仅在针上，而且在曲线上
    ctx.beginPath()
    ctx.arc(tx, ty, 3, 0, Math.PI*2)
    ctx.fillStyle = '#f59e0b'
    ctx.fill()

  } else if (currentMode.value === 'pall') {
    // 鲍尔平移 (Páll's shift) 演示
    const h = L
    const base = h * 1.2
    const baseY = cy + h / 2
    const topY = cy - h / 2
    
    // 动画周期: 0~1 (原三角形), 1~2 (拉开), 2~3 (平移重叠), 3~4 (保持), >4 (循环)
    const cycle = (t * 0.7) % 4
    let progress = cycle % 1
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
    
    let splitDist = 0
    let overlapDist = 0
    
    if (cycle < 1) {
      splitDist = 0; overlapDist = 0
    } else if (cycle < 2) {
      splitDist = ease * 30; overlapDist = 0
    } else if (cycle < 3) {
      splitDist = 30; overlapDist = ease * (base / 2 + 10)
    } else {
      splitDist = 30; overlapDist = base / 2 + 10
    }
    
    // 左边一半
    ctx.beginPath()
    ctx.moveTo(cx - splitDist + overlapDist, topY) // 顶点
    ctx.lineTo(cx - splitDist - base/2 + overlapDist, baseY) // 左底
    ctx.lineTo(cx - splitDist + overlapDist, baseY) // 右底
    ctx.closePath()
    ctx.fillStyle = 'rgba(14, 165, 233, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 右边一半
    ctx.beginPath()
    ctx.moveTo(cx + splitDist - overlapDist, topY) // 顶点
    ctx.lineTo(cx + splitDist - overlapDist, baseY) // 左底
    ctx.lineTo(cx + splitDist + base/2 - overlapDist, baseY) // 右底
    ctx.closePath()
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.stroke()
    
    if (cycle > 2.5) {
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('▼ 底部重叠，使得总面积变小，但旋转角度保留', cx, topY - 20)
    }
    
  } else if (currentMode.value === 'perron') {
    // 佩龙树 (Perron Tree) 级数演示
    // 动画展示树的不断生长分叉，级别从 0 到 4
    const h = L * 1.3
    const baseY = cy + h / 2
    const topY = cy - h / 2
    const baseW = L * 2 // 树冠顶部散开的总宽度
    const bottomW = L * 0.3 // 底部重叠后压缩的基底宽度
    
    // 级别切换：每2秒增加一级，最高4级，然后重置
    const level = Math.floor((t * 0.6) % 5)
    const numTriangles = Math.pow(2, level)
    
    ctx.fillStyle = '#475569'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`佩龙树细分层级: ${level} (共 ${numTriangles} 个三角形)`, cx, topY - 20)
    
    for (let i = 0; i < numTriangles; i++) {
      // 顶点均匀分布在顶部 baseW 内
      const tx = numTriangles === 1 ? cx : cx - baseW/2 + i * (baseW / (numTriangles - 1))
      // 底边中心紧密排列在 bottomW 内
      const bx = numTriangles === 1 ? cx : cx - bottomW/2 + i * (bottomW / (numTriangles - 1))
      const triangleBase = baseW / numTriangles
      
      ctx.beginPath()
      ctx.moveTo(tx, topY) // 顶点
      ctx.lineTo(bx - triangleBase / 2, baseY) // 左底
      ctx.lineTo(bx + triangleBase / 2, baseY) // 右底
      ctx.closePath()
      
      // 交替颜色展示树干的重叠
      ctx.fillStyle = i % 2 === 0 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(245, 158, 11, 0.15)'
      ctx.fill()
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(14, 165, 233, 0.6)' : 'rgba(245, 158, 11, 0.6)'
      ctx.lineWidth = 1
      ctx.stroke()
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

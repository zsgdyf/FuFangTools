<!--
  Problem01Hyperbola.vue - 2022年全国乙卷理科第11题
-->
<template>
  <div class="problem-container">
    <!-- 题目展示卡片 -->
    <section class="problem-card">
      <div class="problem-header">
        <div class="problem-title">
          <span>📝 真题题目</span>
        </div>
        <span class="problem-tag">2022·全国乙卷理科·第11题（选择题 / 4分）</span>
      </div>
      <div class="problem-content">
        双曲线 $C$ 的两个焦点为 $F_1, F_2$，以 $C$ 的实轴为直径的圆记为 $D$，过 $F_1$ 作 $D$ 的切线与 $C$ 交于 $M, N$ 两点，且 $\cos \angle F_1NF_2 = \frac{3}{5}$，则 $C$ 的离心率为 ( &nbsp;&nbsp;&nbsp;&nbsp; )
      </div>
      <div class="options-grid">
        <div class="option-item highlight-a">
          <div><strong>A.</strong> $\frac{\sqrt{5}}{2}$</div>
          <span class="option-badge badge-a">民间硬核隐藏解 (交于左支)</span>
        </div>
        <div class="option-item">
          <div><strong>B.</strong> $\frac{3}{2}$</div>
        </div>
        <div class="option-item highlight-c">
          <div><strong>C.</strong> $\frac{\sqrt{13}}{2}$</div>
          <span class="option-badge badge-c">高考官方标准解 (交于右支)</span>
        </div>
        <div class="option-item">
          <div><strong>D.</strong> $\frac{\sqrt{17}}{2}$</div>
        </div>
      </div>
    </section>

    <!-- 交互式可视化实验室 -->
    <section class="vis-section">
      <div class="vis-header">
        <div class="vis-title">🔬 几何动态交互实验室</div>
        <div class="vis-desc">点击下方按钮切换切线 $F_1N$ 与双曲线的相交分支，直观感受点 $N, F_1, P, Q$ 的共线顺序与空间几何形态变化！</div>
      </div>

      <div class="controls">
        <button
          :class="['ctrl-btn', currentCase === 'right' ? 'active-right' : 'inactive']"
          @click="switchCase('right')"
        >
          <span>🟢 情形一：交点 N 在右支（官方标准解 / 选项 C）</span>
        </button>
        <button
          :class="['ctrl-btn', currentCase === 'left' ? 'active-left' : 'inactive']"
          @click="switchCase('left')"
        >
          <span>🔴 情形二：交点 N 在左支（民间隐藏解 / 选项 A）</span>
        </button>
      </div>

      <div class="canvas-container" @click="openFullscreen" title="点击可全屏放大探索，支持移动端横屏查看">
        <div class="zoom-trigger-badge">
          <span>🔍 点击全屏放大 / 移动端支持旋转横屏</span>
        </div>
        <canvas ref="mathCanvas"></canvas>
      </div>

      <div :class="['info-panel', currentData.panelClass]">
        <div class="panel-header">
          <span class="panel-title">📊 实时几何参数：a = {{ currentData.a }}, b = {{ currentData.b }}, c = {{ currentPts.c.toFixed(3) }}</span>
          <span class="panel-badge">对应离心率 e = {{ currentData.eStr }}</span>
        </div>
        <div v-html="currentData.desc"></div>
      </div>
    </section>

    <!-- 详细解答过程 -->
    <section class="solution-section">
      <h2 class="solution-title">📐 详细解答与推导过程</h2>

      <!-- 核心基础准备 -->
      <div class="step-card">
        <h3>💡 步骤一：共性几何性质探究（切线长与垂足中位线）</h3>
        <p>设双曲线的标准方程为 $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1\ (a>0, b>0)$，其半焦距为 $c = \sqrt{a^2+b^2}$，左右焦点分别为 $F_1(-c, 0), F_2(c, 0)$。</p>
        <ul>
          <li>
            <strong>圆 $D$ 的方程与切线性质：</strong><br>
            以实轴为直径的圆 $D$ 圆心为原点 $O(0,0)$，半径为 $r = a$。过 $F_1$ 作圆 $D$ 的切线，切点记为 $P$。因为 $OP \perp F_1N$，在 Rt$\triangle OPF_1$ 中，斜边 $|OF_1|=c$，直角边 $|OP|=a$，根据勾股定理可得切线长：
            $$\begin{aligned} |F_1P| &= \sqrt{|OF_1|^2 - |OP|^2} \\ &= \sqrt{c^2 - a^2} = b \end{aligned}$$
          </li>
          <li>
            <strong>垂足 $Q$ 与中位线定理（极其巧妙的几何突破口）：</strong><br>
            过右焦点 $F_2$ 作直线 $F_1N$ 的垂线，垂足记为 $Q$。因为 $OP \perp F_1N$ 且 $F_2Q \perp F_1N$，所以 $OP \parallel F_2Q$。<br>
            又因为 $O$ 为线段 $F_1F_2$ 的中点，在 $\triangle F_1QF_2$ 中，$OP$ 为中位线！因此可得垂足 $Q$ 的两大核心几何关系：
            $$\begin{aligned} |F_2Q| &= 2|OP| = 2a \\ |F_1Q| &= 2|F_1P| = 2b \end{aligned}$$
          </li>
          <li>
            <strong>在 Rt$\triangle NQF_2$ 中利用三角函数值：</strong><br>
            题设给出 $\cos \angle F_1NF_2 = \cos \angle QNF_2 = \frac{3}{5}$。设 $|NQ| = 3k\ (k>0)$，则斜边 $|NF_2| = 5k$，直角边 $|F_2Q| = \sqrt{(5k)^2 - (3k)^2} = 4k$。<br>
            结合上面证得的 $|F_2Q| = 2a$，可得 $4k = 2a \implies k = \frac{1}{2}a$。由此得到线段长通解：
            $$\begin{aligned} |NF_2| &= 5k = \frac{5}{2}a \\ |NQ| &= 3k = \frac{3}{2}a \end{aligned}$$
          </li>
        </ul>
      </div>

      <!-- 情形一：交于右支 -->
      <div class="step-card official">
        <h3>🏆 步骤二：情形一 —— 当交点 $N$ 在双曲线右支（高考官方解，对应选项 C）</h3>
        <p>由于题干叙述为“切线与 $C$ 交于 $M, N$ 两点”，默认习惯下当切线与双曲线右支相交于点 $N$ 时：</p>
        <ul>
          <li>
            <strong>利用双曲线右支定义：</strong><br>
            点 $N$ 在右支上，满足 $|NF_1| - |NF_2| = 2a$。将 $|NF_2| = \frac{5}{2}a$ 代入，得：
            $$\begin{aligned} |NF_1| &= |NF_2| + 2a \\ &= \frac{5}{2}a + 2a = \frac{9}{2}a \end{aligned}$$
          </li>
          <li>
            <strong>利用直线上各点共线顺序联立方程：</strong><br>
            如上方图示观察可知，此时直线上点的顺序为 $F_1 - P - Q - N$，垂足 $Q$ 位于线段 $F_1N$ 上。因此有：
            $$|NF_1| = |NQ| + |F_1Q|$$
            将各代数式代入上式：
            $$\begin{aligned} \frac{9}{2}a = \frac{3}{2}a + 2b &\implies 3a = 2b \\ &\implies \frac{b}{a} = \frac{3}{2} \end{aligned}$$
          </li>
          <li>
            <strong>计算双曲线离心率 $e$：</strong><br>
            $$\begin{aligned} e &= \frac{c}{a} = \sqrt{1 + \left(\frac{b}{a}\right)^2} \\ &= \sqrt{1 + \left(\frac{3}{2}\right)^2} = \sqrt{1 + \frac{9}{4}} = \frac{\sqrt{13}}{2} \end{aligned}$$
            所以，官方命题对应的正确答案为 <strong>C</strong>。
          </li>
        </ul>
      </div>

      <!-- 情形二：交于左支 -->
      <div class="step-card hidden-case">
        <h3>🔍 步骤三：情形二 —— 当交点 $N$ 在双曲线左支（硬核探讨解，对应选项 A）</h3>
        <p>值得注意的是，题干叙述中切线与圆 $D$ 只有一个切点 $P$，且由于双曲线有两支，切线完全有可能与左支相交于点 $N$：</p>
        <ul>
          <li>
            <strong>利用双曲线左支定义：</strong><br>
            点 $N$ 在左支上，离左焦点 $F_1$ 更近，满足 $|NF_2| - |NF_1| = 2a$。将 $|NF_2| = \frac{5}{2}a$ 代入，得：
            $$\begin{aligned} |NF_1| &= |NF_2| - 2a \\ &= \frac{5}{2}a - 2a = \frac{1}{2}a \end{aligned}$$
          </li>
          <li>
            <strong>利用直线上各点共线顺序联立方程：</strong><br>
            观察左支情形几何图示可知，此时直线上点的顺序变为 $N - F_1 - P - Q$，即左焦点 $F_1$ 被夹在 $N$ 与垂足 $Q$ 之间！因此有：
            $$|NQ| = |NF_1| + |F_1Q|$$
            将各代数式代入上式：
            $$\begin{aligned} \frac{3}{2}a = \frac{1}{2}a + 2b &\implies a = 2b \\ &\implies \frac{b}{a} = \frac{1}{2} \end{aligned}$$
          </li>
          <li>
            <strong>计算双曲线离心率 $e$：</strong><br>
            $$\begin{aligned} e &= \frac{c}{a} = \sqrt{1 + \left(\frac{b}{a}\right)^2} \\ &= \sqrt{1 + \left(\frac{1}{2}\right)^2} = \sqrt{1 + \frac{1}{4}} = \frac{\sqrt{5}}{2} \end{aligned}$$
            所以，若交点 $N$ 在左支，离心率计算结果为 $\frac{\sqrt{5}}{2}$，对应答案为 <strong>A</strong>。
          </li>
        </ul>
      </div>

      <!-- 真题点评与总结 -->
      <div class="summary-box">
        <h4>🌟 名师深度点评与真题揭秘</h4>
        <p>
          这道 2022 年的高考真题在当年引发了广泛的数学学术讨论。问题的根源在于题目描述“过 $F_1$ 作 $D$ 的切线与 $C$ 交于 $M, N$ 两点”，但在几何上，过焦点 $F_1$ 向圆 $D$ 所作的切线确实可以通过调整 $a, b$ 的比例，使其交点 $N$ 落在双曲线的<strong>右支</strong>（此时 $e=\frac{\sqrt{13}}{2}$，为高考官方评分参考答案 C）或者<strong>左支</strong>（此时 $e=\frac{\sqrt{5}}{2}$，对应选项 A）。<br><br>
          通过本页面上的<strong>交互式动态实验室</strong>，不仅可以精准观察到两种解法下切线、双曲线与垂足 $Q$ 的精妙空间位置，更能深刻理解为何几何图形中“共线点的相对顺序”会直接决定代数推导的走向！
        </p>
      </div>
    </section>

    <!-- 全屏高清图示探索模态框 -->
    <Teleport to="body">
      <div v-if="showFullscreen" class="fullscreen-modal" @click.self="closeFullscreen">
        <div class="modal-content">
          <div class="modal-toolbar">
            <div class="modal-title">
              <span>🔬 几何动态实验室 (高清全屏视图)</span>
              <span class="case-badge" :class="currentCase">{{ currentData.eStr.split(' ')[0] }}</span>
            </div>
            <div class="modal-actions">
              <button class="action-btn" @click="zoomIn" title="放大图示">➕ 放大</button>
              <button class="action-btn" @click="zoomOut" title="缩小图示">➖ 缩小</button>
              <button class="action-btn" @click="resetZoom" title="重置标准缩放">🔄 重置</button>
              <button class="action-btn rotate-btn" @click="toggleRotate" title="旋转90°适配手机竖屏高清查看">
                📱 {{ isRotated ? '还原竖屏方向' : '旋转90° (横屏大图)' }}
              </button>
              <button class="close-btn" @click="closeFullscreen" title="关闭全屏">✕ 关闭</button>
            </div>
          </div>
          <div class="modal-viewport" ref="modalViewport">
            <div class="canvas-wrapper" :style="{ transform: `scale(${zoomLevel}) ${isRotated ? 'rotate(90deg)' : ''}` }">
              <canvas ref="fullscreenCanvas"></canvas>
            </div>
          </div>
          <div class="modal-footer">
            <button class="switch-case-btn" :class="{ active: currentCase === 'right' }" @click="switchCase('right')">
              🟢 情形一：交点 N 在右支 (官方解)
            </button>
            <button class="switch-case-btn" :class="{ active: currentCase === 'left' }" @click="switchCase('left')">
              🔴 情形二：交点 N 在左支 (隐藏解)
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

/** Canvas 引用 */
const mathCanvas = ref(null)
const fullscreenCanvas = ref(null)
const modalViewport = ref(null)

/** 全屏模态框状态与控制 */
const showFullscreen = ref(false)
const zoomLevel = ref(1.0)
const isRotated = ref(false)

function openFullscreen () {
  showFullscreen.value = true
  const w = window.innerWidth
  if (w < 768) {
    zoomLevel.value = Math.max(0.45, Math.min(0.9, Math.round((w - 40) / 900 * 100) / 100))
  } else {
    zoomLevel.value = 1.0
  }
  isRotated.value = false
  nextTick(() => {
    if (fullscreenCanvas.value) {
      drawToCanvas(fullscreenCanvas.value, 900, 600)
    }
  })
}

function closeFullscreen () {
  showFullscreen.value = false
}

function zoomIn () {
  if (zoomLevel.value < 3.0) zoomLevel.value = Math.round((zoomLevel.value + 0.2) * 100) / 100
}

function zoomOut () {
  if (zoomLevel.value > 0.3) zoomLevel.value = Math.round((zoomLevel.value - 0.2) * 100) / 100
}

function resetZoom () {
  const w = window.innerWidth
  if (w < 768 && !isRotated.value) {
    zoomLevel.value = Math.max(0.45, Math.min(0.9, Math.round((w - 40) / 900 * 100) / 100))
  } else if (w < 768 && isRotated.value) {
    zoomLevel.value = Math.max(0.5, Math.min(1.1, Math.round((window.innerHeight - 180) / 900 * 100) / 100))
  } else {
    zoomLevel.value = 1.0
  }
}

function toggleRotate () {
  isRotated.value = !isRotated.value
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 768) {
    if (isRotated.value) {
      zoomLevel.value = Math.max(0.5, Math.min(1.1, Math.round((h - 180) / 900 * 100) / 100))
    } else {
      zoomLevel.value = Math.max(0.45, Math.min(0.9, Math.round((w - 40) / 900 * 100) / 100))
    }
  }
}

/** 当前的情形：'right' 或 'left' */
const currentCase = ref('right')

/** 两种情形的具体几何参数定义 */
const cases = {
  right: {
    a: 2,
    b: 3,
    eStr: '√13 / 2 (官方标准解 · 对应选项 C)',
    desc: '<strong>几何推导要点：</strong>切线与圆切于点 P，与双曲线交于左支 <strong>M</strong> 和右支 <strong>N</strong>。垂足 Q 在直线 F₁N 上，顺序为 F₁ - P - Q - N。<br><strong>线段长关系：</strong>|F₁P| = b, |F₁Q| = 2b, |NQ| = 1.5a, |NF₁| = 4.5a ⇒ 解得 b/a = 3/2。',
    scale: 50,
    offsetY: 350,
    panelClass: '',
    calcPoints: function (a, b) {
      const c = Math.sqrt(a * a + b * b)
      return {
        c: c,
        F1: { x: -c, y: 0 },
        F2: { x: c, y: 0 },
        O: { x: 0, y: 0 },
        P: { x: -a * a / c, y: a * b / c },
        Q: { x: (b * b - a * a) / c, y: 2 * a * b / c },
        M: { x: -38 / (5 * c), y: 18 / (5 * c) },
        N: { x: (2 * b * b - a * a) / c, y: 3 * a * b / c }
      }
    }
  },
  left: {
    a: 2,
    b: 1,
    eStr: '√5 / 2 (民间隐藏解 · 对应选项 A)',
    desc: '<strong>几何推导要点：</strong>切线与双曲线左支交于点 <strong>M</strong> 和点 <strong>N</strong>，焦点 F₁ 被夹在中间，顺序为 N - F₁ - P - Q。<br><strong>线段长关系：</strong>|F₁P| = b, |F₁Q| = 2b, |NQ| = 1.5a, |NF₁| = 0.5a ⇒ 解得 b/a = 1/2。',
    scale: 90,
    offsetY: 320,
    panelClass: 'panel-left',
    calcPoints: function (a, b) {
      const c = Math.sqrt(a * a + b * b)
      return {
        c: c,
        F1: { x: -c, y: 0 },
        F2: { x: c, y: 0 },
        O: { x: 0, y: 0 },
        P: { x: -a * a / c, y: a * b / c },
        Q: { x: (b * b - a * a) / c, y: 2 * a * b / c },
        M: { x: -14 * c / 15, y: 2 * c / 15 },
        N: { x: -c - (b * b) / c, y: -a * b / c }
      }
    }
  }
}

/** 当前情形对应的数据 */
const currentData = computed(() => cases[currentCase.value])

/** 当前情形计算出的关键点坐标 */
const currentPts = computed(() => {
  const d = currentData.value
  return d.calcPoints(d.a, d.b)
})

/**
 * 切换分支情形
 * @param {string} type - 'right' 或 'left'
 */
function switchCase (type) {
  currentCase.value = type
  nextTick(() => {
    render()
  })
}

/**
 * 渲染 MathJax 公式
 */
function renderMath () {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise().catch(err => console.error('MathJax error:', err))
  } else {
    setTimeout(renderMath, 150)
  }
}

/**
 * 执行通用 Canvas 绘制（支持正常卡片视图与高清全屏模态框视图）
 */
function drawToCanvas (canvas, targetWidth, targetHeight) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const dpr = window.devicePixelRatio || 1
  const displayWidth = targetWidth
  const displayHeight = targetHeight

  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  canvas.style.minWidth = displayWidth + 'px'
  canvas.style.minHeight = displayHeight + 'px'
  canvas.width = displayWidth * dpr
  canvas.height = displayHeight * dpr

  ctx.save()
  // 按比缩放到标准 900x600 坐标空间
  ctx.scale(dpr * (displayWidth / 900), dpr * (displayHeight / 600))

  const width = 900
  const height = 600
  const scale = currentData.value.scale
  const offsetX = width / 2
  const offsetY = currentData.value.offsetY || height / 2

  function cx (x) { return offsetX + x * scale }
  function cy (y) { return offsetY - y * scale }

  ctx.clearRect(0, 0, width, height)

  const data = currentData.value
  const pts = currentPts.value

  // 1. 绘制坐标轴与网格
  ctx.beginPath()
  ctx.strokeStyle = '#bdc1c6'
  ctx.lineWidth = 1.5
  ctx.moveTo(0, cy(0))
  ctx.lineTo(width, cy(0))
  ctx.moveTo(cx(0), 0)
  ctx.lineTo(cx(0), height)
  ctx.stroke()

  ctx.fillStyle = '#5f6368'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  for (let i = -10; i <= 10; i++) {
    if (i !== 0) {
      ctx.fillText(i, cx(i), cy(-0.25))
      ctx.beginPath()
      ctx.moveTo(cx(i), cy(0) - 4)
      ctx.lineTo(cx(i), cy(0) + 4)
      ctx.stroke()
    }
  }

  // 2. 绘制三角形 F₁F₂N
  ctx.beginPath()
  ctx.moveTo(cx(pts.F1.x), cy(pts.F1.y))
  ctx.lineTo(cx(pts.N.x), cy(pts.N.y))
  ctx.lineTo(cx(pts.F2.x), cy(pts.F2.y))
  ctx.closePath()
  ctx.fillStyle = currentCase.value === 'right' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(244, 63, 94, 0.08)'
  ctx.fill()
  ctx.strokeStyle = currentCase.value === 'right' ? '#0ea5e9' : '#f43f5e'
  ctx.lineWidth = 2
  ctx.stroke()

  // 3. 绘制以实轴为直径的圆 D
  ctx.beginPath()
  ctx.arc(cx(0), cy(0), data.a * scale, 0, 2 * Math.PI)
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 2
  ctx.stroke()

  // 4. 绘制双曲线左右支
  ctx.strokeStyle = currentCase.value === 'right' ? '#0ea5e9' : '#f43f5e'
  ctx.lineWidth = 2.5
  for (const branch of [1, -1]) {
    ctx.beginPath()
    for (let y = -8; y <= 8; y += 0.02) {
      const x = branch * data.a * Math.sqrt(1 + (y * y) / (data.b * data.b))
      if (y === -8) ctx.moveTo(cx(x), cy(y))
      else ctx.lineTo(cx(x), cy(y))
    }
    ctx.stroke()
  }

  // 5. 绘制切线 F₁N (向两端无限延伸，连接 M 和 N)
  ctx.beginPath()
  const xStart = -8
  const yStart = (data.a / data.b) * (xStart + pts.c)
  const xEnd = 8
  const yEnd = (data.a / data.b) * (xEnd + pts.c)
  ctx.moveTo(cx(xStart), cy(yStart))
  ctx.lineTo(cx(xEnd), cy(yEnd))
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // 6. 绘制垂直的半径 OP (虚线)
  ctx.beginPath()
  ctx.moveTo(cx(pts.O.x), cy(pts.O.y))
  ctx.lineTo(cx(pts.P.x), cy(pts.P.y))
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])

  // 7. 绘制垂线 F₂Q (虚线)
  ctx.beginPath()
  ctx.moveTo(cx(pts.F2.x), cy(pts.F2.y))
  ctx.lineTo(cx(pts.Q.x), cy(pts.Q.y))
  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.stroke()
  ctx.setLineDash([])

  // 8. 绘制并标注关键几何辅助点与交点 M, N
  function drawPoint (pt, color, label, offset = { x: 0, y: -10 }) {
    ctx.beginPath()
    ctx.arc(cx(pt.x), cy(pt.y), 5.5, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    if (label) {
      ctx.fillStyle = color
      ctx.font = 'bold 15px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(label, cx(pt.x) + offset.x, cy(pt.y) + offset.y)
    }
  }

  drawPoint(pts.O, '#64748b', 'O', { x: 8, y: 18 })
  drawPoint(pts.F1, '#f43f5e', 'F₁', { x: -24, y: 22 })
  drawPoint(pts.F2, '#f43f5e', 'F₂', { x: 8, y: 22 })
  drawPoint(pts.P, '#10b981', 'P (切点)', { x: 10, y: -8 })
  drawPoint(pts.Q, '#8b5cf6', 'Q (垂足)', { x: 10, y: 18 })

  if (currentCase.value === 'right') {
    drawPoint(pts.M, '#f59e0b', 'M (交点·左支)', { x: -115, y: -10 })
    drawPoint(pts.N, '#0ea5e9', 'N (交点·右支)', { x: 12, y: 5 })
  } else {
    drawPoint(pts.M, '#f59e0b', 'M (交点2·左支)', { x: -115, y: -12 })
    drawPoint(pts.N, '#f43f5e', 'N (交点1·左支)', { x: -115, y: 15 })
  }

  ctx.restore()
}

function render () {
  const canvas = mathCanvas.value
  if (!canvas) return
  const containerWidth = canvas.parentElement.clientWidth || 860
  const displayWidth = Math.min(900, containerWidth - 30)
  const aspect = 600 / 900
  const displayHeight = Math.round(displayWidth * aspect)

  drawToCanvas(canvas, displayWidth, displayHeight)

  if (showFullscreen.value && fullscreenCanvas.value) {
    drawToCanvas(fullscreenCanvas.value, 900, 600)
  }
}

onMounted(() => {
  render()
  window.addEventListener('resize', render)
  renderMath()
})

onUnmounted(() => {
  window.removeEventListener('resize', render)
})
</script>

<style scoped>
@import '../../styles/fun-problems.css';
</style>

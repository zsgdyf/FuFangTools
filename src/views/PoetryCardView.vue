<!--
  PoetryCardView.vue - 极简卡片与古诗词壁纸生成器
  支持 3D 悬浮视差卡片、国风渐变背景、竖排横排切换、自定义文字和高清 Canvas 离线保存
-->
<template>
  <ToolLayout
    title="古诗词壁纸生成器"
    description="一键生成极简唯美的诗词卡片与手机壁纸"
    container-class="container-wide"
  >
    <div class="poetry-card-wrapper">
      <!-- 左侧：控制面板 -->
      <div class="control-panel">
        <!-- 1. 文本输入与获取 -->
        <div class="panel-section">
          <h3>📜 文本内容</h3>
          <div class="config-item" style="margin-bottom: 12px;">
            <label>诗词正文</label>
            <textarea
              class="tool-input text-area"
              style="height: 100px; font-size: 0.95rem; text-align: left; font-weight: normal; margin-bottom: 10px;"
              placeholder="在此输入您的诗句或名言..."
              v-model="poetry.body"
            ></textarea>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <label>标题 / 诗名</label>
              <input
                type="text"
                class="tool-input"
                style="height: 42px; font-size: 0.9rem; font-weight: normal; text-align: left; padding: 0 12px;"
                v-model="poetry.title"
              />
            </div>
            <div class="config-item">
              <label>作者 / 朝代</label>
              <input
                type="text"
                class="tool-input"
                style="height: 42px; font-size: 0.9rem; font-weight: normal; text-align: left; padding: 0 12px;"
                v-model="poetry.author"
              />
            </div>
          </div>
          <button class="btn-calc btn-secondary" style="width: 100%; padding: 12px; font-size: 0.95rem; margin-top: 10px;" @click="randomizePoetry">
            随机经典诗词 ↺
          </button>
        </div>

        <!-- 2. 排版控制 -->
        <div class="panel-section">
          <h3>📐 版式与字体</h3>
          <div class="config-grid">
            <div class="config-item">
              <label>排版方向</label>
              <div class="toggle-buttons">
                <button :class="['toggle-btn', { active: layout === 'vertical' }]" @click="layout = 'vertical'">
                  竖排
                </button>
                <button :class="['toggle-btn', { active: layout === 'horizontal' }]" @click="layout = 'horizontal'">
                  横排
                </button>
              </div>
            </div>
            <div class="config-item">
              <label>艺术字体</label>
              <div class="toggle-buttons">
                <button :class="['toggle-btn', { active: fontStyle === 'kaiti' }]" @click="fontStyle = 'kaiti'">
                  楷体
                </button>
                <button :class="['toggle-btn', { active: fontStyle === 'serif' }]" @click="fontStyle = 'serif'">
                  宋体
                </button>
              </div>
            </div>
          </div>

          <div class="config-grid" style="margin-top: 14px;">
            <div class="config-item">
              <label>正文字号 ({{ fontSize }}px)</label>
              <input type="range" min="14" max="28" step="1" class="range-slider" v-model.number="fontSize" />
            </div>
            <div class="config-item">
              <label>字间距 ({{ letterSpacing }}px)</label>
              <input type="range" min="1" max="12" step="1" class="range-slider" v-model.number="letterSpacing" />
            </div>
          </div>
          <div class="config-grid" style="margin-top: 14px;">
            <div class="config-item">
              <label>行高比例 ({{ lineHeight }})</label>
              <input type="range" min="1.4" max="3.0" step="0.1" class="range-slider" v-model.number="lineHeight" />
            </div>
            <div class="config-item" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin-top: 14px;">
                <input type="checkbox" v-model="showStamp" style="width: 16px; height: 16px; accent-color: var(--primary);" />
                显示“浮方”红印章
              </label>
            </div>
          </div>
        </div>

        <!-- 3. 背景与主题 -->
        <div class="panel-section">
          <h3>🎨 背景颜色 & 渐变</h3>
          <div class="gradient-palette">
            <div
              v-for="(gradient, index) in PRESET_GRADIENTS"
              :key="index"
              :class="['palette-item', { active: activeGradientIndex === index }]"
              :style="{ background: gradient.css }"
              @click="applyPreset(index)"
              :title="gradient.name"
            ></div>
          </div>
          <div class="color-picker-group">
            <div class="color-input-wrapper">
              <label>文字颜色</label>
              <div class="toggle-buttons" style="padding: 2px;">
                <button :class="['toggle-btn', { active: textTheme === 'white' }]" @click="textTheme = 'white'" style="padding: 4px 10px;">
                  明白
                </button>
                <button :class="['toggle-btn', { active: textTheme === 'dark' }]" @click="textTheme = 'dark'" style="padding: 4px 10px;">
                  黛黑
                </button>
              </div>
            </div>
            <div class="color-input-wrapper" style="margin-left: auto;">
              <label>自定义渐变起止</label>
              <input type="color" class="color-picker" v-model="customColor1" @input="applyCustomColor" />
              <input type="color" class="color-picker" v-model="customColor2" @input="applyCustomColor" />
            </div>
          </div>
        </div>

        <!-- 4. 尺寸与导出 -->
        <div class="panel-section" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;">
          <h3>📱 尺寸比例</h3>
          <div class="toggle-buttons" style="margin-bottom: 18px;">
            <button :class="['toggle-btn', { active: cardSize === 'card' }]" @click="cardSize = 'card'">
              卡片模式 (3:4)
            </button>
            <button :class="['toggle-btn', { active: cardSize === 'wallpaper' }]" @click="cardSize = 'wallpaper'">
              手机壁纸模式 (9:16)
            </button>
          </div>

          <div class="action-buttons">
            <button class="btn-calc" style="padding: 14px;" @click="exportImage">
              📥 保存为高清图片
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：实时预览区 -->
      <div class="preview-panel">
        <div
          class="card-3d-container"
          ref="cardContainerRef"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <div
            :class="[
              'poetry-card',
              `size-${cardSize}`,
              `font-${fontStyle}`,
              `text-${textTheme}`
            ]"
            :style="[
              cardBackgroundStyle,
              card3DStyle
            ]"
            ref="cardRef"
          >
            <!-- 3D 视差高光层 -->
            <div class="card-reflection"></div>

            <!-- 卡片正文内容 -->
            <div :class="['card-content', `layout-${layout}`]">
              <!-- 诗名与作者 -->
              <div class="card-title-section">
                <div class="card-poetry-title">{{ poetry.title || '无题' }}</div>
                <div class="card-poetry-author">
                  {{ poetry.author ? `[${poetry.author}]` : '' }}
                </div>
              </div>

              <!-- 诗词正文 -->
              <div
                class="card-poetry-body"
                :style="{
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineHeight
                }"
              >
                {{ poetry.body }}
              </div>
            </div>

            <!-- 国风印章 -->
            <div v-if="showStamp" class="card-stamp">
              浮<br/>方
            </div>
          </div>
        </div>

        <div class="preview-tip">
          <span>✨ 晃动鼠标可体验 3D 悬浮反光视觉效果</span>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

// --- 预设的唯美国风双色渐变色板 ---
const PRESET_GRADIENTS = [
  { name: '水墨玄黛', css: 'linear-gradient(135deg, #11141a 0%, #222b38 100%)', colors: ['#11141a', '#222b38'], text: 'white' },
  { name: '宫墙朱砂', css: 'linear-gradient(135deg, #5c161a 0%, #b22c35 100%)', colors: ['#5c161a', '#b22c35'], text: 'white' },
  { name: '竹林听雨', css: 'linear-gradient(135deg, #edf3ea 0%, #85a374 100%)', colors: ['#edf3ea', '#85a374'], text: 'dark' },
  { name: '晚霞归鹭', css: 'linear-gradient(135deg, #fca3b5 0%, #ff7b7b 100%)', colors: ['#fca3b5', '#ff7b7b'], text: 'dark' },
  { name: '古藤幽紫', css: 'linear-gradient(135deg, #2d243a 0%, #5d4f72 100%)', colors: ['#2d243a', '#5d4f72'], text: 'white' },
  { name: '宣纸岁久', css: 'linear-gradient(135deg, #faf6eb 0%, #e3d7bd 100%)', colors: ['#faf6eb', '#e3d7bd'], text: 'dark' },
  { name: '天青雨霁', css: 'linear-gradient(135deg, #ebf6f7 0%, #9cbcc2 100%)', colors: ['#ebf6f7', '#9cbcc2'], text: 'dark' },
  { name: '秋叶金风', css: 'linear-gradient(135deg, #f2dc99 0%, #d98859 100%)', colors: ['#f2dc99', '#d98859'], text: 'dark' }
]

// --- 内置经典的古诗词数据库 ---
const POETRY_DATABASE = [
  {
    title: '饮酒·其五',
    author: '晋·陶渊明',
    body: '结庐在人境，而无车马喧。\n问君何能尔？心远地自偏。\n采菊东篱下，悠然见南山。\n山气日夕佳，飞鸟相与还。\n此中有真意，欲辨已忘言。'
  },
  {
    title: '山居秋暝',
    author: '唐·王维',
    body: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。\n竹喧归浣女，莲动下渔舟。\n随意春芳歇，王孙自可留。'
  },
  {
    title: '将进酒 (节选)',
    author: '唐·李白',
    body: '君不见黄河之水天上来，奔流到海不复回。\n君不见高堂明镜悲白发，朝如青丝暮成雪。\n人生得意须尽欢，莫使金樽空对月。\n天生我材必有用，千金散尽还复来。'
  },
  {
    title: '水调歌头·明月几时有',
    author: '宋·苏轼',
    body: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。'
  },
  {
    title: '天净沙·秋思',
    author: '元·马致远',
    body: '枯藤老树昏鸦，\n小桥流水人家，\n古道西风瘦马。\n夕阳西下，\n断肠人在天涯。'
  },
  {
    title: '独坐敬亭山',
    author: '唐·李白',
    body: '众鸟高飞尽，\n孤云独去闲。\n相看两不厌，\n只有敬亭山。'
  },
  {
    title: '望庐山瀑布',
    author: '唐·李白',
    body: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。'
  },
  {
    title: '陋室铭 (节选)',
    author: '唐·刘禹锡',
    body: '山不在高，有仙则名。\n水不在深，有龙则灵。\n斯是陋室，惟吾德馨。\n苔痕上阶绿，草色入帘青。\n谈笑有鸿儒，往来无白丁。'
  },
  {
    title: '定风波·沙湖道中遇雨',
    author: '宋·苏轼',
    body: '莫听穿林打叶声，何妨吟啸且徐行。\n竹杖芒鞋轻胜马，谁怕？\n一蓑烟雨任平生。\n料峭春风吹酒醒，微冷，山头斜照却相迎。\n回首向来萧瑟处，归去，也无风雨也无晴。'
  },
  {
    title: '相见欢·无言独上西楼',
    author: '五代·李煜',
    body: '无言独上西楼，月如钩。\n寂寞梧桐深院锁清秋。\n剪不断，理还乱，是离愁。\n别是一般滋味在心头。'
  }
]

// --- 响应式配置变量 ---
const poetry = reactive({
  title: '',
  author: '',
  body: ''
})

const layout = ref('vertical') // vertical: 竖排, horizontal: 横排
const fontStyle = ref('kaiti')  // kaiti: 楷体, serif: 宋体
const fontSize = ref(18)        // px
const letterSpacing = ref(4)    // px
const lineHeight = ref(2.0)     // ratio
const showStamp = ref(true)

const cardSize = ref('card')    // card: 3:4, wallpaper: 9:16
const textTheme = ref('white')   // white: 白色, dark: 黛黑色

// 渐变状态
const activeGradientIndex = ref(0)
const customColor1 = ref('#667eea')
const customColor2 = ref('#764ba2')
const isCustomColorActive = ref(false)

const cardBackgroundStyle = computed(() => {
  if (isCustomColorActive.value) {
    return { background: `linear-gradient(135deg, ${customColor1.value} 0%, ${customColor2.value} 100%)` }
  }
  return { background: PRESET_GRADIENTS[activeGradientIndex.value].css }
})

// --- 3D 旋转视差动效 ---
const cardContainerRef = ref(null)
const cardRef = ref(null)
const card3DStyle = ref({})

function handleMouseMove(e) {
  const container = cardContainerRef.value
  const card = cardRef.value
  if (!container || !card) return

  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left // 鼠标在容器内部的坐标
  const y = e.clientY - rect.top

  const xc = rect.width / 2
  const yc = rect.height / 2
  const dx = x - xc
  const dy = y - yc

  // 最大旋转角度 12 度
  const maxRotate = 12
  const rotateX = -(dy / yc) * maxRotate
  const rotateY = (dx / xc) * maxRotate

  // 反光层位置映射 (0% ~ 100%)
  const reflectX = (x / rect.width) * 100
  const reflectY = (y / rect.height) * 100

  card3DStyle.value = {
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: 'transform 0.05s ease-out',
    '--reflect-x': `${reflectX}%`,
    '--reflect-y': `${reflectY}%`
  }
}

function handleMouseLeave() {
  card3DStyle.value = {
    transform: 'rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.5s ease-out',
    '--reflect-x': '50%',
    '--reflect-y': '50%'
  }
}

// --- 控制器函数 ---
function randomizePoetry() {
  const currentIndex = POETRY_DATABASE.findIndex(p => p.title === poetry.title)
  let nextIndex = Math.floor(Math.random() * POETRY_DATABASE.length)
  // 确保连续随机不重复
  if (nextIndex === currentIndex && POETRY_DATABASE.length > 1) {
    nextIndex = (nextIndex + 1) % POETRY_DATABASE.length
  }
  const selected = POETRY_DATABASE[nextIndex]
  poetry.title = selected.title
  poetry.author = selected.author
  poetry.body = selected.body
}

function applyPreset(index) {
  isCustomColorActive.value = false
  activeGradientIndex.value = index
  textTheme.value = PRESET_GRADIENTS[index].text
}

function applyCustomColor() {
  isCustomColorActive.value = true
  activeGradientIndex.value = -1
}

// --- 纯 Canvas 高清绘制导出算法 ---
function exportImage() {
  const cardElement = cardRef.value
  if (!cardElement) return

  // 1. 确定尺寸 (比预览图放大 3 倍，以输出 300dpi 的高清图)
  const scale = 3
  const previewWidth = cardSize.value === 'card' ? 360 : 320
  const previewHeight = cardSize.value === 'card' ? 480 : 569
  
  const width = previewWidth * scale
  const height = previewHeight * scale

  // 2. 创建 Canvas 并初始化
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 启用高清图像平滑
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 3. 绘制渐变背景
  let gradient
  if (isCustomColorActive.value) {
    gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, customColor1.value)
    gradient.addColorStop(1, customColor2.value)
  } else {
    const preset = PRESET_GRADIENTS[activeGradientIndex.value]
    gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, preset.colors[0])
    gradient.addColorStop(1, preset.colors[1])
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const isWhiteText = textTheme.value === 'white'

  // A. 绘制宣纸边缘暗角（Vignette）
  const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.7)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, isWhiteText ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  // B. 绘制宣纸帘格与交织纤维质感 (Rice Paper Grid Texture)
  ctx.strokeStyle = isWhiteText ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.008)'
  ctx.lineWidth = 1 * scale
  // 纵向格线 (帘格)
  for (let x = 0; x < width; x += 20 * scale) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  // 横向格线 (帘格)
  for (let y = 0; y < height; y += 20 * scale) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // C. 绘制精致中式古典双线内边框
  const borderOffset = 16 * scale
  ctx.strokeStyle = isWhiteText ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
  ctx.lineWidth = 1 * scale
  ctx.strokeRect(borderOffset, borderOffset, width - borderOffset * 2, height - borderOffset * 2)

  // 4. 确定文字颜色与阴影
  const textColor = isWhiteText ? '#ffffff' : '#1e293b'
  ctx.fillStyle = textColor
  
  // 设置文字阴影提高质感
  if (isWhiteText) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = 12 * scale
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2 * scale
  } else {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)'
    ctx.shadowBlur = 4 * scale
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 1 * scale
  }

  // 5. 文字字体配置映射 (与 CSS 一致)
  const fontMapping = {
    serif: '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',
    kaiti: '"STKaiti", "KaiTi", "DFKai-SB", serif',
    sans: 'system-ui, -apple-system, sans-serif'
  }
  const baseFontFamily = fontMapping[fontStyle.value] || fontMapping.kaiti

  // 6. 进行文字绘制（核心逻辑：区分横竖排版）
  const padding = 45 * scale
  
  if (layout.value === 'horizontal') {
    // --- 横向排版绘制 ---
    ctx.textAlign = 'center'
    
    // A. 绘制标题和作者
    const titleText = poetry.title || '无题'
    const authorText = poetry.author ? `[${poetry.author}]` : ''
    
    ctx.font = `bold ${24 * scale}px ${baseFontFamily}`
    const titleY = padding + 30 * scale
    ctx.fillText(titleText, width / 2, titleY)
    
    let nextY = titleY + 30 * scale
    if (authorText) {
      ctx.font = `${14 * scale}px ${baseFontFamily}`
      ctx.fillText(authorText, width / 2, nextY)
      nextY += 45 * scale
    }
    
    // B. 绘制正文每一行
    const lines = poetry.body.split('\n')
    const drawFontSize = fontSize.value * scale
    ctx.font = `${drawFontSize}px ${baseFontFamily}`
    
    const bodyLineHeight = drawFontSize * lineHeight.value
    // 计算正文垂直居中
    const totalBodyHeight = lines.length * bodyLineHeight
    const startBodyY = nextY + (height - padding - nextY - totalBodyHeight) / 2 + drawFontSize / 2
    
    lines.forEach((line, lineIndex) => {
      // 绘制字间距（横向字间距由于原生 Canvas 不直接支持 letter-spacing，我们进行逐字渲染或字符数组间隔绘制）
      const charSpacing = letterSpacing.value * scale
      if (charSpacing > 0) {
        // 自定义字间距渲染
        const chars = line.split('')
        // 计算这一行在带字间距下的总宽度
        let totalLineWidth = 0
        const charWidths = chars.map(c => {
          const w = ctx.measureText(c).width
          totalLineWidth += w
          return w
        })
        totalLineWidth += (chars.length - 1) * charSpacing
        
        let startX = (width - totalLineWidth) / 2
        chars.forEach((char, charIdx) => {
          ctx.fillText(char, startX + charWidths[charIdx] / 2, startBodyY + lineIndex * bodyLineHeight)
          startX += charWidths[charIdx] + charSpacing
        })
      } else {
        // 无字间距，普通渲染
        ctx.fillText(line, width / 2, startBodyY + lineIndex * bodyLineHeight)
      }
    })

  } else {
    // --- 竖向排版绘制 (自右向左，文字竖写) ---
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    const drawFontSize = fontSize.value * scale
    const charSpacing = letterSpacing.value * scale
    const bodyLineHeight = drawFontSize * lineHeight.value
    const lines = poetry.body.split('\n')
    
    // A. 计算正文和标题列的总占用宽度
    // 竖排下，每一列宽度等于 bodyLineHeight
    const titleColumnWidth = 35 * scale // 标题加作者单独一列的宽度
    const textGap = 28 * scale // 列与列之间的间隔
    const totalColumns = lines.length + (poetry.title || poetry.author ? 1 : 0)
    const totalWidthOccupied = (lines.length - 1) * bodyLineHeight + (poetry.title || poetry.author ? textGap + titleColumnWidth : 0)
    
    // 正文从右往左绘制，确定第一列正文的 X 坐标 (居中偏右)
    const startX = (width + totalWidthOccupied) / 2

    // B. 绘制正文（从右向左列）
    lines.forEach((line, lineIndex) => {
      const colX = startX - lineIndex * bodyLineHeight
      const chars = line.split('')
      
      // 竖排单列的垂直高度，用于垂直居中
      const colHeight = chars.length * drawFontSize + (chars.length - 1) * charSpacing
      const startY = (height - colHeight) / 2
      
      ctx.font = `${drawFontSize}px ${baseFontFamily}`
      chars.forEach((char, charIdx) => {
        const charY = startY + charIdx * (drawFontSize + charSpacing)
        ctx.fillText(char, colX, charY)
      })
    })

    // C. 绘制标题和作者（最左侧列，带分隔线）
    if (poetry.title || poetry.author) {
      const titleColX = startX - lines.length * bodyLineHeight - textGap
      
      // 绘制垂直分隔细线
      ctx.strokeStyle = isWhiteText ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'
      ctx.lineWidth = 1.5 * scale
      ctx.beginPath()
      ctx.moveTo(titleColX + textGap / 2, padding)
      ctx.lineTo(titleColX + textGap / 2, height - padding)
      ctx.stroke()
      
      // 合并绘制标题和作者在同一列中（标题在上，作者在下）
      const titleText = poetry.title || '无题'
      const authorText = poetry.author ? `[${poetry.author}]` : ''
      
      const titleChars = titleText.split('')
      const titleCharSize = 20 * scale
      const titleSpacing = 4 * scale
      const titleHeight = titleChars.length * titleCharSize + (titleChars.length - 1) * titleSpacing
      
      const authorChars = authorText.split('')
      const authorCharSize = 12 * scale
      const authorSpacing = 2 * scale
      const authorHeight = authorChars.length * authorCharSize + (authorChars.length - 1) * authorSpacing
      
      // 整体居中计算
      const verticalGap = 16 * scale
      const totalColHeight = titleHeight + (authorText ? verticalGap + authorHeight : 0)
      let currentY = (height - totalColHeight) / 2
      
      // 绘制标题
      ctx.font = `bold ${titleCharSize}px ${baseFontFamily}`
      titleChars.forEach((char) => {
        ctx.fillText(char, titleColX, currentY)
        currentY += titleCharSize + titleSpacing
      })
      
      // 绘制作者
      if (authorText) {
        currentY += verticalGap - titleSpacing
        ctx.font = `${authorCharSize}px ${baseFontFamily}`
        authorChars.forEach((char) => {
          ctx.fillText(char, titleColX, currentY)
          currentY += authorCharSize + authorSpacing
        })
      }
    }
  }

  // 7. 绘制古风印章印记
  if (showStamp.value) {
    ctx.shadowColor = 'transparent' // 印章无文字阴影，保证清晰度
    
    const stampSize = 28 * scale
    const stampX = layout.value === 'vertical' ? padding : width - padding - stampSize
    const stampY = height - padding - stampSize
    
    // 红边框
    ctx.strokeStyle = isWhiteText ? '#fca5a5' : '#b91c1c'
    ctx.lineWidth = 2 * scale
    ctx.strokeRect(stampX, stampY, stampSize, stampSize)
    
    // 印章文字 ("浮方"，分两列或写小字)
    ctx.fillStyle = isWhiteText ? '#fca5a5' : '#b91c1c'
    const stampFontSize = 10 * scale
    ctx.font = `bold ${stampFontSize}px "STKaiti", "KaiTi", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 竖排单列（与网页端预览保持完全一致）：上方为“浮”，下方为“方”
    ctx.fillText('浮', stampX + stampSize * 0.5, stampY + stampSize * 0.3)
    ctx.fillText('方', stampX + stampSize * 0.5, stampY + stampSize * 0.7)
  }

  // 8. 触发二进制图片保存下载
  try {
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const fileName = `浮方工具箱-诗词壁纸-${poetry.title || '未命名'}.png`
    link.download = fileName
    link.href = dataUrl
    link.click()
  } catch (error) {
    alert('保存图片失败，可能存在跨域资源或浏览器限制！')
    console.error(error)
  }
}

// --- 初始化首屏 ---
onMounted(() => {
  randomizePoetry()
})
</script>

<style scoped>
@import '../styles/poetry-card.css';
</style>

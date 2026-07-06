<!--
  PoetryCardView.vue - 极简卡片与古诗词壁纸生成器
  支持国风渐变背景、竖排横排切换、自定义文字和高清 Canvas 离线保存
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
        <!-- 0. 模板样式选择 -->
        <div class="panel-section">
          <h3>🖼️ 模板样式</h3>
          <div class="toggle-buttons">
            <button :class="['toggle-btn', { active: cardStyleMode === 'modern' }]" @click="setTemplateMode('modern')">
              极简国风
            </button>
            <button :class="['toggle-btn', { active: cardStyleMode === 'stationery' }]" @click="setTemplateMode('stationery')">
              红线信笺
            </button>
          </div>
        </div>

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
              <label>作者</label>
              <input
                type="text"
                class="tool-input"
                style="height: 42px; font-size: 0.9rem; font-weight: normal; text-align: left; padding: 0 12px;"
                v-model="poetry.author"
              />
            </div>
          </div>
          <!-- 朝代/锁屏词 -->
          <div class="config-item" style="margin-top: 12px;">
            <label>朝代 / 锁屏边框文字 (如：元、解锁)</label>
            <input
              type="text"
              class="tool-input"
              style="height: 42px; font-size: 0.9rem; font-weight: normal; text-align: left; padding: 0 12px;"
              v-model="poetry.dynasty"
              placeholder="例如：唐、元，也可填“解锁”"
            />
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
                <button 
                  :class="['toggle-btn', { active: layout === 'vertical' }]" 
                  @click="layout = 'vertical'"
                >
                  竖排
                </button>
                <button 
                  :class="['toggle-btn', { active: layout === 'horizontal' }]" 
                  @click="layout = 'horizontal'"
                >
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
            <div class="config-item" v-if="cardStyleMode === 'modern'">
              <label>行高比例 ({{ lineHeight }})</label>
              <input type="range" min="1.4" max="3.0" step="0.1" class="range-slider" v-model.number="lineHeight" />
            </div>
            <div class="config-item" :style="{ justifyContent: 'center', gridColumn: cardStyleMode === 'stationery' ? 'span 2' : 'auto' }">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin-top: 14px;">
                <input type="checkbox" v-model="showStamp" style="width: 16px; height: 16px; accent-color: var(--primary);" />
                显示红印章
              </label>
            </div>
          </div>
        </div>

        <!-- 3. 背景与主题 -->
        <div class="panel-section">
          <h3>🎨 背景颜色 & 渐变</h3>
          <div v-if="cardStyleMode === 'modern'">
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
                <label>自定义渐变</label>
                <input type="color" class="color-picker" v-model="customColor1" @input="applyCustomColor" />
                <input type="color" class="color-picker" v-model="customColor2" @input="applyCustomColor" />
              </div>
            </div>
          </div>
          <!-- 信笺模式提示 -->
          <div v-else style="background: rgba(150, 32, 30, 0.04); padding: 12px 16px; border-radius: 12px; border: 1px dashed rgba(150, 32, 30, 0.2); font-size: 0.85rem; color: #96201e; text-align: left; line-height: 1.5;">
            💡 <b>红线信笺模板</b>使用纯白底色与实色红线边框，呈现经典手抄信札意境。
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
        <div class="card-container">
          <div
            :class="[
              'poetry-card',
              `size-${cardSize}`,
              `font-${fontStyle}`,
              `text-${textTheme}`,
              { 'style-stationery': cardStyleMode === 'stationery' }
            ]"
            :style="[
              cardStyleMode === 'modern' ? cardBackgroundStyle : {}
            ]"
            ref="cardRef"
          >

            <!-- 1. 传统极简国风模式 -->
            <div v-if="cardStyleMode === 'modern'" :class="['card-content', `layout-${layout}`]">
              <!-- 诗名与作者 -->
              <div class="card-title-section">
                <div class="card-poetry-title">{{ poetry.title || '无题' }}</div>
                <div class="card-poetry-author">
                  {{ poetry.dynasty ? `[${poetry.dynasty}·${poetry.author}]` : (poetry.author ? `[${poetry.author}]` : '') }}
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

            <!-- 2. 中式红线信笺模式 (Flex 布局) -->
            <div v-else :class="['layout-stationery', `is-${layout}`]">
              <!-- 最右侧列：诗名 -->
              <div class="stationery-col col-title">
                {{ poetry.title || '无题' }}
              </div>

              <!-- 中间列：正文的每一句 -->
              <div 
                v-for="(line, lineIdx) in poetry.body.split('\n')" 
                :key="lineIdx" 
                class="stationery-col col-body-line"
                :style="{
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`
                }"
              >
                {{ line }}
              </div>

              <!-- 最左侧列：朝代框 + 作者 + 印章 -->
              <div class="stationery-col col-author">
                <div class="author-cell-wrapper">
                  <!-- 朝代小红框 -->
                  <div class="stationery-dynasty" v-if="poetry.dynasty">
                    {{ poetry.dynasty }}
                  </div>
                  <div v-else style="height: 10px;"></div>
                  
                  <!-- 作者姓名 -->
                  <div class="stationery-author-name">
                    {{ poetry.author }}
                  </div>

                  <!-- 底部红色小印章 -->
                  <div class="stationery-stamp" v-if="showStamp">
                    <span>浮</span>
                    <span>方</span>
                  </div>
                  <div v-else style="height: 34px;"></div>
                </div>
              </div>
            </div>

            <!-- 国风印章 (仅现代模式) -->
            <div v-if="cardStyleMode === 'modern' && showStamp" class="card-stamp">
              浮<br/>方
            </div>
          </div>
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
  dynasty: '',
  body: ''
})

const cardStyleMode = ref('modern') // modern: 极简现代, stationery: 红线信笺
const layout = ref('vertical') // vertical: 竖排, horizontal: 横排
const fontStyle = ref('kaiti')  // kaiti: 楷体, serif: 宋体
const fontSize = ref(18)        // px
const letterSpacing = ref(4)    // px
const lineHeight = ref(2.0)     // ratio
const showStamp = ref(true)

const cardSize = ref('card')    // card: 3:4, wallpaper: 9:16
const textTheme = ref('white')   // white: 白色, dark: 黛黑色

// 切换模板模式
function setTemplateMode(mode) {
  cardStyleMode.value = mode
  if (mode === 'stationery') {
    textTheme.value = 'dark'
  }
}

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

const cardRef = ref(null)

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
  poetry.body = selected.body
  
  // 智能解析作者与朝代
  if (selected.author && selected.author.includes('·')) {
    const parts = selected.author.split('·')
    poetry.dynasty = parts[0]
    poetry.author = parts[1]
  } else {
    poetry.dynasty = ''
    poetry.author = selected.author || ''
  }
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
  
  // 确定绘制的字体
  const baseFontFamily = fontStyle.value === 'kaiti' ? '"STKaiti", "KaiTi", serif' : '"SimSun", "Songti SC", serif'
  
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
  const padding = 45 * scale
  
  if (cardStyleMode.value === 'stationery') {
    // ==========================================
    // 🎨 古典红线信笺风格绘制（干净极简，与参考图一致）
    // ==========================================
    ctx.shadowColor = 'transparent' // 信笺不需要文字阴影
    
    // A. 纯白背景（无暗角、无纹理）
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // B. 绘制双层红线边框
    const redColor = '#96201e'
    ctx.strokeStyle = redColor
    
    // 粗外框
    const outerOffset = 10 * scale
    ctx.lineWidth = 2.5 * scale
    ctx.strokeRect(outerOffset, outerOffset, width - outerOffset * 2, height - outerOffset * 2)
    
    // 细内框
    const innerOffset = 16 * scale
    ctx.lineWidth = 1 * scale
    ctx.strokeRect(innerOffset, innerOffset, width - innerOffset * 2, height - innerOffset * 2)

    // C. 划分网格并绘制每一列内容
    // 内容列组成：标题 (1) + 正文各行 (N) + 作者朝代 (1)
    const lines = poetry.body.split('\n')
    const usableWidth = width - innerOffset * 2
    const usableHeight = height - innerOffset * 2
    const bodyFontSize = fontSize.value * scale
    const bodySpacing = letterSpacing.value * scale

    // 竖排每列 / 横排每行 最大容纳字符数（超出部分在格子内换行，不新增红线）
    const maxCharsPerSlot = layout.value === 'vertical'
      ? Math.max(1, Math.floor((usableHeight - 16 * scale) / (bodyFontSize + bodySpacing)))
      : Math.max(1, Math.floor((usableWidth - 24 * scale) / (bodyFontSize + bodySpacing)))

    const totalCols = 1 + lines.length + 1
    const colWidth = usableWidth / totalCols

    // 统一设置绘制参数
    ctx.textAlign = 'center'
    
    if (layout.value === 'horizontal') {
      // ===== 横排红线信笺 =====
      ctx.textBaseline = 'middle'
      const usableHeight = height - innerOffset * 2
      const rowHeight = usableHeight / totalCols // horizontal uses rows
      
      // 绘制水平分隔实色红线 (共 totalCols - 1 条)
      ctx.strokeStyle = redColor
      ctx.lineWidth = 1 * scale
      for (let i = 1; i < totalCols; i++) {
        const lineY = innerOffset + i * rowHeight
        ctx.beginPath()
        ctx.moveTo(innerOffset, lineY)
        ctx.lineTo(width - innerOffset, lineY)
        ctx.stroke()
      }

      // ---- 1. 第一行：诗名 ----
      const titleRowY = innerOffset + 0.5 * rowHeight
      const titleText = poetry.title || '无题'
      const titleFontSize = 24 * scale
      const titleSpacing = 6 * scale
      ctx.font = `bold ${titleFontSize}px ${baseFontFamily}`
      ctx.fillStyle = '#1a1a1a'
      
      const titleChars = titleText.split('')
      let titleTotalWidth = titleChars.length * titleFontSize + (titleChars.length - 1) * titleSpacing
      let titleStartX = (width - titleTotalWidth) / 2
      
      titleChars.forEach((char, idx) => {
        ctx.fillText(char, titleStartX + idx * (titleFontSize + titleSpacing) + titleFontSize / 2, titleRowY)
      })

      // ---- 2. 中间行：正文的每一行（长句在格子内自动换行） ----
      ctx.font = `${bodyFontSize}px ${baseFontFamily}`
      ctx.fillStyle = '#2c3e50'
      const subRowLineH = bodyFontSize * 1.35
      const subRowGap = 2 * scale

      lines.forEach((line, lineIdx) => {
        const rowCenterY = innerOffset + (1 + lineIdx + 0.5) * rowHeight
        const chars = line.split('')
        const numSubRows = Math.ceil(chars.length / maxCharsPerSlot)

        // 子行垂直居中排布在该行空间内
        const totalSubHeight = numSubRows * subRowLineH + (numSubRows - 1) * subRowGap
        const subOriginY = rowCenterY - totalSubHeight / 2 + subRowLineH / 2

        for (let sr = 0; sr < numSubRows; sr++) {
          const subChars = chars.slice(sr * maxCharsPerSlot, (sr + 1) * maxCharsPerSlot)
          const subY = subOriginY + sr * (subRowLineH + subRowGap)
          const subW = subChars.length * bodyFontSize + (subChars.length - 1) * bodySpacing
          const subStartX = (width - subW) / 2

          subChars.forEach((char, ci) => {
            ctx.fillText(char, subStartX + ci * (bodyFontSize + bodySpacing) + bodyFontSize / 2, subY)
          })
        }
      })

      // ---- 3. 最后一行：朝代红框 + 作者名字 + 底部红印章 ----
      const authorRowY = innerOffset + (totalCols - 0.5) * rowHeight
      
      const dynastyText = poetry.dynasty || ''
      const authorText = poetry.author || ''
      
      // 作者名字尺寸
      const authFontSize = 14 * scale
      const authSpacing = 4 * scale
      const authorChars = authorText.split('')
      const authTotalWidth = authorText ? (authorChars.length * authFontSize + (authorChars.length - 1) * authSpacing) : 0
      
      // 朝代框尺寸
      const dynFontSize = 10 * scale
      const dynPaddingX = 5 * scale
      const dynPaddingY = 3 * scale
      const dynastyChars = dynastyText.split('')
      const dynBoxH = dynFontSize + dynPaddingY * 2
      const dynBoxW = dynastyText ? (dynastyChars.length * dynFontSize + dynPaddingX * 2) : 0

      // 印章尺寸
      const stampW = 34 * scale
      const stampH = 24 * scale
      
      const gap = 12 * scale
      let currentRightX = width - innerOffset - 16 * scale
      
      // 1. 绘制印章
      if (showStamp.value) {
        const stampX = currentRightX - stampW
        const stampY = authorRowY - stampH / 2
        
        ctx.fillStyle = redColor
        ctx.fillRect(stampX, stampY, stampW, stampH)
        
        ctx.fillStyle = '#ffffff'
        const stampTextSize = 9 * scale
        ctx.font = `bold ${stampTextSize}px "STKaiti", "KaiTi", serif`
        ctx.textBaseline = 'middle'
        ctx.fillText('浮', stampX + stampW * 0.3, authorRowY)
        ctx.fillText('方', stampX + stampW * 0.7, authorRowY)
        
        currentRightX = stampX - gap
      }

      // 2. 绘制作者
      if (authorText) {
        ctx.textBaseline = 'middle'
        ctx.font = `${authFontSize}px ${baseFontFamily}`
        ctx.fillStyle = '#334155'
        
        const authorStartX = currentRightX - authTotalWidth
        authorChars.forEach((char, idx) => {
          ctx.fillText(char, authorStartX + idx * (authFontSize + authSpacing) + authFontSize / 2, authorRowY)
        })
        
        currentRightX = authorStartX - gap
      }

      // 3. 绘制朝代红框
      if (dynastyText) {
        const dynBoxX = currentRightX - dynBoxW
        const dynBoxY = authorRowY - dynBoxH / 2
        
        ctx.strokeStyle = redColor
        ctx.lineWidth = 1 * scale
        ctx.strokeRect(dynBoxX, dynBoxY, dynBoxW, dynBoxH)
        
        ctx.textBaseline = 'middle'
        ctx.font = `bold ${dynFontSize}px ${baseFontFamily}`
        ctx.fillStyle = redColor
        
        // Horizontal text for dynasty
        const dynCharsWidth = dynastyChars.length * dynFontSize
        let dynStartX = dynBoxX + (dynBoxW - dynCharsWidth) / 2
        dynastyChars.forEach((char, idx) => {
          ctx.fillText(char, dynStartX + idx * dynFontSize + dynFontSize / 2, authorRowY)
        })
      }
    } else {
      // ===== 竖排红线信笺 =====
      ctx.textBaseline = 'top'

      // 绘制垂直分隔实色红线 (共 totalCols - 1 条)
      ctx.strokeStyle = redColor
      ctx.lineWidth = 1 * scale
      for (let i = 1; i < totalCols; i++) {
        const lineX = width - innerOffset - i * colWidth
        ctx.beginPath()
        ctx.moveTo(lineX, innerOffset)
        ctx.lineTo(lineX, height - innerOffset)
        ctx.stroke()
      }

      // 绘制内容 (从右往左流，列索引 0 到 totalCols - 1)

    
    // ---- 1. 最右侧列：诗名（黑色，与参考图一致） ----
    const titleColX = width - innerOffset - 0.5 * colWidth
    const titleText = poetry.title || '无题'
    const titleChars = titleText.split('')
    const titleFontSize = 24 * scale
    const titleSpacing = 6 * scale
    ctx.font = `bold ${titleFontSize}px ${baseFontFamily}`
    ctx.fillStyle = '#1a1a1a' // 黑色标题
    
    let titleTotalHeight = titleChars.length * titleFontSize + (titleChars.length - 1) * titleSpacing
    let titleStartY = innerOffset + (height - innerOffset * 2 - titleTotalHeight) / 2
    
    titleChars.forEach((char, idx) => {
      ctx.fillText(char, titleColX, titleStartY + idx * (titleFontSize + titleSpacing))
    })

    // ---- 2. 中间列：正文（长句在格子内自动换列） ----
    ctx.font = `${bodyFontSize}px ${baseFontFamily}`
    ctx.fillStyle = '#2c3e50' // 正文用深墨黛蓝
    const subColGap = 3 * scale // 换行子列间距（紧凑，无红线）

    lines.forEach((line, lineIdx) => {
      const colCenterX = width - innerOffset - (1 + lineIdx + 0.5) * colWidth
      const chars = line.split('')
      const numSubCols = Math.ceil(chars.length / maxCharsPerSlot)

      // 子列水平居中排布在该列空间内
      const subColCharW = bodyFontSize * 0.85 // 竖排汉字近似宽度
      const totalSubWidth = numSubCols * subColCharW + (numSubCols - 1) * subColGap
      const subOriginX = colCenterX - totalSubWidth / 2 + subColCharW / 2

      for (let sc = 0; sc < numSubCols; sc++) {
        const subChars = chars.slice(sc * maxCharsPerSlot, (sc + 1) * maxCharsPerSlot)
        const subX = subOriginX + sc * (subColCharW + subColGap)
        const subH = subChars.length * bodyFontSize + (subChars.length - 1) * bodySpacing
        const subStartY = innerOffset + (usableHeight - subH) / 2

        subChars.forEach((char, ci) => {
          ctx.fillText(char, subX, subStartY + ci * (bodyFontSize + bodySpacing))
        })
      }
    })

    // ---- 3. 最左侧列：朝代红框 + 作者名字 + 底部红印章 ----
    const authorColX = width - innerOffset - (totalCols - 0.5) * colWidth
    
    // A. 预先计算各部分高度
    const dynastyText = poetry.dynasty || ''
    const authorText = poetry.author || ''
    
    // 印章尺寸
    const stampW = 22 * scale
    const stampH = 30 * scale
    
    // 作者名字尺寸
    const authFontSize = 14 * scale
    const authSpacing = 4 * scale
    const authorChars = authorText.split('')
    const authTotalHeight = authorText ? (authorChars.length * authFontSize + (authorChars.length - 1) * authSpacing) : 0
    
    // 朝代框尺寸
    const dynFontSize = 10 * scale
    const dynSpacing = 2 * scale
    const dynPaddingX = 3 * scale
    const dynPaddingY = 5 * scale
    const dynastyChars = dynastyText.split('')
    const dynBoxW = dynFontSize + dynPaddingX * 2
    const dynBoxH = dynastyText ? (dynastyChars.length * dynFontSize + (dynastyChars.length - 1) * dynSpacing + dynPaddingY * 2) : 0

    // B. 从底部往上依次绘制，保持 8px ( * scale) 的 gap
    const gap = 8 * scale
    let currentBottomY = height - innerOffset - 16 * scale // 底部留白

    // 1. 绘制印章
    if (showStamp.value) {
      const stampX = authorColX - stampW / 2
      const stampY = currentBottomY - stampH
      
      // 实心红色矩形
      ctx.fillStyle = redColor
      ctx.fillRect(stampX, stampY, stampW, stampH)
      
      // 白字"浮方"
      ctx.fillStyle = '#ffffff'
      const stampTextSize = 9 * scale
      ctx.font = `bold ${stampTextSize}px "STKaiti", "KaiTi", serif`
      ctx.textBaseline = 'middle'
      ctx.fillText('浮', authorColX, stampY + stampH * 0.3)
      ctx.fillText('方', authorColX, stampY + stampH * 0.7)
      
      currentBottomY = stampY - gap
    }

    // 2. 绘制作者
    if (authorText) {
      ctx.textBaseline = 'top'
      ctx.font = `${authFontSize}px ${baseFontFamily}`
      ctx.fillStyle = '#334155'
      
      const authorStartY = currentBottomY - authTotalHeight
      
      authorChars.forEach((char, idx) => {
        ctx.fillText(char, authorColX, authorStartY + idx * (authFontSize + authSpacing))
      })
      
      currentBottomY = authorStartY - gap
    }

    // 3. 绘制朝代红框
    if (dynastyText) {
      const dynBoxX = authorColX - dynBoxW / 2
      const dynBoxY = currentBottomY - dynBoxH
      
      ctx.strokeStyle = redColor
      ctx.lineWidth = 1 * scale
      ctx.strokeRect(dynBoxX, dynBoxY, dynBoxW, dynBoxH)
      
      ctx.textBaseline = 'top'
      ctx.font = `bold ${dynFontSize}px ${baseFontFamily}`
      ctx.fillStyle = redColor
      dynastyChars.forEach((char, idx) => {
        ctx.fillText(char, authorColX, dynBoxY + dynPaddingY + idx * (dynFontSize + dynSpacing))
      })
    }
    }
  } else {
    // ==========================================
    // 🎨 原本的极简国风模式 (横竖排版)
    // ==========================================
    const isWhiteText = textTheme.value === 'white'

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    if (isCustomColorActive.value) {
      gradient.addColorStop(0, customColor1.value)
      gradient.addColorStop(1, customColor2.value)
    } else {
      const preset = PRESET_GRADIENTS[activeGradientIndex.value]
      gradient.addColorStop(0, preset.colors[0])
      gradient.addColorStop(1, preset.colors[1])
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 统一设置文字颜色
    ctx.fillStyle = isWhiteText ? '#ffffff' : '#1e293b'

    if (layout.value === 'horizontal') {
      // --- 横向排版绘制 ---
      ctx.textAlign = 'center'
      
      // A. 绘制标题和作者
      const titleText = poetry.title || '无题'
      const authorText = poetry.author ? (poetry.dynasty ? `[${poetry.dynasty}·${poetry.author}]` : `[${poetry.author}]`) : ''
      
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
        const charSpacing = letterSpacing.value * scale
        if (charSpacing > 0) {
          const chars = line.split('')
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
      const titleColumnWidth = 35 * scale
      const textGap = 28 * scale
      const totalWidthOccupied = (lines.length - 1) * bodyLineHeight + (poetry.title || poetry.author ? textGap + titleColumnWidth : 0)
      
      const startX = (width + totalWidthOccupied) / 2

      // B. 绘制正文（从右向左列）
      lines.forEach((line, lineIndex) => {
        const colX = startX - lineIndex * bodyLineHeight
        const chars = line.split('')
        
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
        
        ctx.strokeStyle = isWhiteText ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'
        ctx.lineWidth = 1.5 * scale
        ctx.beginPath()
        ctx.moveTo(titleColX + textGap / 2, padding)
        ctx.lineTo(titleColX + textGap / 2, height - padding)
        ctx.stroke()
        
        const titleText = poetry.title || '无题'
        const authorText = poetry.author ? (poetry.dynasty ? `${poetry.dynasty}·${poetry.author}` : poetry.author) : ''
        
        const titleChars = titleText.split('')
        const titleCharSize = 20 * scale
        const titleSpacing = 4 * scale
        const titleHeight = titleChars.length * titleCharSize + (titleChars.length - 1) * titleSpacing
        
        const authorChars = authorText.split('')
        const authorCharSize = 12 * scale
        const authorSpacing = 2 * scale
        const authorHeight = authorChars.length * authorCharSize + (authorChars.length - 1) * authorSpacing
        
        const verticalGap = 16 * scale
        const totalColHeight = titleHeight + (authorText ? verticalGap + authorHeight : 0)
        let currentY = (height - totalColHeight) / 2
        
        ctx.font = `bold ${titleCharSize}px ${baseFontFamily}`
        titleChars.forEach((char) => {
          ctx.fillText(char, titleColX, currentY)
          currentY += titleCharSize + titleSpacing
        })
        
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

    // 7. 原本的极简国风印章印记（带旋转，与 CSS 预览一致）
    if (showStamp.value) {
      ctx.shadowColor = 'transparent'

      const stampSize = 28 * scale
      const stampX = layout.value === 'vertical' ? padding : width - padding - stampSize
      const stampY = height - padding - stampSize
      const stampCenterX = stampX + stampSize / 2
      const stampCenterY = stampY + stampSize / 2

      ctx.save()
      ctx.translate(stampCenterX, stampCenterY)
      ctx.rotate(-10 * Math.PI / 180) // CSS preview uses rotate(-10deg)
      ctx.translate(-stampCenterX, -stampCenterY)

      ctx.strokeStyle = isWhiteText ? '#fca5a5' : '#b91c1c'
      ctx.lineWidth = 2 * scale
      ctx.strokeRect(stampX, stampY, stampSize, stampSize)

      ctx.fillStyle = isWhiteText ? '#fca5a5' : '#b91c1c'
      const stampFontSize = 10 * scale
      ctx.font = `bold ${stampFontSize}px "STKaiti", "KaiTi", serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.fillText('浮', stampX + stampSize * 0.5, stampY + stampSize * 0.3)
      ctx.fillText('方', stampX + stampSize * 0.5, stampY + stampSize * 0.7)

      ctx.restore()
    }
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

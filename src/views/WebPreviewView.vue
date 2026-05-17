<template>
  <ToolLayout
    title="网页内容预览"
    description="支持推特帖子、YouTube、Bilibili等内容的嵌入预览，兼容各类部署环境。"
    container-class="container-wide"
  >
    <div class="input-section">
      <div class="input-group">
        <label for="previewUrl">网址</label>
        <div class="inputs-row">
          <input 
            class="tool-input text-input"
            id="previewUrl"
            v-model="inputUrl" 
            type="url" 
            placeholder="请输入网址，例如: https://twitter.com/x/status/1791244078971260950" 
            @keyup.enter="handlePreview"
          />
          <button class="btn-calc" @click="handlePreview" :disabled="!inputUrl">解析预览</button>
        </div>
      </div>
    </div>

    <div class="result-section" v-if="previewType">
      <div class="preview-box">
        
        <!-- YouTube Preview -->
        <div v-if="previewType === 'youtube'" class="iframe-container ratio-16-9">
          <iframe 
            :src="previewData.src" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        <!-- Bilibili Preview -->
        <div v-else-if="previewType === 'bilibili'" class="iframe-container ratio-16-9">
          <iframe 
            :src="previewData.src" 
            scrolling="no" 
            border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true">
          </iframe>
        </div>

        <!-- Twitter Preview -->
        <div v-else-if="previewType === 'twitter'" class="twitter-embed" ref="twitterContainer">
          <!-- 这里不需要手动写 blockquote，由 widgets.js 动态生成以避免重新加载问题 -->
        </div>

        <!-- Generic Iframe Preview -->
        <div v-else-if="previewType === 'generic'" class="generic-embed">
          <div class="warning-alert">
            <span>⚠️</span> 注意：部分网站可能会拒绝被第三方网页嵌入（X-Frame-Options 策略）。如果下方为空白，请直接在新窗口打开该链接。
          </div>
          <div class="iframe-container generic-ratio">
            <iframe :src="previewData.src" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>

      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue';
import ToolLayout from '../components/ToolLayout.vue';

const inputUrl = ref('');
const previewType = ref(null);
const previewData = ref({});
const twitterContainer = ref(null);

// 解析网址并生成预览视图
const handlePreview = () => {
  const url = inputUrl.value.trim();
  if (!url) return;

  // 重置状态
  previewType.value = null;
  previewData.value = {};
  
  if (twitterContainer.value) {
    twitterContainer.value.innerHTML = '';
  }

  // 1. 匹配 YouTube
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch) {
    previewType.value = 'youtube';
    previewData.value = { src: `https://www.youtube.com/embed/${ytMatch[1]}` };
    return;
  }

  // 2. 匹配 Bilibili
  const biliRegex = /bilibili\.com\/video\/(BV[1-9A-HJ-NP-Za-km-z]+)/i;
  const biliMatch = url.match(biliRegex);
  if (biliMatch) {
    previewType.value = 'bilibili';
    previewData.value = { src: `//player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1&high_quality=1&danmaku=0` };
    return;
  }

  // 3. 匹配 Twitter / X
  const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/\d+/i;
  if (twitterRegex.test(url)) {
    previewType.value = 'twitter';
    previewData.value = { url: url };
    
    // 动态加载 Twitter widget JS 并渲染
    nextTick(() => {
      // 预填充基本的 blockquote 用于加载
      if (twitterContainer.value) {
         twitterContainer.value.innerHTML = `<blockquote class="twitter-tweet" data-theme="light"><a href="${url}"></a></blockquote>`;
      }
      
      if (!window.twttr) {
        const script = document.createElement('script');
        script.id = 'twitter-wjs';
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        script.onload = () => {
          if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load(twitterContainer.value);
          }
        };
        document.head.appendChild(script);
      } else {
        window.twttr.widgets.load(twitterContainer.value);
      }
    });
    return;
  }

  // 4. 其它常规网址回退方案（使用 iframe）
  let validUrl = url;
  if (!/^https?:\/\//i.test(validUrl)) {
    validUrl = 'https://' + validUrl;
  }
  previewType.value = 'generic';
  previewData.value = { src: validUrl };
};

onBeforeUnmount(() => {
  // 不强制移除 twitter js 避免其它页面或重新进入时报错
});
</script>

<style scoped>
.input-section {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.inputs-row {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.text-input {
  flex: 1;
  font-size: 1rem !important;
  text-align: left !important;
  font-weight: normal !important;
  padding: 0 20px;
  height: 55px !important;
  border-radius: 12px !important;
}

.btn-calc {
  flex: 0 0 120px;
  padding: 0 !important;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-section {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.preview-box {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 响应式视频容器比例 */
.iframe-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.ratio-16-9 {
  padding-bottom: 56.25%; /* 16:9 比例 */
}

.generic-ratio {
  padding-bottom: 75%; /* 通用网页稍微方一些 */
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.twitter-embed {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  min-height: 200px;
  display: flex;
  justify-content: center;
}

.generic-embed {
  width: 100%;
}

.warning-alert {
  background-color: #fffbeb;
  color: #b45309;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #fde68a;
}

@media (max-width: 600px) {
  .inputs-row {
    flex-direction: column;
  }
  .btn-calc {
    flex: 1;
    width: 100%;
  }
  .result-section {
    padding: 15px;
  }
  .input-section {
    padding: 20px;
  }
}
</style>

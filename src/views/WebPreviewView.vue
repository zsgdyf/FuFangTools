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
      <div class="options-group">
        <label class="option-label">Twitter 预览模式:</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" v-model="twitterMode" value="proxy" />
            <span>代理渲染 (推荐海外/CF部署)</span>
          </label>
          <label class="radio-item">
            <input type="radio" v-model="twitterMode" value="native" />
            <span>官方 Widget (国内科学上网可用)</span>
          </label>
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
        <div v-else-if="previewType === 'twitter'" class="twitter-card-container">
          <!-- Proxy Mode Content -->
          <template v-if="twitterMode === 'proxy'">
            <div v-if="loading" class="loading-placeholder">
              <div class="spinner"></div>
              <span>正在通过代理获取推文内容...</span>
            </div>
            <div v-else-if="error" class="error-placeholder">
              <div class="warning-alert">
                <span>❌</span> {{ error }}
              </div>
              <div class="info-alert">
                💡 提示：如果此项目部署在国内服务器（如阿里云），代理方案可能无法访问 Twitter API。请尝试切换到「官方 Widget」模式。
              </div>
            </div>
            <div v-else-if="tweetData" class="tweet-card">
              <div class="tweet-header">
                <img :src="proxyImage(tweetData.author.avatar_url)" class="tweet-avatar" alt="avatar" />
                <div class="tweet-author-info">
                  <div class="tweet-author-name">{{ tweetData.author.name }}</div>
                  <div class="tweet-author-handle">@{{ tweetData.author.screen_name }}</div>
                </div>
                <a :href="tweetData.url" target="_blank" class="tweet-logo">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="twitter-icon"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                </a>
              </div>
              <div class="tweet-content" v-html="formatTweetText(tweetData.text)"></div>
              
              <div v-if="tweetData.media && tweetData.media.photos && tweetData.media.photos.length > 0" class="tweet-media">
                <div :class="['media-grid', `grid-${Math.min(tweetData.media.photos.length, 4)}`]">
                  <div v-for="(photo, index) in tweetData.media.photos" :key="index" class="media-item">
                    <img :src="proxyImage(photo.url)" class="tweet-image" loading="lazy" />
                  </div>
                </div>
              </div>

              <div v-if="tweetData.media && tweetData.media.videos && tweetData.media.videos.length > 0" class="tweet-video">
                <video controls :poster="proxyImage(tweetData.media.videos[0].thumbnail_url)" class="tweet-video-player">
                  <source :src="tweetData.media.videos[0].url" type="video/mp4">
                  您的浏览器不支持视频播放。
                </video>
              </div>

              <div class="tweet-footer">
                <div class="tweet-stats">
                  <span>💬 {{ tweetData.replies }}</span>
                  <span>🔄 {{ tweetData.retweets }}</span>
                  <span>❤️ {{ tweetData.likes }}</span>
                </div>
                <div class="tweet-date">{{ formatTweetDate(tweetData.created_timestamp) }}</div>
              </div>
            </div>
          </template>

          <!-- Native Mode Content -->
          <template v-else>
            <div class="warning-alert native-warning">
              <span>⚠️</span> 正在使用官方 Widget 预览。若无法显示，请确保已开启科学上网环境。
            </div>
            <div class="twitter-embed" ref="twitterContainer">
              <!-- 这里由 widgets.js 动态生成内容 -->
            </div>
          </template>
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
const loading = ref(false);
const error = ref(null);
const tweetData = ref(null);
const twitterMode = ref('proxy'); // 'proxy' 或 'native'

// 解析网址并生成预览视图
const handlePreview = async () => {
  const url = inputUrl.value.trim();
  if (!url) return;

  // 重置状态
  previewType.value = null;
  previewData.value = {};
  loading.value = false;
  error.value = null;
  tweetData.value = null;
  
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
    
    if (twitterMode.value === 'proxy') {
      loading.value = true;
      try {
        const response = await fetch(`/api/twitter-info?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('无法获取推文信息');
        const data = await response.json();
        if (data.code !== 200) throw new Error(data.message || '获取推文失败');
        tweetData.value = data.tweet;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    } else {
      // 官方 Widget 模式
      nextTick(() => {
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
    }
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

// 图片代理函数，使用 weserv.nl 绕过 pbs.twimg.com 的屏蔽
const proxyImage = (url) => {
  if (!url) return '';
  if (url.includes('twimg.com')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  }
  return url;
};

// 格式化推文文本，转换链接和换行
const formatTweetText = (text) => {
  if (!text) return '';
  // 转换换行符
  let formatted = text.replace(/\n/g, '<br>');
  // 简单的 URL 转换 (可选，FxTwitter 返回的 text 可能已经包含部分链接)
  // 这里可以根据需要更复杂地处理
  return formatted;
};

// 格式化推文日期，转换为本地时区和指定格式
const formatTweetDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000); // FxTwitter 返回的是秒级时间戳
  
  const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeStr = timeFormatter.format(date).replace(' ', ''); // 移除空格，如 "上午 9:06" -> "上午9:06"
  const dateStr = dateFormatter.format(date);
  
  return `${timeStr} · ${dateStr}`;
};
</script>

<style scoped>
.input-section {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.options-group {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.option-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #334155;
}

.radio-item input {
  cursor: pointer;
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

/* Twitter Card Styles */
.twitter-card-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.tweet-card {
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-align: left;
}

.tweet-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
}

.tweet-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: #f5f8fa;
}

.tweet-author-info {
  flex: 1;
}

.tweet-author-name {
  font-weight: 700;
  color: #0f1419;
  font-size: 15px;
}

.tweet-author-handle {
  color: #536471;
  font-size: 15px;
}

.tweet-logo {
  position: absolute;
  top: 0;
  right: 0;
}

.twitter-icon {
  width: 20px;
  height: 20px;
  fill: #0f1419;
}

.tweet-content {
  font-size: 18px;
  line-height: 1.3;
  color: #0f1419;
  margin-bottom: 12px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.tweet-media {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #cfd9de;
}

.media-grid {
  display: grid;
  gap: 2px;
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1.5fr 1fr; grid-template-rows: 1fr 1fr; }
.grid-3 .media-item:first-child { grid-row: span 2; }
.grid-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }

.media-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.grid-1 .media-item {
  aspect-ratio: auto;
  max-height: 500px;
}

.tweet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tweet-video {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.tweet-video-player {
  width: 100%;
  display: block;
}

.tweet-footer {
  border-top: 1px solid #eff3f4;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #536471;
  font-size: 14px;
}

.tweet-stats {
  display: flex;
  gap: 16px;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #536471;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e1e8ed;
  border-top: 3px solid #1d9bf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-placeholder {
  width: 100%;
}

.info-alert {
  background-color: #f0f9ff;
  color: #0369a1;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 0.9rem;
  border: 1px solid #bae6fd;
}

.native-warning {
  margin-bottom: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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

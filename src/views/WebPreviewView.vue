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
        <div v-else-if="previewType === 'twitter'" class="twitter-card-container">
          <div v-if="loading" class="loading-placeholder">
            <div class="spinner"></div>
            <span>正在通过代理获取推文内容...</span>
          </div>
          <div v-else-if="error" class="error-placeholder">
            <div class="warning-alert">
              <span>❌</span> {{ error }}
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
              <div class="tweet-date">{{ tweetData.created_at }}</div>
            </div>
          </div>
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

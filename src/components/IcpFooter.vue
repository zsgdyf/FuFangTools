<!--
  IcpFooter.vue - ICP 备案页脚组件
  通过 /api/app-config 接口动态获取备案信息：
  - 阿里云部署：Express 返回 icpNumber → 显示备案页脚
  - Cloudflare 部署：接口不存在 → 静默隐藏页脚
  - 本地开发：取决于本地 Express 是否配置了 ICP_NUMBER 环境变量
-->
<template>
  <!-- 仅在获取到备案号时显示页脚 -->
  <footer v-if="icpNumber" class="icp-footer">
    <!-- ICP 备案号 -->
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ icpNumber }}</a>
    </div>
    <!-- 公安备案号 -->
    <div class="police-box">
      <img src="/备案图标.png" alt="警徽" width="20" height="20">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=42010302002809"
         rel="noreferrer"
         target="_blank">
        鄂公网安备42010302002809号
      </a>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/** 备案号，从服务端 API 获取 */
const icpNumber = ref('')

onMounted(async () => {
  try {
    // 尝试从服务器获取应用配置（含备案号）
    const response = await fetch('/api/app-config')
    if (!response.ok) return

    const config = await response.json()

    // 仅当服务端明确返回了 icpNumber 时才赋值（触发页脚显示）
    if (config && config.icpNumber) {
      icpNumber.value = config.icpNumber
    }
  } catch {
    // 静默失败：Cloudflare 部署时该接口不存在，无需报错
  }
})
</script>

<style scoped>
/* 备案页脚样式 */
.icp-footer {
  width: 100%;
  text-align: center;
  padding: 30px 0 20px 0;
  font-size: 12px;
  color: #94a3b8;
}

.icp-footer a {
  color: inherit;
  text-decoration: none;
}

.icp-footer a:hover {
  text-decoration: underline;
}

/* 公安备案区域布局 */
.police-box {
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>

<script setup>
import { onMounted, ref } from "vue";

import { GetServerInfo } from '@/api/user.js'
const serverInfo = ref({})

onMounted(() => {
  GetServerInfo().then(res => {
    serverInfo.value = res.data.response
  })
})


</script>
<template>
  <el-card class="note50">
    <template #header>
      <span style="font-size: 16px">服务器</span>
    </template>
    <div class="text item">环境变量：{{ serverInfo.EnvironmentName }}</div>
    <div class="text item">系统架构：{{ serverInfo.OSArchitecture }}</div>
    <div class="text item">
      ContentRootPath：{{ serverInfo.ContentRootPath }}
    </div>
    <div class="text item">WebRootPath：{{ serverInfo.WebRootPath }}</div>
    <div class="text item">
      .NET Core版本：{{ serverInfo.FrameworkDescription }}
    </div>
    <div class="text item">内存占用：{{ serverInfo.MemoryFootprint }}</div>
    <div class="text item">启动时间：{{ serverInfo.WorkingTime }}</div>
    <div>
      <br />
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
// 卡片服务器样式
.note50 {
  width: 550px;

  .text {
    font-size: 14px;
  }

  .item {
    line-height: 20px;
  }
}

@media screen and (max-width:600px) {
  .note50 { 
    margin: 0 auto;
    width: 95%;
  }
}
</style>
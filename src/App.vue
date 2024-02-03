<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useSettingStore } from "@/stores";
import { computed } from 'vue';


const setting = useSettingStore()


// 国际化
const locale = computed(() => (setting.language === 'zh-cn' ? zhCn : en))




</script>

<template>
  <!-- 入口 -->
  <div style="height: 100%;">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style lang="scss" scoped></style>

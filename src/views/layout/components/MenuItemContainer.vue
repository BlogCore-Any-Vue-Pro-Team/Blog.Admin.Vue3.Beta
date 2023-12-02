<script setup>
import MenuItemContainer from './MenuItemContainer.vue'
// 传参
defineProps({
  data: {
    type: [Array],
    require: true
  }
})
</script>
<template>
  <section v-for="item in data" :key="item.id">
    <el-sub-menu v-if="item.children && item.children.filter(t => !t.IsButton && !t.IsHide).length > 0" :index="item.id">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <!-- 多级路由菜单 -->
      <MenuItemContainer :data="item.children"></MenuItemContainer>
    </el-sub-menu>
    <el-menu-item v-else-if="!item.IsButton && !item.IsHide" :index="item.path">{{ item.name }}</el-menu-item>
  </section>
</template>
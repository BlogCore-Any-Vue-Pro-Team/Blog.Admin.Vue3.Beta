<script setup>
import MenuItemContainer from './MenuItemContainer.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
import router from '@/router'

// 传参
defineProps({
  data: {
    type: [Array],
    require: true
  }
})

const setActiveTag = (item) => {
  router.push(item.path)
  // userStore.setOneActiveTag(item.path)
}

</script>
<template>
  <template v-for="item in data" :key="item.id">
    <el-sub-menu v-if="item.children && item.children.filter(t => !t.IsButton && !t.IsHide).length > 0" :index="item.id">
      <template #title>
        <i v-if="item.children && item.children.length > 0 && item.iconCls && !item.IsButton" class="fa"
          :class="item.iconCls"></i>
        <span style="margin-left: 5px;">{{ item.name }}</span>
      </template>
      <!-- 多级路由菜单 -->
      <MenuItemContainer :data="item.children"></MenuItemContainer>
    </el-sub-menu>
    <el-menu-item @click="setActiveTag(item)" v-else-if="!item.IsButton && !item.IsHide" :index="item.path">{{ item.name
    }}</el-menu-item>
  </template>
</template>
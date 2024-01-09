import { defineStore } from 'pinia'
import { ref } from 'vue'
// 前端用户设置持久化
export const useSettingStore = defineStore(
  'setting',
  () => {
    // 是否折叠
    const isCollapse = ref(false)
    //中英文切换(默认中文)
    const language = ref('zh-cn')
    return {
      isCollapse,
      language
    }
  },
  {
    persist: true //持久化
  }
)

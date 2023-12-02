import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户信息持久化

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const token_type = ref('')
    const name = ref('')
    const pass = ref('')
    const menu = ref([])
    const uid = ref('')

    const isRemember = ref(false)

    const setName = (newName) => {
      name.value = newName
    }
    const setPass = (newPass) => {
      pass.value = newPass
    }

    const setToken = (newToken) => {
      token.value = newToken
    }

    return {
      token,
      token_type,
      name,
      pass,
      menu,
      uid,
      isRemember,
      setName,
      setPass,
      setToken
    }
  },
  {
    persist: true //持久化
  }
)

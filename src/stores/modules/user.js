import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
// 用户信息持久化

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const token_type = ref('')
    const menu = ref([])
    const uid = ref('')



    // 菜单缓存
    // 首页
    const firstPage = ref({
      path: '/',
      title: '首页',
      active: true
    })
    //上页
    const prePage = ref({})
    const curPage = ref({})
    // 列表
    const tagsList = ref([firstPage.value])

    // 设置一个激活导航
    const setOneActiveTag = (newTag) => {

      //点了自己
      if(newTag.path === curPage.value.path) return;

      let isRealNew = false
      for (let index = 0; index < tagsList.value.length; index++) {
        const element = tagsList.value[index];
        if (element.path === newTag.path) {
          //已添加过了,无需重复添加
          isRealNew = true
          newTag = element
        }

        if (element.active) prePage.value = element

        element.active = false
      }
      newTag.active = true;

      if (!isRealNew) tagsList.value.push(newTag)

      router.push(newTag.path)
      curPage.value = newTag

    }

    // 删除一个导航
    const removeOneTag = (tag) => {
      
      //不允许删除首页
      if (tag.path === '/') return;

      //删除
      tagsList.value.splice(tagsList.value.findIndex(t => t === tag), 1)

      //如果是激活就跳转到上一个路由
      if (tag.active) {
        prePage.value.active = true

        if (prePage.value.path) {
          setOneActiveTag(prePage.value)
        } else {
          setOneActiveTag(firstPage.value)
        }
        prePage.value = {}
      }
    }


    const setToken = (newToken) => {
      token.value = newToken
    }

    const setTokenType = (newTokenType) => {
      token_type.value = newTokenType
    }
    const setMenu = (newMenu) => {
      menu.value = newMenu
    }
    const setUid = (newUid) => {
      uid.value = newUid
    }



    const logout = () => {
      token.value = ''
      token_type.value = ''
      menu.value = []
      uid.value = ''
      tagsList.value = tagsList.value.splice(0, tagsList.value.length)
      tagsList.value = [firstPage]
    }



    const isRemember = ref(false)
    const name = ref('')
    const pass = ref('')

    const setName = (newName) => {
      name.value = newName
    }
    const setPass = (newPass) => {
      pass.value = newPass
    }

    return {
      token,
      token_type,
      name,
      pass,
      menu,
      uid,
      isRemember,
      tagsList,
      prePage,
      setName,
      setPass,
      setToken,
      setTokenType,
      setMenu,
      setUid,
      logout,
      setOneActiveTag,
      removeOneTag
    }
  },
  {
    persist: true //持久化
  }
)

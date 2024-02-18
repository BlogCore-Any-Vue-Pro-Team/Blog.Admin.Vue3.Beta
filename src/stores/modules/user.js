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
    const userInfo = ref({})



    // 菜单缓存
    // 首页
    const firstPage = {
      path: '/',
      title: '首页',
      active: true
    }
    //上页
    const prePage = ref({})
    // 当前页
    const curPage = ref({})
    // 列表
    const tagsList = ref([firstPage])

    // 设置一个激活导航
    const setOneActiveTag = (path, prePath) => {
      // console.info("newTag", newTag)
      //点了自己
      // if (newTag.path === curPage.value.path) return;
      let allRoutes = router.getRoutes()
      let findRoute = allRoutes.find(t => t.path === path)
      let findTag = tagsList.value.find(t => t.path === path)
      tagsList.value.forEach(t => {
        t.active = false
      })
      if (findRoute) {
        if (findTag) {
          findTag.title = findRoute.meta.title
        } else {
          findTag = {}
          findTag.title = findRoute.meta.title
          findTag.path = findRoute.path
          tagsList.value.push(findTag)
        }
        findTag.active = true
        curPage.value = findTag
      }
      if (prePath) {
        let findPreRoute = allRoutes.find(t => t.path === prePath)
        if (findPreRoute) prePage.value = findPreRoute
      }
    }

    // 删除一个导航
    const removeOneTag = (path) => {

      //不允许删除首页
      if (path === '/') return;

      //删除
      let tag = tagsList.value.find(t => t.path === path)
      if (!tag) return;
      //如果是激活就跳转到上一个路由
      if (tag.active) {
        prePage.value.active = true

        if (prePage.value.path) {
          // router.push(prePage.value.path)
          router.push('/')
        } else {
          router.push('/')
        }
        prePage.value = {}
      }

      tagsList.value.splice(tagsList.value.findIndex(t => t.path === path), 1)
    }

    // 关闭其他页面
    const closeOtherPage = () => {
      if (firstPage.path === curPage.value.path) {
        firstPage.active = true
        tagsList.value = [firstPage]
      } else {
        firstPage.active = false
        tagsList.value = [firstPage, curPage.value]
        router.push(curPage.value.path)
      }

    }

    // 关闭所有页面
    const closeAllPage = () => {
      tagsList.value = [firstPage]
      router.push('/')
    }


    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 设置token类型
    const setTokenType = (newTokenType) => {
      token_type.value = newTokenType
    }
    // 设置菜单
    const setMenu = (newMenu) => {
      menu.value = newMenu
    }
    // 设置用户id
    const setUid = (newUid) => {
      uid.value = newUid
    }
    // 设置用户信息
    const setUserInfo = (info) => {
      userInfo.value = info
    }


    // 退出登录
    const logout = () => {
      token.value = ''
      token_type.value = ''
      menu.value = []
      uid.value = ''
      firstPage.active = true
      tagsList.value = [firstPage]
      prePage.value = {}
      curPage.value = {}

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
      curPage,
      userInfo,
      setUserInfo,
      setName,
      setPass,
      setToken,
      setTokenType,
      setMenu,
      setUid,
      logout,
      setOneActiveTag,
      removeOneTag,
      closeOtherPage,
      closeAllPage
    }
  },
  {
    persist: true //持久化
  }
)

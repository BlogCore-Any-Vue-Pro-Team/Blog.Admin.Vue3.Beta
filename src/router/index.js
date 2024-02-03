import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

// createRouter 创建路由实例
// history模式
// createWebHistory history模式:地址栏不带#号
// createWebHashHistory hash模式:地址栏带#号

// import.meta.env.BASE_URL 是vite中的环境变量 就是 vite.config.js 中的 base 配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/',
      children: [
        {
          path: '/',
          component: () => import('@/views/front/FrontPage.vue')
        }
      ]
    },
    {
      path: '/login',
      isCheckToken: false,
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/test/test',
      isCheckToken: false,
      component: () => import('@/views/test/test.vue')
    },
    {
      path: '/test',
      isCheckToken: false,
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/test/test',
      children: [
        {
          path: '/test/profile',
          isCheckToken: false,
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/test/avatar',
          isCheckToken: false,
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/test/password',
          isCheckToken: false,
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    },
    {
      path: '/404',
      isCheckToken: false,
      component: () => import('@/views/error/404.vue')
    },
    // 空白路由重定向到404页面
    {
      path: '/:catchAll(.*)',
      isCheckToken: false,
      component: () => import('@/views/error/404.vue')
    },
  ]
})

// 前置守卫
// 返回undefined/true直接放行
// 返回false 拦回from的地址页面
router.beforeEach((to, from) => {
  // 如果没有token,且访问的是非登录页面,拦截到登录页面
  const userStore = useUserStore()
  if (to.isCheckToken === false && !userStore.token && to.path != '/login') {
    return '/login'
  }
  //路由变化事件

})

// vue文件列表
export const vueFilePathList = {
  ...import.meta.glob('@/views/*')
  , ...import.meta.glob('@/views/*/*')
  , ...import.meta.glob('@/views/*/*/*')
  , ...import.meta.glob('@/views/*/*/*/*')
  , ...import.meta.glob('@/views/*/*/*/*/*')
}

// 动态添加路由
export const addRoute = (item, parent) => {

  let meta = { ...item.meta, ...{ parent } }
  router.addRoute({
    path: item.path,
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: item.path,
    children: [
      {
        path: item.path,
        component: vueFilePathList['/src/views' + item.path + '.vue'],
        meta: meta
      }
    ]
  });
}
// 动态路由
export const addDynamicRoutes = (menu, parent) => {

  for (let index = 0; index < menu.length; index++) {

    const item = menu[index];
    if (item.children && item.children.filter(t => !t.IsButton).length > 0) {
      for (let cIndex = 0; cIndex < item.children.length; cIndex++) {
        //二级路由
        const child = item.children[cIndex];
        if (child.children && child.children.filter(t => !t.IsButton && t.path != '-').length > 0) {
          //递归获取 
          addDynamicRoutes(child.children, child)
        } else if (!child.IsButton && child.path != '-') {
          // 添加路由
          addRoute(child, item)
        } else {
          // 
        }
      }
    } else if (!item.IsButton && item.path != '-') {
      // 添加路由
      addRoute(item, parent)
    } else {
      // 
    }

  }


}
export default router

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
          component: () => import('@/views/front/frontPage.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/article',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/User/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/User/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/User/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 前置守卫
// 返回undefined/true直接放行
// 返回false 拦回from的地址页面
router.beforeEach((to, from) => {
  // 如果没有token,且访问的是非登录页面,拦截到登录页面
  const userStore = useUserStore()
  if (!userStore.token && to.path != '/login') {
    return '/login'
  }
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
export const addRoute = (item) => {
  // 添加路由   
  router.addRoute({
    path: item.path,
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: item.path,
    children: [
      {
        path: item.path,
        component: vueFilePathList['/src/views' + item.path + '.vue']
      }
    ]
  });
}
export const addDynamicRoutes = (menu) => {

  for (let index = 0; index < menu.length; index++) {
    const item = menu[index];
    if (item.children && item.children.filter(t => !t.IsButton && !t.IsHide).length > 0) {
      for (let kk = 0; kk < item.children.length; kk++) {
        //二级路由
        const child = item.children[kk];
        if (child.children && child.children.filter(t => !t.IsButton && !t.IsHide).length > 0) {
          //递归获取 
          addDynamicRoutes(child.children)
        } else if (!child.IsButton && !child.IsHide) {
          // 添加路由
          addRoute(child)
        } else {
          // 
        }
      }
    } else if (!item.IsButton && !item.IsHide) {
      // 添加路由
      addRoute(item)
    } else {
      // 
    }

  }


}
export default router

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
      path: '/_self',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/',
      meta: { requireAuth: true },
      children: [
        {
          path: '/',
          component: () => import('@/views/front/FrontPage.vue'),
          meta: { requireAuth: false, title: '首页' }
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'),
      meta: { requireAuth: false, title: '登录' }
    },
    {
      path: '/test/test',
      component: () => import('@/views/test/test.vue'),
      meta: { requireAuth: false, title: '测试页面' }
    },
    {
      path: '/test',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/test/test',
      meta: { requireAuth: false },
      children: [
        {
          path: '/test/profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: { requireAuth: true, title: '基本资料' }
        },
        {
          path: '/test/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: { requireAuth: true, title: '更换头像' }
        },
        {
          path: '/test/password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: { requireAuth: true, title: '重置密码' }
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/error/404.vue'),
      meta: { requireAuth: false, title: '404错误' }
    },
    // 空白路由重定向到404页面
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/error/404.vue'),
      meta: { requireAuth: false, title: '404错误' },
    },
  ]
})

// 前置守卫
// 返回undefined/true直接放行
// 返回false 拦回from的地址页面
router.beforeEach((to, from) => {
  // 如果没有token,且访问的是非登录页面,拦截到登录页面
  if (to.meta.title) document.title = '后台管理' + "-" + to.meta.title
  const userStore = useUserStore()
  if (to.meta.requireAuth === true && !userStore.token && to.path != '/login') {
    return '/login'
  }
  //路由变化事件  

  if (to.path != '/login' && to.path != '/test/test' && to.path != '/404')
    userStore.setOneActiveTag(to.path, from.path)

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
    path: item.path + "_self",
    name: item.id + "_self",
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: item.path,
    children: [
      {
        path: item.path,
        name: item.id,
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

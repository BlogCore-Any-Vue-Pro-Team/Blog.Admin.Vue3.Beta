
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
// 引入持久化
import pinia from '@/stores'
// 使用持久化
app.use(pinia)
// 网页刷新后动态路由添加
// (此处顺序必须在app.use(router)之前 app.use(pinia)之后)
import { addDynamicRoutes } from '@/router'
import { useUserStore } from "@/stores";
const userStore = useUserStore()
if (userStore.token && userStore.menu) {
  console.info("动态路由添加")
  addDynamicRoutes(userStore.menu)
}
// 路由
app.use(router)



// 引入全局样式
import '@/assets/css/main.scss'
// 引入awesome图标样式
import 'font-awesome/css/font-awesome.min.css'

// elementPlus引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


// 使用elementPlus引入
app.use(ElementPlus)



app.mount('#app') 

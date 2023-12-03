import '@/assets/css/main.scss'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { addDynamicRoutes } from '@/router'

import 'font-awesome/css/font-awesome.min.css'


const app = createApp(App)


app.use(pinia)

// 网页刷新后动态路由添加
// (此处顺序必须在app.use(router)之前 app.use(pinia)之后)
import { useUserStore } from "@/stores";
const userStore = useUserStore()
if (userStore.token && userStore.menu) {
  console.info("动态路由添加")
  addDynamicRoutes(userStore.menu)
}

app.use(router)

app.mount('#app') 

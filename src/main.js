import '@/assets/css/main.scss' 
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'

import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app') 

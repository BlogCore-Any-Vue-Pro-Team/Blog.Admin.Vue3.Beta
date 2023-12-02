import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 按需自动导入elementPlus,不需要手动import否则样式会出错 
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: '/', //路由前缀
  resolve: {
    // @的配置
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 反向代理
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9291",
        changeOrigin: true,
        // 前端api路由重新,比如api要重写成api2
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})

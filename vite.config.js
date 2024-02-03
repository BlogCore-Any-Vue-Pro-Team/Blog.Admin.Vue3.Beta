import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 打包时间戳,防止打包部署后用户页面出现缓存问题
const timestamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 暂时取消按需导入,因为按需导入会出现用户等待时间,不友好
    // 按需自动导入elementPlus,不需要手动import否则样式会出错 
    // AutoImport({
    //   resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // })
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
    open: true, // 服务启动时是否自动打开浏览器
    proxy: {
      "/api": {
        target: "http://localhost:9291",
        changeOrigin: true,
        // 前端api路由重新,比如api要重写成api2
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: `assets/[name].${timestamp}.js`,
        // 块文件名
        chunkFileNames: `assets/[name]-[hash].${timestamp}.js`,
        // 资源文件名 css 图片等等
        assetFileNames: `assets/[name]-[hash].${timestamp}.[ext]`,
      },
    },
  }
})

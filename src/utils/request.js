import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
const baseURL = ''

import { ElLoading, ElMessageBox, ElMessage } from 'element-plus'
const instance = axios.create({
  // 基地址
  baseURL,
  timeout: 30000
})
var loadingCount = 0
var loadingInstance = null
// 请求拦截
instance.interceptors.request.use(
  (config) => {
    if (config.ext === undefined || config.ext.loading === undefined || config.ext.loading === true) {
      loadingCount++;
      loadingInstance = ElLoading.service({
        lock: true,
        text: '系统正在加载数据中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    // 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token_type + ' ' + userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截
instance.interceptors.response.use(
  (res) => {
    if (loadingCount > 0) {
      loadingCount--;
      if (loadingCount <= 0) {
        loadingInstance.close();
      }
    }
    // 业务拦截
    if (res.data.success) {
      return res
    }
    // 处理失败,给错误提示
    ElMessage.error(res.data.msg || '服务繁忙')
    return Promise.reject(res.data)
  },
  (err) => {
    if (loadingCount > 0) {
      loadingCount--;
      if (loadingCount <= 0) {
        loadingInstance.close();
      }
    }
    // 响应出错
    // 处理401错误
    if (err.response?.status === 401) {
      // router.push('/login')
      router.replace('/login')
    }
    // 错误默认情况
    console.info('异常错误', err)
    if (err.response && err.response.data)
      ElMessage.error(err.response.data.msg)
    else
      ElMessage.error('服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }

import request  from '@/utils/request.js'

// 用户登录
export const userLogin = (params) => {
  return request.get('/api/Login/JWTToken3.0', { params: params })
}

// 获取用户信息
export const getInfoByToken = (params) => {
  return request.get('/api/user/getInfoByToken', { params: params })
}

// 获取用户菜单
export const GetNavigationBar = (params) => {
  return request.get('/api/permission/GetNavigationBar', { params: params })
}

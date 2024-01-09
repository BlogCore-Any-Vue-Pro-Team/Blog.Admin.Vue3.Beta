import request from '@/utils/request.js'

// 用户登录
export const userLogin = (params) => {
  return request.get('/api/Login/JWTToken3.0', { params: params })
}

// 部门列表
export const getDepartmentTreeTable = params => {
  return request.get('/api/department/get', { params: params });
};
// 删除
export const removeDepartment = params => {
  return request.delete('/api/department/delete', { params: params });
};
// 批量删除
export const removeBatchDepartment = params => {
  return request.post('/api/department/deletes', params);
};
// 编辑
export const editDepartment = params => {
  return request.put('/api/department/put', params);
};
// 添加
export const addDepartment = params => {
  return request.post('/api/department/post', params);
};
// 部门树
export const getDepartmentTree = params => {
  return request.get('/api/department/getDepartmentTree', { params: params });
};


import request from '@/utils/request.js'


export const addRolePermission = params => {
  return request.post('/api/permission/Assign', params);
};

export const getPermissionTree = params => {
  return request.get('/api/permission/getpermissiontree', { params: params });
};

export const getPermissionIds = params => {
  return request.get('/api/permission/GetPermissionIdByRoleId', { params: params });
};


export const getPermissionTable = params => {
  return request.get('/api/permission/GetTreeTable', { params: params });
};
export const removePermission = params => {
  return request.delete('/api/permission/delete', { params: params });
};
export const editPermission = params => {
  return request.put('/api/permission/put', params);
};
export const addPermission = params => {
  return request.post('/api/permission/post', params);
};
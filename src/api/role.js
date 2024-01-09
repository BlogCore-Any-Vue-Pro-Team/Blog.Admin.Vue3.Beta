import request from '@/utils/request.js'

export const getRoleListPage = params => {
  return request.get('/api/role/get', { params: params });
};
export const removeRole = params => {
  return request.delete('/api/role/delete', { params: params });
};
export const removeBatchRole = params => {
  return request.post('/api/role/deletes', params);
};
export const editRole = params => {
  return request.put('/api/role/put', params);
};
export const addRole = params => {
  return request.post('/api/role/post', params);
};


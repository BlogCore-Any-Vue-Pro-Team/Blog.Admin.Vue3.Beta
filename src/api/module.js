import request from '@/utils/request.js'

export const getModuleListPage = params => {
  return request.get('/api/module/get', { params: params });
};
export const removeModule = params => {
  return request.delete('/api/module/delete', { params: params });
};
export const removeBatchModule = params => {
  return request.post('/api/module/deletes', params);
};
export const editModule = params => {
  return request.put('/api/module/put', params);
};
export const addModule = params => {
  return request.post('/api/module/post', params);
};

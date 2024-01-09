import request from '@/utils/request.js'


//微信公众号
export const getWeChatAccount = params => {
  return request.get('/api/WeChatConfig/get', { params: params });
};
export const removeWeChatAccount = params => {
  return request.delete('/api/WeChatConfig/delete', { params: params });
};
export const batchDeleteChatAccount = params => {
  return request.post('/api/WeChatConfig/BatchDelete', params);
};
export const addWeChatAccount = params => {
  return request.post('/api/WeChatConfig/post', params);
};
export const updateWeChatAccount = params => {
  return request.put('/api/WeChatConfig/put', params);
};
export const updateWeChatAccountFocus = params => {
  return request.put('/api/WeChatConfig/putFocus', params);
};
export const getWeChatTemplate = params => {
  return request.get('/api/WeChat/GetTemplate', { params: params });//获取模板
};
export const refreshWeChatToken = params => {
  return request.get('/api/WeChat/RefreshToken', { params: params });//更新Token
};
export const getWeChatMenu = params => {
  return request.get('/api/WeChat/GetMenu', { params: params });//获取微信菜单
};
export const updateWeChatMenu = params => {
  return request.put('/api/WeChat/updateMenu', params);//更新微信菜单
};
export const getWeChatCompany = params => {
  return request.get('/api/WeChatCompany/get', { params: params });
};
export const removeWeChatCompany = params => {
  return request.delete('/api/WeChatCompany/delete', { params: params });
};
export const batchDeleteWeChatCompany = params => {
  return request.post('/api/WeChatCompany/BatchDelete', params);
};
export const addWeWeChatCompany = params => {
  return request.post('/api/WeChatCompany/post', params);
};
export const updateWeChatCompany = params => {
  return request.put('/api/WeChatCompany/put', params);
};
export const getWeChatPushLog = params => {
  return request.get('/api/WeChatPushLog/get', { params: params });
};
export const getWeChatSubUser = params => {
  return request.get('/api/WeChat/GetSubUsers', { params: params });
};
export const getWeChatBindUser = params => {
  return request.get('/api/WeChatSub/get', { params: params });
};
export const pushTestMsg = params => {
  return request.post('/api/WeChat/PushTxtMsg', params);
};
export const pushCardMsg = params => {
  return request.post('/api/WeChat/PushCardMsg', params);
};

export const getWeChatKeyword = params => {
  return request.get('/api/WeChatKeyword/get', { params: params });
};
export const removeWeChatKeyword = params => {
  return request.delete('/api/WeChatKeyword/delete', { params: params });
};
export const batchDeleteWeChatKeyword = params => {
  return request.post('/api/WeChatKeyword/BatchDelete', params);
};
export const addWeWeChatKeyword = params => {
  return request.post('/api/WeChatKeyword/post', params);
};
export const updateWeChatKeyword = params => {
  return request.put('/api/WeChatKeyword/put', params);
};

export const UpdateWeChatFile = (id, type, params) => {
  return request.post(`/api/WeChatKeyword/UpdateWeChatFile?id=${id}&type=${type}`, params);
};
export const GetWeChatMediaList = params => {
  return request.get('/api/WeChatKeyword/GetWeChatMediaList', { params: params });
};
import request from '@/utils/request.js'



export const getTaskListPage = params => {
  return request.get('/api/TasksQz/get', { params: params });
};
export const removeTask = params => {
  return request.delete('/api/TasksQz/delete', { params: params });
};
export const editTask = params => {
  return request.put('/api/TasksQz/put', params);
};
export const addTask = params => {
  return request.post('/api/TasksQz/post', params);
};
export const startJob = params => {
  return request.get('/api/TasksQz/StartJob', { params: params });
};
export const stopJob = params => {
  return request.get('/api/TasksQz/StopJob', { params: params });
};
export const reCovery = params => {
  return request.get('/api/TasksQz/ReCovery', { params: params });
};
export const pauseJob = params => {
  return request.get('/api/TasksQz/PauseJob', { params: params });
};
export const resumeJob = params => {
  return request.get('/api/TasksQz/ResumeJob', { params: params });
};
export const getTaskNameSpace = params => {
  return request.get('/api/TasksQz/GetTaskNameSpace', { params: params });
};
export const GetTaskLogs = params => {
  return request.get('/api/TasksQz/GetTaskLogs', { params: params });
};
export const GetTaskOverview = params => {
  return request.get('/api/TasksQz/GetTaskOverview', { params: params });
};
export const ExecuteJob = params => {
  return request.get('/api/TasksQz/ExecuteJob', { params: params });
};
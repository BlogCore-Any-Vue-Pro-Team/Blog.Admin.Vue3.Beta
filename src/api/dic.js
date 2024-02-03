import request from '@/utils/request.js'


// 获取字典类型
export const GetDic = (params) => {
    return request.get('/api/Dic/GetDic', { params: params })
}
// 获取字典列表
export const GetDicData = (params) => {
    return request.get('/api/Dic/GetDicData', { params: params })
}


export const dicTypeGet = params => {
    return request.get('/api/Dic/get', { params: params });
};
export const dicTypePost = params => {
    return request.post('/api/Dic/post', params);
};
export const dicTypePut = params => {
    return request.put('/api/Dic/put', params);
};
export const dicTypeDelete = params => {
    return request.delete('/api/Dic/delete', { params: params });
};
export const dicTypeDeletes = params => {
    return request.post('/api/Dic/deletes', params);
};


export const DicDataGet = params => {
    return request.get('/api/Dic/DicDataGet', { params: params });
};
export const DicDataPost = params => {
    return request.post('/api/Dic/DicDataPost', params);
};
export const DicDataPut = params => {
    return request.put('/api/Dic/DicDataPut', params);
};
export const DicDataDelete = params => {
    return request.delete('/api/Dic/DicDataDelete', { params: params });
};
export const DicDataDeletes = params => {
    return request.post('/api/Dic/DicDataDeletes', params);
};

 
import axios from 'axios';
import qs from 'qs';

const api = {
    // 获取所有科目
    getSubjects(params) {
        return axios.get('/admin/subject/list', params);
    },
    // 添加科目
    addSubject(params) {
        return axios.post('/admin/subject/add', qs.stringify(params));
    },
    // 删除科目
    delSubject(params) {
        return axios.post('/admin/subject/del', qs.stringify(params));
    }
};

export default api;
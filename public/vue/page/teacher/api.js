import axios from 'axios';
import qs from 'qs';

const api = {
    getTeachers(params) {
        return axios.get('/admin/teacher/list', {
            params: params
        });
    },
    delTeacher(params) {
        return axios.post('/admin/teacher/del', params);
    }
};

export default api;
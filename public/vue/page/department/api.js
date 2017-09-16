import axios from 'axios';
import qs from 'qs';

const api = {
    getDepartments(params) {
        return axios.get('/admin/department/list', params);
    },
    addDepartment(params) {
        return axios.post('/admin/department/add', qs.stringify(params));
    } 
};

export default api;
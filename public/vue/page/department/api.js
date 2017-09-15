import axios from 'axios';
import qs from 'qs';

const api = {
    getDepartments: function(params) {
        return axios.get('/admin/department/list', params);
    }
};

export default api;
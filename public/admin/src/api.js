import axios from 'axios'
import qs from 'qs'
// 定义环境：为开发环境时，才设置baseURL和允许发送cookie
const ENV = 'dev'
if (ENV === 'dev') {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true // 能够发送、接受cookie
}
// 获取权限
export const getAccessList = params => axios.get('http://localhost:3000/api/access/list', params)
// 添加权限
export const addAccess = params => axios.get('/api/access/add', qs.stringify(params))
// 更新权限
export const updateAccess = params => axios.get('/api/access/update', qs.stringify(params))
// 删除权限
export const delAccess = params => axios.get('/api/access/del', qs.stringify(params))

export const login = params => axios.post('http://localhost:3000/login', qs.stringify(params))

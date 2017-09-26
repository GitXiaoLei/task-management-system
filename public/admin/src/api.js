import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
// 定义环境：为开发环境时，才设置baseURL和允许发送cookie
const ENV = 'dev'
if (ENV === 'dev') {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true // 能够发送、接受cookie：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
}
// 检查auth
Vue.prototype.checkAuth = (webUrl, cb) => {
  return new Promise((resolve, reject) => {
    axios
    .get(webUrl)
    .then((data) => {
      data = data.data
      resolve(data.code)
    })
    .catch((err) => {
      reject(err)
    })
  })
}
// 获取权限
export const getAccess = () => axios.get('/api/access/list')
// 添加权限
export const addAccess = params => axios.post('/api/access/add', qs.stringify(params))
// 更新权限
export const updateAccess = params => axios.post('/api/access/update', qs.stringify(params))
// 删除权限
export const delAccess = params => axios.post('/api/access/del', qs.stringify(params))

// 获取角色
export const getRole = () => axios.get('/api/role/list')
// 添加角色
export const addRole = params => axios.post('/api/role/add', qs.stringify(params))
// 删除角色
export const delRole = params => axios.post('/api/role/del', qs.stringify(params))
// 获取某个角色的所有权限
export const getRoleAccess = params => axios.post('/api/role_access/list', qs.stringify(params))
// 为某个角色添加某个权限
export const addRoleAccess = params => axios.post('/api/role_access/add', qs.stringify(params))
// 删除某个角色的某个权限
export const delRoleAccess = params => axios.post('/api/role_access/del', qs.stringify(params))

export const loginout = () => axios.get('/loginout')

import axios from 'axios'
// import qs from 'qs'
// 定义环境：为开发环境时，才设置baseURL和允许发送cookie
const ENV = 'dev'
if (ENV === 'dev') {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true
}

export const getAccessList = params => axios.get('/admin/access/list', params)

export const login = params => axios.post('/login', {
  params: params
})

import axios from 'axios'
import qs from 'qs'

// 获取用户信息
export const getUserInfo = (params) => axios.get('/api/user/info', { params })

// 修改学生的信息
export const updateStudentInfo = (params) => axios.post('/api/student/update', qs.stringify(params))

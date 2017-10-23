import axios from 'axios'
import qs from 'qs'

// 获取个人中心页面初始化数据：用户信息、所教课程、所教班级
export const getPersonalWebData = (params) => axios.get('/api/teacher/personal', { params })
// 获取课程列表
export const getSubjectList = (params) => axios.get('/api/subject/list', { params })

// 修改学生的信息
export const updateStudentInfo = (params) => axios.post('/api/student/update', qs.stringify(params))

// 删除自己所教的课程
export const delSubject = (params) => axios.post('/api/teacher_subject/del', qs.stringify(params))

// 添加自己所教的课程
export const addSubject = (params) => axios.post('/api/teacher_subject/add', qs.stringify(params))

// 为某个课程添加班级
export const addClass = (params) => axios.post('/api/teacher_subject_class/add', qs.stringify(params))

// 删除某个课程下的某个班级
export const delClass = (params) => axios.post('/api/teacher_subject_class/del', qs.stringify(params))

// 获取班级列表
export const getClassList = (params) => axios.get('/api/class/list', { params })

// 退出登录
export const loginout = (params) => axios.get('/loginout', { params })

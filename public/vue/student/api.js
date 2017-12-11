import axios from 'axios'
import qs from 'qs'

// 获取用户信息
export const getUserInfo = (params) => axios.get('/api/user/info', { params })

// 是否有没提交的作业的作业
export const getStudentTaskId = (params) => axios.get('/api/student/is_submit', { params })

// 修改学生的信息
export const updateStudentInfo = (params) => axios.post('/api/student/update', qs.stringify(params))

// 获取“做作业页面”的初始化数据
export const getWorkWebData = (params) => axios.get('/api/student/work', { params })

// 修改学生的信息
export const getTaskQuestion = (params) => axios.post('/api/task_question/list', qs.stringify(params))

// 提交单个题目的回答
export const addAnswer = (params) => axios.post('/api/answer/add', qs.stringify(params))

// 交作业
export const addIsSubmit = (params) => axios.post('/api/student_task/submit', qs.stringify(params))

// 获取“查看成绩页面”的初始化数据
export const getStudentGradeWebData = (params) => axios.get('/api/student/grade', { params })

// 获取成绩单：学生
export const getReportCard = (params) => axios.get('/api/student/report_card', { params })

// 获取学生首页页面初始化数据
export const getStudentWebData = (params) => axios.get('/api/student/index', { params })

// 获取某次作业的题目和标准答案
export const getTaskQuestionAnswer = (params) => axios.post('/api/task_question_answer/list', qs.stringify(params))

// 确认输入的原密码是否正确
export const confirmPassword = (params) => axios.post('/api/password/confirm', qs.stringify(params))

// 确认输入新密码
export const newPassword = (params) => axios.post('/api/password/new', qs.stringify(params))

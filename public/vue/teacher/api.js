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

// 退出登录
export const getUserData = (params) => axios.get('/api/user/info', { params })

// 获取批改作业页面初始化数据
export const getCheckWebData = (params) => axios.get('/api/teacher/check', { params })

// 获取某个作业所对应的班级
export const getTaskClass = (params) => axios.post('/api/task_class/list', qs.stringify(params))

// 获取某个班级的所有学生
export const getClassStudent = (params) => axios.get('/api/class_student/list', { params })

// 获取某次作业某个同学的答案
export const getStudentAnswer = (params) => axios.get('/api/student_answer/list', { params })

// 为某题添加分数
export const submitScore = (params) => axios.post('/api/question_score/add', qs.stringify(params))

// 提交批改完的作业
export const addChecked = (params) => axios.post('/api/student_task/checked', qs.stringify(params))

// 提交批改完的作业
export const getGradeWebData = (params) => axios.get('/api/teacher_student/grade', { params })

// 获取自己某个科目下所教的班级列表
export const getSubjectClass = (params) => axios.get('/api/subject_class/list', { params })

// 获取成绩单
export const getReportCard = (params) => axios.get('/api/report_card/list', { params })


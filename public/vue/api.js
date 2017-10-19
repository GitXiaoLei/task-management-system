import axios from 'axios'
import qs from 'qs'

// 获取老师所教的课程
export const getSubjects = params => axios.get('/api/teacher_subject/list', { params })

// 创建一条作业记录
export const createTask = params => axios.post('/api/task/add', qs.stringify(params))

// 老师获取自己某个科目下所教的班级列表
export const getClasses = params => axios.get('/api/subject_class/list', {params})

// 为作业添加班级
export const addTaskClass = params => axios.post('/api/task_class/add', qs.stringify(params))

// 为作业删除班级
export const delTaskClass = params => axios.post('/api/task_class/del', qs.stringify(params))

// 获取选择题列表
export const getChoose = params => axios.get('/api/subject_question/choose/list', { params })
// 获取判断题列表
export const getJudge = params => axios.get('/api/subject_question/judge/list', { params })
// 获取选择题列表
export const getFill = params => axios.get('/api/subject_question/fill/list', { params })
// 获取选择题列表
export const getWords = params => axios.get('/api/subject_question/words/list', { params })

// 为某个课程添加题目
export const addQuestion = params => axios.post('/api/question/add', qs.stringify(params))

// 获取最近5条作业记录
export const getTask5 = params => axios.get('/api/task/recent', { params })

// 获取某次作业的所对应的课程
export const getTaskInfo = params => axios.get('/api/task/info', { params })

// 为某次作业添加题目
export const addTaskQuestion = params => axios.post('/api/task_question/add', qs.stringify(params))

// 为某次作业删除题目
export const delQuestion = params => axios.post('/api/task_question/del', qs.stringify(params))

// 发布作业
export const publishTask = params => axios.post('/api/task/publish', qs.stringify(params))
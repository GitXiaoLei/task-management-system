import axios from 'axios';
import qs from 'qs';

// 获取院系
export const getDepartments = params => axios.get('/admin/department/list', params);

// 添加院系
export const addDepartment = params => axios.post('/admin/department/add', qs.stringify(params));

// 删除院系
export const delDepartment = params => axios.post('/admin/department/del', qs.stringify(params));


// 获取科目
export const getSubjects = params => axios.get('/admin/subject/list', params);

// 添加科目
export const addSubject = params => axios.post('/admin/subject/add', qs.stringify(params));

// 删除院系
export const delSubject = params => axios.post('/admin/subject/del', qs.stringify(params));


// 获取老师账号信息
export const getTeachers = params => axios.get('/admin/teacher/list', { params: params });

// 删除老师账号信息
export const delTeacher = params => axios.post('/admin/teacher/del', params);

// 更新老师账号信息
export const updateTeacher = params => axios.post('/admin/teacher/update', qs.stringify(params));
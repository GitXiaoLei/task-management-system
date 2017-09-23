'use strict'

const Async = require('async');
const Admin = require('../../models/admin');
const Output = require('../../middlewares/output');
const Moment = require('moment');
// const DBError = require('../../errors/db_error');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/department', (req, res) => {
        let obj = { type: 1 };
        Output.render('admin/department.art', obj);
    });
    // 获取所有权限
    app.get('/admin/access/list', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        Admin
        .getAccess()
        .then((accessArr) => {
            Output.apiData(accessArr, '获取成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 添加权限
    app.post('/admin/access/add', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        if(!req._canVisit) {
            Output.apiErr({ code: 0, message: '你没有权限访问' });
            return;
        }
        // 要插入数据库的数据
        const insetData = {
            access_title: req.body.access_title,
            access_url: req.body.access_url,
            created_time: Moment().unix(),
            updated_time: Moment().unix()
        };
        Admin
        .addAccess(insetData)
        .then((result) => {
            Output.apiData(result, '添加成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 更新权限
    app.post('/admin/access/update', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        // 要插入数据库的数据
        const updateData = {
            access_title: req.body.access_title || null,
            access_url: req.body.access_url || null,
            updated_time: Moment().unix()
        };
        // 删除不要更新的字段
        for(let k in updateData) {
            if(!updateData[k]) {
                delete updateData[k];
            }
        }
        const conditions = { access_id: req.body.access_id };
        Admin
        .updateAccess(updateData, conditions)
        .then((result) => {
            Output.apiData(result, '更新成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 删除权限
    app.post('/admin/access/del', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        const conditions = { access_id: req.body.access_id };
        Admin
        .delAccess(conditions)
        .then((result) => {
            Output.apiData(result, '删除成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 获取所有角色
    app.get('/admin/role/list', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        Admin
        .getRole()
        .then((roleArr) => {
            Output.apiData(roleArr, '获取成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 添加角色
    app.post('/admin/role/add', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        // 要插入数据库的数据
        const insetData = {
            role_name: req.body.role_name,
            created_time: Moment().unix(),
            updated_time: Moment().unix()
        };
        Admin
        .addRole(insetData)
        .then((result) => {
            Output.apiData(result, '添加成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
    // 删除角色
    app.post('/admin/role/del', (req, res) => {
        // 没有登录
        if(!req._authInfo) {
            Output.apiErr({ code: 0, message: '请先登录' });
            return;
        }
        // 超级管理员才能访问
        // if(!req._canVisit) {
        //     Output.apiErr({ code: 0, message: '你没有权限访问' });
        //     return;
        // }
        const conditions = { role_id: req.body.role_id };
        Admin
        .delRole(conditions)
        .then((result) => {
            Output.apiData(result, '删除成功');
        })
        .catch((err) => {
            Output.apiErr(err);
        });
    });
};

module.exports = route;
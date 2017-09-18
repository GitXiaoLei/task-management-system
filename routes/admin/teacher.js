'use strict'

const Async = require('async');
const Teacher = require('../../models/teacher');
const Output = require('../../middlewares/output');
const Moment = require('moment');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/teacher', (req, res) => {
        let obj = { type: 3 };
        res.render('admin/department.art', obj);
    });
    /**
     * 获取所有老师信息(分页)
     */
    app.get('/admin/teacher/list', (req, res) => {

        let page = req.query.page || 1;
        let limit = 10;

        Async.parallel([
            // 查询老师信息
            (callback) => {
                Teacher
                    .getTeacherInfo(page, limit)
                    .then((teachers) => {
                        callback(null, teachers);
                    })
                    .catch((err) => {
                        Output.apiErr(err);
                    });
            },
            // 查询老师账号数量
            (callback) => {
                Teacher
                    .getTeacherCount()
                    .then((count) => {
                        callback(null, count);
                    })
                    .catch((err) => {
                        Output.apiErr(err);
                    });
            }
        ], (err, results) => {
            if(err) {
                Output.apiErr(err);
            }
            let teacherList = results[0];
            let count = results[1];
            Output.apiData({
                count: count,
                all_pages: Math.ceil(count/limit),
                current_page: page,
                list: teacherList
            }, '获取成功');
        });
        
        
    });
    /**
     * 添加老师账号
     */
    app.post('/admin/teacher/add', (req, res) => {
        req.body.created = Moment().unix();
        Teacher
            .addOne(req.body)
            .then((result) => {
                Output.apiData(result, '添加成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 更新老师账号信息
     */
    app.post('/admin/teacher/update', (req, res) => {
        let conditions = { uid: req.body.uid };
        let data = {};
        Object.assign(data, conditions);
        delete data.uid;
        Teacher
            .UpdateOne(req.body, conditions)
            .then((result) => {
                Output.apiData(result, '修改成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 删除老师账号
     */
    app.post('/admin/teacher/del', (req, res) => {
        let conditions = { uid: req.body.uid };
        Teacher
            .delOne(conditions)
            .then((result) => {
                Output.apiData(result, '删除成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
};

module.exports = route;
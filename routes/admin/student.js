'use strict'

const Async = require('async');
const Student = require('../../models/student');
const Output = require('../../middlewares/output');
const Moment = require('moment');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/student', (req, res) => {
        let obj = { type: 4 };
        res.render('admin/department.art', obj);
    });
    /**
     * 获取所有学生的信息(分页)
     */
    app.get('/admin/student/list', (req, res) => {
        
        let page = req.query.page || 1;
        let limit = 10;

        Async.parallel([
            // 查询老师信息
            (callback) => {
                Student
                    .getStudentInfo(page, limit)
                    .then((students) => {
                        callback(null, students);
                    })
                    .catch((err) => {
                        Output.apiErr(err);
                    });
            },
            // 查询老师账号数量
            (callback) => {
                Student
                    .getStudentCount()
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
            let studentList = results[0];
            let count = results[1];
            Output.apiData({
                count: count,
                all_pages: Math.ceil(count/limit),
                current_page: page,
                list: studentList
            }, '获取成功');
        });
        
        
    });
    /**
     * 添加学生账号
     */
    app.post('/admin/student/add', (req, res) => {
        
        req.body.created = Moment().unix();
        Student
            .addOne(req.body)
            .then((result) => {
                Output.apiData(result, '添加成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 更新学生账号信息
     */
    app.post('/admin/student/update', (req, res) => {
        let conditions = { uid: req.body.uid };
        let data = {};
        Object.assign(data, conditions);
        delete data.uid;
        Student
            .UpdateOne(req.body, conditions)
            .then((result) => {
                Output.apiData(result, '修改成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 删除学生账号
     */
    app.post('/admin/student/del', (req, res) => {
        let conditions = { uid: req.body.uid };
        Student
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
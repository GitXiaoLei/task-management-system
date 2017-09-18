'use strict'

const Async = require('async');
const Subject = require('../../models/subject');
const Output = require('../../middlewares/output');
const DBError = require('../../errors/db_error');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/subject', (req, res) => {
        let obj = { type: 2 };
        res.render('admin/department.art', obj);
    });

    app.get('/admin/subject/list', (req, res) => {
        Subject
            .getAll()
            .then((subjects) => {
                Output.apiData(subjects, '获取成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 添加院系
     */
    app.post('/admin/subject/add', (req, res) => {
        Subject
            .addOne(req.body)
            .then((result) => {
                Output.apiData(result, '添加成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
    /**
     * 删除科目
     */
    app.post('/admin/subject/del', (req, res) => {
        let conditions = { s_id: req.body.s_id };
        Subject
            .delOne(conditions)
            .then((result) => {
                // 删除了数据库中对应的数据
                if(result.affectedRows) {
                    Output.apiData(result, '删除成功');
                }else {
                    // 数据库中没有要删的数据
                    Output.apiErr(new DBError(1001, '数据库中没有要删的数据'));
                }
            })
            .catch((err) => {
                Output.apiErr(err);
            });
    });
};

module.exports = route;
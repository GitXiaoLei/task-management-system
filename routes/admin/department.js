'use strict'

const Async = require('async');
const Department = require('../../models/department');
const Output = require('../../middlewares/output');
const DBError = require('../../errors/db_error');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/department', (req, res) => {
        let obj = { type: 1 };
        Output.render('admin/department.art', obj);
    });
    /**
     * 获取所有院系
     */
    app.get('/admin/department/list', (req, res) => {

        Department
            .getAll()
            .then((departments) => {
                Output.apiData(departments, '获取所有院系成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });

    });
    /**
     * 添加院系
     */
    app.post('/admin/department/add', (req, res) => {
        console.log(req.body);
        Department
            .addOne(req.body)
            .then((result) => {
                Output.apiData(result, '添加成功');
            })
            .catch((err) => {
                Output.apiErr(err);
            });

    });
    /**
     * 删除院系
     */
    app.post('/admin/department/del', (req, res) => {
        let conditions = { d_id: req.body.d_id };
        Department
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
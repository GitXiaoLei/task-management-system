'use strict'

const Async = require('async');
const Department = require('../../models/department');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/department', (req, res) => {
        let obj = { type: 1 };
        res.render('admin/department.art', obj);
    });
    /**
     * 获取所有院系
     */
    app.get('/admin/department/list', (req, res) => {

        Department
            .getAll()
            .then((departments) => {
                res.json(departments);
            })
            .catch((err) => {
                res.send(err);
            });

    });
};

module.exports = route;
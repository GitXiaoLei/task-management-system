'use strict'

const Async = require('async');
const Department = require('../../models/department');
const Output = require('../../middlewares/output');
// const DBError = require('../../errors/db_error');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/department', (req, res) => {
        let obj = { type: 1 };
        Output.render('admin/department.art', obj);
    });
    
};

module.exports = route;
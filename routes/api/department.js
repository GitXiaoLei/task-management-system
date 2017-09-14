'use strict'

const Async = require('async');
const Department = require('../../models/department');

const route = (app) => {
    app.get('/department/list', (req, res) => {
        console.log('0~');
        Department
            .getAll()
            .then((rows) => {
                res.json((rows));
            });

    });
};

module.exports = route;
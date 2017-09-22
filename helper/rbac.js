'use strict'

const DB = require('../db');
const Auth = require('../middlewares/auth');
const Output = require('../middlewares/output');

/**
 * RBAC 处理权限的中间件
 */

const RBAC = {
    /**
     * 是否能够访问相关资源
     * @param {Array} accessData 从数据库中获取的权限url列表
     * @param {String} path 访问资源的地址
     * @return Boolean true：能够访问，false：不能访问
     */
    canVisit(accessUrlArr, path) {
        let can = false;
        accessUrlArr.forEach((url) => {
            if(url === path) {
                can = true;
            }
        });
        return can;
    }
};

module.exports = RBAC;
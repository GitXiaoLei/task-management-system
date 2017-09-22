'use strict'

const RBAC = {
    /**
     * 是否能够访问相关资源
     * @param {Array} accessData 从数据库中获取的权限列表
     * @param {String} path 访问资源的地址
     * @return Boolean true：能够访问，false：不能访问
     */
    canVisit(accessData, path) {
        let can = false;
        accessData.forEach((access) => {
            if(access.access_url === path) {
                can = true;
            }
        });
        return can;
    }
};

module.exports = RBAC;
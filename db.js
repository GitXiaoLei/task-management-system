'use strict'

const mysql = require('mysql');
const _dbconfigs = require('./config/db');

// 所有 DB 实例
const _instances = {};

// 测试标识
let _istest = false; 


class DB {
    /**
     * 构造函数
     */
    constructor(shard) {
        const dbconfig = _dbconfigs[shard];

        if(!dbconfig) {
            return false;
        }

        this.conn = mysql.createConnection({
            host: dbconfig.host,
            port: dbconfig.port,
            user: dbconfig.user,
            password: dbconfig.pass,
            database: dbconfig.dbname,
            charset: 'utf8mb4'
        });
    }
    /**
     * 获取数据库实例：这里使用了单例模式，避免创建多个连接
     * @param {String} shard 数据库类型或连接分区，如“r”表示可读，“w”表示可写，'user-3-r'代表某个分区
     */
    static instance(shard) {
        console.log('2~');
        shard = _istest ? 'test' : shard;
        shard = shard || 'w';
        console.log(shard, '3~');
        if(_instances[shard]) {
            return _instances[shard];
        }
        _instances[shard] = new DB(shard);
        console.log(typeof _instances[shard], '4~')
        return _instances[shard];
    }
    /**
     * 查询语句
     * 
     * @param {String} sql sql语句，可有问号？站位符，为values暂未
     * @param {Array} values sql中？占位符对应的数据
     * @return Promise result|rows
     */
    query(sql, values) {
        const that = this;
        return this.queryWithOptions({
            sql: sql,
            values: values
        });
    }
    queryWithOptions(options) {
        const that = this;
        return new Promise((resolve, reject) => {
            const start = Date.now();

            try{
                that.conn.query(options, (err, rows, fields) => {
                    if(err) {
                        DB.catchError(err);
                        // 抛出原始错误
                        reject(err);
                    }else {
                        resolve(rows);
                    }
                });
            }catch(err) {
                reject(err);
            }
        });
    }
    /**
     * 组建sql的where语句
     * 
     * @param {Object} conditions 条件，如{name: 'Tom', age: 20}
     * @return {String} [description]
     */
    static buildConditions(conditions) {
        let where = '';
        let condition = null;

        for(let field in conditions) {

            if (conditions.hasOwnProperty(field)) {
                if (!where) where = ' WHERE ';
                else where += ' AND ';

                condition = conditions[field];
                if (condition === null) {
                    where += '`' + field + '` IS NULL';
                } else if (typeof condition === 'string' || typeof condition === 'number') {
                    where += '`' + field + '` = ' + this.escape(condition);
                } else if (typeof condition === 'object') {
                    var appended = false;
                    if (condition.hasOwnProperty('gt')) {
                        if (typeof condition.gt !== 'number') {
                            return new DBError(5010, 'sql语句查询比较条件(gt)类型错误: ' + condition.gt + '->' + (typeof condition.gt));
                        } else {
                            where += '`' + field + '` > ' + this.escape(condition.gt);

                            appended = true;
                        }
                    }

                    if (condition.hasOwnProperty('gte')) {
                        if (typeof condition.gte !== 'number') {
                            return new DBError(5010, 'sql语句查询比较条件(gte)类型错误: ' + condition.gte + '->' + (typeof condition.gte));
                        } else {
                            // 如果前面有条件添加了, 则需要手动添加关键字
                            if (appended) {
                                where += ' AND `' + field + '` >= ' + this.escape(condition.gte);
                            } else {
                                where += '`' + field + '` >= ' + this.escape(condition.gte);
                            }

                            appended = true;
                        }
                    }

                    if (condition.hasOwnProperty('lt')) {
                        if (typeof condition.lt !== 'number') {
                            return new DBError(5010, 'sql语句查询比较条件(lt)类型错误: ' + condition.lt + '->' + (typeof condition.lt));
                        } else {
                            // 如果前面有条件添加了, 则需要手动添加关键字
                            if (appended) {
                                where += ' AND `' + field + '` < ' + this.escape(condition.lt);
                            } else {
                                where += '`' + field + '` < ' + this.escape(condition.lt);
                            }

                            appended = true;
                        }
                    }

                    if (condition.hasOwnProperty('lte')) {
                        if (typeof condition.lte !== 'number') {
                            return new DBError(5010, 'sql语句查询比较条件(lte)类型错误: ' + condition.lte + '->' + (typeof condition.lte));
                        } else {
                            // 如果前面有条件添加了, 则需要手动添加关键字
                            if (appended) {
                                where += ' AND `' + field + '` <= ' + this.escape(condition.lte);
                            } else {
                                where += '`' + field + '` <= ' + this.escape(condition.lte);
                            }

                            appended = true;
                        }
                    }

                    if (condition.hasOwnProperty('not')) {
                        // 非空
                        if (condition.not === null) {
                            // 如果前面有条件添加了, 则需要手动添加关键字
                            if (appended) {
                                where += ' AND `' + field + '` IS NOT NULL ';
                            } else {
                                where += '`' + field + '` IS NOT NULL ';
                            }

                            appended = true;
                        }else if (typeof condition.not !== 'number' && typeof condition.not !== 'string') {
                            return new DBError(5010, 'sql语句查询比较条件(not)类型错误: ' + condition.not + '->' + (typeof condition.not));
                        } else {
                            // 如果前面有条件添加了, 则需要手动添加关键字
                            if (appended) {
                                where += ' AND `' + field + '` != ' + this.escape(condition.not);
                            } else {
                                where += '`' + field + '` != ' + this.escape(condition.not);
                            }

                            appended = true;
                        }
                    }

                } else {
                    // return new DBError(5010, 'sql语句查询条件类型错误: ' + condition + '->' + (typeof condition));
                    return new Error('sql语句查询条件类型错误：' + condition + '->' + (typeof condition));
                }
            }

        }
        // 留出一个空格
        if(where) {
            where = where + ' ';
        }
        return where;
    }
    /**
     * 组建sql的sortby语句
     * 
     * @param {Object} sorts 条件，如{created: 1}，1表示降序
     * @return [description]
     */
    static buildOrderby(sorts) {
        let sortby = '';
        
        for(let field in sorts) {
            if(sorts.hasOwnProperty(field)) {
                if (!sortby) {
                    sortby = ' ORDER BY `' + field + '`' + ( (sorts[field] === 0) ? ' ASC ' : ' DESC ' );
                } else {
                    // 暂时只理会一个sortby
                    break;
                }
            }
        }
        // 留出一个空格
        if(sortby) {
            sortby = sortby + ' ';
        }
        return sortby;
    }
    /**
     * 根据条件，查询出固定数量的结果
     * 
     * @param {String} tbname 表名
     * @param {Object} conditions 例：{name: 'Tom', age: 19}，根据这个条件查询
     * @param {Object} sorts 例：{created: 1}，按照created字段逆序排序
     * @param {Object} limit 例：{offset: 10, count: 10}
     */
    select(tbname, conditions, sorts, limit) {
        const that = this;
        return new Promise((resolve, reject) => {
            limit = isNaN(limit) ? 100 : limit;
            let sql = 'SELECT * FROM `' + tbname + '`';
            let where = DB.buildConditions(conditions);
            if(typeof where!== 'string' && where.message) {
                reject(where);
            }

            let sortby = DB.buildOrderby(sorts);

            sql = sql + where + sortby + ' LIMIT ' + limit;
            that.query(sql).then((rows) => {
                resolve(rows);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * 插入一条数据
     * 
     * @param {String} tbname 表名
     * @param {Object} data 插入的数据，如：{ name: 'Tom', age: 19 }
     * @return Promese result 插入的结果，成功则有insertId属性
     */
    insert(tbname, data) {
        const that = this;
        console.log('DB.insert~~~')
        console.log(tbname, data);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO `' + tbname + '` SET ? ';
            that
                .query(sql, data)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    
    static escape(sql) {
        return mysql.escape(sql);
    }
}

module.exports = DB;
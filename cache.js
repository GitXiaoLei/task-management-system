'use strict'

/**
 * redis 缓存类
 */

 const _dbconfigs = require('./config/cache');

// 数据库连接实例
 const _instances = {};

class Cache {
    constructor(shard) {
        const dbconfig = _dbconfigs[shard];
        if(!dbconfig) return false;

        this.conn = redis.createClient({
            host: dbconfig.host,
            port: dbconfig.port,
            password: dbconfig.password,
            db: dbconfig.db,
            retry_strategy : (options) => {
                if (options.error.code === 'ECONNREFUSED') {
                    return new Error('The server refused the connection');
                }

                if (options.total_retry_time > 1000 * 60 * 60) {
                    return new Error('Retry time exhausted');
                }

                if (options.times_connected > 10) {
                    return undefined;
                }

                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        });
        // 将redis函数封装一层
        for(let prop in this.conn) {
            if(typeof this.conn[prop] === 'function') {
                this.registerMethod(prop);
            }
        }

        this.listenEvents();
    }
    /**
     * 注册封装redis方法
     * @param {String} prop 方法名称
     * @return Boolean redis操作结果
     */
    registerMethod(prop) {
        this[prop] = function() {
            try {
                const res = this.conn[prop].apply(this.conn, arguments);
                return res;
            }catch(err) {
                console.log('error: ', err);
                const callback = arguments[arguments.length - 1];
                if (typeof callback === 'function') {
                    Cache.catchError(err);
                    callback(new CacheError(6002, err.message, err));
                }
                return false;
            }
        }
    }
    /**
     * 监听链接事件
     * @return null
     */
    listenEvents() {
        this.conn.on('ready', () => {
            console.log('redis: redy');
        });
        this.conn.on('connect', () => {
            console.log('redis: connect');
        });
        this.conn.on('reconnecting', () => {
            console.log('redis: reconnecting');
        });
        this.conn.on('error', (err) => {
            // Cache.catchError(err);
            console.log('redis: error', err);
        });
        this.conn.on('end', () => {
            console.log('redis: end');
        });
        this.conn.on('warning', (err) => {
            console.log('redis: warning', err);
        });
        this.conn.on('monitor', (time, args, raw_reply) => {
            console.log('redis: monitor', args);
        });
    }
    /**
     * 获取redis数据库实例：单例模式，避免创建多个连接
     * @param {String} shard 数据库分区
     * @return instance of redis
     */
    static instance(shard) {
        if(_instances[shard]) {
            return _instances[shard];
        }
        const cache = new Cache(shard);
        _instances[shard] = cache;
        return _instances[shard];
    }
};

module.exports = Cache;
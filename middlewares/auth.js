'use strict'

const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const serverInfo = require('../config/server');

const _secret = 'task';
let _authInfo = null;

const Auth = {
    /**
     * 初始化：将“加了密”的token“解密”成对象形式的信息
     */
    init(req, res, next) {
        let token;
        
        token = req.cookies.authorization;
        /**
         * 如果是调试模式，允许get上传和post上传authorization
         */
        // if(!token && serverInfo.debug) {
        //     switch(req.method) {
        //         case 'GET': 
        //             token = req.headers.authorization;
        //             break;
        //         case 'POST':
        //             token = req.headers.authorization;
        //     }
        // }
        console.log('-----------------\n','前端发来的token：\n' + token, '\n-----------------');
        _authInfo = Auth.verify(token);
        console.log('解析后的token：');
        console.log(_authInfo);
        console.log('-----------------');
        next();
    },
    /**
     * 生成授权令牌
     * @param {Number} uid 用户id
     */
    generateToken(uid) {
        const info = {
            uid: uid,
            expiresIn: '365d' 
        };
        const token = jwt.sign(info, _secret);
        return token;
    },
    /**
     * 验证授权令牌
     * @param {String} token 授权令牌
     * @return Object tokeninfo，令牌中携带的信息对象
     */
    verify(token) {
        let decoded = false;
        try {
            decoded = jwt.verify(token, _secret);
        }catch(e) {
            decoded = false;
        }
        return decoded;
    },
    /**
     * 获取认证信息
     * @return Object 用户认证信息，包含uid等
     */
    authInfo() {
        return _authInfo;
    },
    
};

module.exports = Auth;
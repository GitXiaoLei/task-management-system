'use strict'

const jwt = require('jsonwebtoken');
const uuid = require('uuid');

let _authInfo = null;
const _secret = 'wqtt^|AW?O+sT5*|;g|Yb^fq-9)6O1zYT?v{duk(F_Dc`}2l$I7ZaEE!u.&W5_J-';
const Auth = {
    /**
     * 初始化：将“加了密”的token“解密”成对象形式的信息
     */
    init(req, res, next) {
        // 从cookie中取得token
        let token = req.cookies.authorization;
        _authInfo = Auth.verify(token);
        next();
    },
    /**
     * 生成授权令牌
     * @param {Number} uid 用户id
     */
    generateToken(uid) {
        const authid = `${uid}:${uuid()}`;
        const info = {
            uid: uid,
            auth: authid,
            exp: '1h'
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
    }
};

module.exports = Auth;
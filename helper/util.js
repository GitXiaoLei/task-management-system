/**
 * 工具函数
 */
const Util = {
    /**
     * 数组去重
     * @param {Array} arr 数组
     * @return Array
     */
    removeSome(arr) {
        const newArr = [];
        for(let i = 0, len = arr.length; i < len; i++) {
            if(newArr.indexOf(arr[i]) === -1) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }
};

module.exports = Util;
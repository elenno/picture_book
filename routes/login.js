var dbMgr = require('./db.js');
var utility = require('utility');
var StatusCode = require('../common/status.js');
var qiniu = require('../common/qiniu.js');

var loginRequest = function(usr, pwd, callback) {
    console.log("login with usr=%s pwd=%s", usr, pwd);
    var query = { 'usr': usr, 'pwd': pwd };
    var col = 'user';
    dbMgr.load_data(col, query, function(result) {
        console.log('login result:' + result);
        if (null != result) {
            var curTime = new Date().getTime();
            var accessToken = utility.md5(curTime.toString() + result.registerTime);
            var expireTime = curTime + 60 * 60;
            console.log('token:' + accessToken + '  time:' + expireTime);
            var data = { 'access_token': accessToken, 'expire_time': expireTime, 'usr': usr };
            var query = { 'usr': usr };
            var col = 'session';
            dbMgr.save_data(col, query, data, function(result) {
                if (-1 == result) {
                    callback(StatusCode.UNKNOWN_ERROR, {});
                } else {
                    callback(StatusCode.LOGIN_SUCCESS, { 'access_token': accessToken, 'expire_time': expireTime });
                }
            });
        } else {
            callback(-1, {});
        }
    });
}

var registerRequest = function(usr, pwd, callback) {
    console.log("register with usr=%s pwd=%s", usr, pwd);
    var countQuery = { 'usr': usr };
    var col = 'usr';
    dbMgr.get_count(col, countQuery, function(count) {
        if (-1 == count) {
            console.log('registerRequest count error');
            callback(-1, {});
        } else if (0 == count) {
            console.log('registerRequest count 0, ok to continue');
            var registerTime = Date.now();
            //TODO generate uuid
            var saveQuery = { 'usr': usr, 'pwd': pwd, 'reg_time': registerTime, 'uuid': registerTime };
            dbMgr.save_data(col, countQuery, saveQuery, function(result) {
                if (-1 == result) {
                    console.log('save_data failed');
                    callback(-1, {});
                } else {
                    console.log('save_data succeeded');
                    callback(0, {});
                }
            });
        } else {
            console.log('registerRequest count ' + count + ', user exist!');
            callback(-1, {});
        }
    });
}

var getUpToken = function(accessToken, filetype, callback) {
    var userQuery = { 'access_token': accessToken };
    var col = 'usr';
    dbMgr.load_data(col, userQuery, function(result) {
        if (null != result) {
            console.log("here is the result:");
            console.dir(result);
            console.log("hahahah");
            var uuid = result.uuid;
            var now = Date.now();
            var filename = uuid + '_' + now.toString() + '.' + filetype;
            var token = qiniu.GetUpToken(filename);
            //var localFile = '/Users/chenyulin/Documents/codes/node_project/server/public/images/fuck_me.jpeg';
            console.log('token= ' + token);
            //qiniu.UploadFile(token, filename, localFile);

            //save first
            var photoCol = 'photo';
            var photoQuery = { 'uuid': uuid, 'filename': filename }
            var data = { 'uuid': uuid, 'uptoken': token, 'filename': filename }
            dbMgr.save_data(photoCol, photoQuery, data, function(result) {
                if (0 == result) {
                    callback(StatusCode.GET_UPTOKEN_SUCCESS, { 'uptoken': token, 'filename': filename });
                } else {
                    callback(StatusCode.UNKNOWN_ERROR, {});
                }
            });
        } else {
            callback(StatusCode.ACCESS_TOKEN_EXPIRE, {});
        }
    });
}

module.exports.login = loginRequest;
module.exports.register = registerRequest;
module.exports.uptoken = getUpToken;
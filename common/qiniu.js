var qiniu_conf = require('../keys/qiniu_conf.js');
var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = qiniu_conf.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qiniu_conf.SECRET_KEY;

var GetUpToken = function(filename) {
    var putPolicy = new qiniu.rs.PutPolicy(qiniu_conf.BUCKET_NAME + ":" + filename);
    putPolicy.callbackUrl = qiniu_conf.CALL_BACK;
    putPolicy.callbackBody = qiniu_conf.CALL_BACK_BODY;
    return putPolicy.token();
};

var UploadFile = function(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
};

module.exports.GetUpToken = GetUpToken;
module.exports.UploadFile = UploadFile;
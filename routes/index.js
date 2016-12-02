var express = require('express');
var router = express.Router();
var login = require('./login.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
    var usr = req.query.usr;
    var pwd = req.query.pwd;
    login.login(usr, pwd, function(returnCode, returnData) {
        response_data_func(res, returnCode, returnData);
    });

});

router.get('/register', function(req, res) {
    var usr = req.query.usr;
    var pwd = req.query.pwd;
    login.register(usr, pwd, function(returnCode, returnData) {
        response_data_func(res, returnCode, returnData);
    });
});

router.get('/uptoken', function(req, res) {
    var filetype = req.query.fileType;
    var accessToken = req.query.accessToken;
    login.uptoken(accessToken, filetype, function(returnCode, returnData) {
        response_data_func(res, returnCode, returnData);
    });
});

var response_data_func = function(res, returnCode, returnData) {
    res.send('{"status":' + returnCode + ', "data":' + JSON.stringify(returnData) + '}');
};

module.exports = router;
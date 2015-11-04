var express = require('express');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var userService = require('../module/user');
var router = express.Router();
var error_handle = require('../common/error_handler');
var error_code = require('../common/error_code');

/* GET users listing. */
router.get('/profile/:id', function (req, res, next) {
  var data = {
    id: req.params.id || '',
  };

  userService.profile(data, function(err, queryResult){
    if(err){
      var error = new Error();
      error.message = err.message;
      return error_handle(res, error, error_code.ParamsError);
    }

    var result = {
      code:error_code.Success,
      msg:'',
      data:queryResult,
    }
    return res.json(result);
  });
});

router.post('/register', function (req, res, next) {
  var now = new Date().getTime();
  var data = {
    id: new ObjectID().toString(),
    nickName: 'fff',
    loginName: 'jlf_oneyuan',
    password: 'jlf_oneyuan',
    createTime: now,
    updateTime: now,
  };

  if (_.isEmpty(data.loginName) || _.isEmpty(data.password)) {
    var error = new Error();
    error.message = 'loginName or password is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  userService.register(data, function(err, insertResult){
    if(err){
      var error = new Error();
      error.message = err.message;
      return error_handle(res, error, error_code.ParamsError);
    }
    var result = {
      code:error_code.Success,
      msg:insertResult,
      data:[],
    }
    return res.json(result);
  });
});

router.get('/records',function(req, res, next){
  var data = {

  };

  userService.listRecordOfCrowdFund(data, function(err, queryResults){
    if(err){
      var error = new Error();
      error.message = err.message;
      return error_handle(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code: error_code.Success,
      msg: '',
      data:queryResults,
    };
    return res.json(result);
  });
});
router.post('/charge');
router.post('/login', function(req, res, next){
  var data = {
    loginName: req.body.loginName || '',
    password: req.body.password || '',
  };

  if (_.isEmpty(data.loginName) || _.isEmpty(data.password)) {
    var error = new Error();
    error.message = 'loginName or password is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  userService.login(data, function(err, loginResult){
    if(err){
      var error = new Error();
      error.message = err.message;
      return error_handle(res, error, error_code.ParamsError);
    }
    if(!_.isEmpty(loginResult) && loginResult.password == data.password){
      var result = {
        code: error_code.Success,
        msg: '',
        data:loginResult,
      };
      return res.json(result);
    }
    var result = {
      code: error_code.ParamsError,
      msg: 'password error!',
      data:'',
    };
    return res.json(result);
  });
});

module.exports = router;

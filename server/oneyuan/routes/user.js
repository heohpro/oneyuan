var express = require('express');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var userService = require('../module/user');
var router = express.Router();
var error_handle = require('../common/error_handler');
var error_code = require('../common/error_code');
var Thenjs = require('thenjs');
var authService = require('../module/user/auth');

/* GET users listing. */
router.get('/profile/:id', function (req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
  };

  if(_.isEmpty(data.SSID)){
    var error = new Error();
    error.message = 'param id is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  Thenjs(function(cont){
    authService.getUserId(data, function(err, userId){
      if(err){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.Error);
      }

      if(_.isEmpty(result)){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.InvalidCookies);
      }

      data.userId = userId;
      cont(null, data);
    });
  }).then(function(cont, arg){
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
  }).fail(function(err, cont){
    var error = new Error();
    error.message = err.message;
    return error_handle(res, error, error_code.Error);
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
    SSID: req.cookies.SSID || '',
  };

  if(_.isEmpty(data.SSID)){
    var error = new Error();
    error.message = 'param id is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  Thenjs(function(cont){
    authService.getUserId(data, function(err, userId){
      if(err){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.Error);
      }

      if(_.isEmpty(result)){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.InvalidCookies);
      }

      data.userId = userId;
      cont(null, data);
    });
  }).then(function(cont, arg){
    userService.listRecordsOfCrowdFund(arg, function(err, queryResults){
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
  }).fail(function(err, cont){
    var error = new Error();
    error.message = err.message;
    return error_handle(res, error, error_code.Error);
  });
});

router.post('/charge', function(req, res, next){
  var data={
    SSID: req.cookies.SSID || '',
    balance: req.body.balance || '',
  };

  if(_.isEmpty(data.SSID)){
    var error = new Error();
    error.message = 'param id is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  if(_.isEmpty(data.balance)){
    var error = new Error();
    error.message = 'param balance is empty!';
    return error_handle(res, error, error_code.ParamsError);
  }

  Thenjs(function(cont){
    authService.getUserId(data, function(err, userId){
      if(err){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.Error);
      }

      if(_.isEmpty(result)){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.InvalidCookies);
      }

      data.userId = userId;
      cont(null, data);
    });
  }).then(function(cont, arg){
    userService.charge(arg, function(err, chargeResult){
      if(err){
        var error = new Error();
        error.message = err.message;
        return error_handle(res, error, error_code.ParamsError);
      }

      var result = {
        code: error_code.Success,
        msg: chargeResult,
        data:chargeResult,
      };

      return res.json(result);
    });
  }).fail(function(err, cont){
    var error = new Error();
    error.message = err.message;
    return error_handle(res, error, error_code.Error);
  });
});

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

  Thenjs(function(cont){
    userService.login(data, function(err, loginResult){
      if(err){
        var error = new Error();
        error.message = err.message;
        return error_handle(res, error, error_code.ParamsError);
      }
      if(!_.isEmpty(loginResult) && loginResult.password == data.password){
        data.userId = loginResult.id;
        return cont(null, data);
      }
      var result = {
        code: error_code.ParamsError,
        msg: 'password error!',
        data:[],
      };
      return res.json(result);
    });
  }).then(function(cont, arg){
    authService.setUserId(arg, function(err, result){
      if(err){
        var error = new Error();
        error.message = err;
        return error_handle(res, error, error_code.Error);
      }

      res.cookie('SSID', result, {domain:'.oneyuan.com', path:'/'});
      var result = {
        code: error_code.Success,
        msg: '',
        data: [],
      };
      return res.json(result);
    });
  }).fail(function(err,cont){
    var error = new Error();
    error.message = err.message;
    return error_handle(res, error, error_code.Error);
  });
});

module.exports = router;

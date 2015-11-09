/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var router = require('express').Router();
var commodityService = require('../module/commodity');
var errorHandler = require('../common/error_handler');
var error_code = require('../common/error_code');
var Thenjs = require('thenjs');
var authService = require('../module/user/auth');
var logger = require('../common/logger');

router.get('/types', function(req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
  };

  commodityService.listType(data, function(err, typeList) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code: error_code.Success,
      msg: err,
      data: typeList,
    };
    return res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  var data = {
    commodityInstanceId: req.params.id || '',
    SSID: req.cookies.SSID || '',
  };

  Thenjs(function(cont) {
    commodityService.detail(data, function(err, commodity) {
      if (err) {
        var error = new Error();
        error.message = err;
        errorHandler(res, error, error_code.DatabaseQueryError);
      }

      cont(null, commodity);
    });
  }).then(function(cont, arg) {
    arg.joinStatus = false;
    var result = {
      code: error_code.Success,
      msg: '',
      data: arg,
    };

    if (_.isEmpty(data.SSID)) {
      return res.json(result);
    }

    authService.getUserId(data, function(err, userId) {
      if (err) {
        var error = new Error();
        error.message = err;
        return errorHandler(res, error, error_code.Error);
      }

      if (_.isEmpty(userId)) {
        return res.json(result);
      }

      data.userId = userId;
      cont(null, result)
    });
  }).then(function(cont, arg) {
    commodityService.isJoin(data, function(err, result) {
      if (err) {
        var error = new Error();
        error.message = err;
        return errorHandler(res, error, error_code.Error);
      }

      if (_.isEmpty(result)) {
        return res.json(arg);
      }

      arg.data.joinStatus = true;
      return res.json(arg);
    });
  }).fail(function(err, cont) {
    var error = new Error();
    error.message = err.message;
    return errorHandler(res, error, error_code.Error);
  });
});

router.get('/:id/records', function(req, res, next) {
  var data = {
    id: req.params.id || '',
    SSID: req.cookies.SSID || '',
  };

  Thenjs(function(cont) {
    commodityService.detail(data, function(err, commodity) {
      if (err) {
        var error = new Error();
        error.message = err;
        errorHandler(res, error, error_code.DatabaseQueryError);
      }

      var result = {
        code: error_code.Success,
        msg: err,
        data: {
          id: commodity.id,
          name: commodity.name
        }
      };
      cont(null, result);
    });
  }).then(function(cont, arg) {
    commodityService.listRecords(data, function(err, records) {
      if (err) {
        var error = new Error();
        error.message = err;
        errorHandler(res, error, error_code.DatabaseQueryError);
      }

      arg.data.records = records;
      return res.json(arg);
    });
  }).fail(function(err, cont) {
    var error = new Error();
    error.message = err.message;
    return errorHandler(res, error, error_code.Error);
  });

});

router.post('/buy', function(req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
    commodityInstanceId: req.body.id || '',
    count: req.body.qty || '',
  };

  if (_.isEmpty(data.SSID)) {
    var error = new Error();
    error.message = 'SSID is empty!';
    return errorHandler(res, error, error_code.InvalidCookies);
  }

  Thenjs(function(cont) {
    authService.getUserId(data, function(err, userId) {
      if (err) {
        var error = new Error();
        error.message = err;
        return errorHandler(res, error, error_code.Error);
      }

      if (_.isEmpty(userId)) {
        var error = new Error();
        error.message = err;
        return errorHandler(res, error, error_code.InvalidCookies);
      }

      data.userId = userId;
      cont(null, data);
    });
  }).then(function(cont, arg) {
    commodityService.purchaseCommodity(arg, function(err, buyResult) {
      if (err) {
        return cont(err, null);
      }

      var result = {
        code: error_code.Success,
        msg: err,
        data: {
          "buyStatus": 1,
          "message": "恭喜，购买成功！"
        }
      };
      logger
      return res.json(result);
    });
  }).fail(function(err, cont) {
    var error = new Error();
    error.message = err.message;
    return errorHandler(res, error, error_code.Error);
  });
});

router.get('/*', function(req, res, next) {
  var data = {
    typeCode: req.query.typeCode || '',
    pageNo: req.query.pageNo || '',
    pageSize: req.query.pageSize || '',
    SSID: req.cookies.SSID || '',
  }

  if (_.isEmpty(data.pageSize)) {
    var error = new Error();
    error.message = "Params pageSize is Empty!";
    errorHandler(res, error, error_code.ParamsError);
  }

  if (_.isEmpty(data.pageNo)) {
    data.pageNo = 1;
  }

  data.typeCode = data.typeCode + '%';

  data.start = (parseInt(data.pageNo) - 1) * data.pageSize;

  commodityService.listCommodity(data, function(err, commodities) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code: error_code.Success,
      msg: err,
      data: commodities,
    };
    return res.json(result);
  });
});

module.exports = router;
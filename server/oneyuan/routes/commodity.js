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
      data: arg
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

router.post('/initInstance', function(req, res, next) {
  var data = {
  };

  commodityService.initCrowdFund(data, function(err, result) {
    if (err) {
      return res.json({result: false});
    }

    return res.json({result: true});
  })
});

router.post('/addInstance', function(req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
    commodityId: req.body.id || '',
  };

  commodityService.generateCrowdFund(data, function(err, result) {
    if (err) {
      return res.json({result: false});
    }

    return res.json({result: true});
  })
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
  Thenjs(function(cont) {
    commodityService.listCommodity(data, function(err, commodities) {
      if (err) {
        var error = new Error();
        error.message = err;
        return cont(error, null);
      }

      return cont(null, commodities)
    });
  }).then(function(cont, arg) {
    var result = {
      code: error_code.Success,
      msg: '',
      data: {
        page: {
          currentPageNo: data.pageNo,
          pageSize: data.pageSize,
          totalCount: 0,
          totalPageCount: 0
        }
      }
    };

    commodityService.getCommodityNumber(data, function(err, totalNumber) {
      if (err) {
        var error = new Error();
        error.message = err;
        return cont(error, null);
      }

      if (parseInt(totalNumber) < 0) {
        result.data.pageContent = [];
        return res.json(result);
      }

      result.data.page.totalCount = totalNumber;
      result.data.page.totalPageCount = parseInt(parseInt(totalNumber) / data.pageSize) + 1;
      result.data.pageContent = arg;
      return res.json(result);
    });
  }).fail(function(err, cont) {
    var error = new Error();
    error.message = err.message;
    return errorHandler(res, error, error_code.DatabaseQueryError);
  });
});

router.post('/*', function(req, res, next) {
  var now = new Date().getTime();
  var data = {
    name: req.body.name || '',
    price: req.body.price || '',
    typeCode: req.body.typeCode || '',
    label: req.body.label || '',
    imageList: req.body.imageList || '',
    createTime: now,
    updateTime: now,
  };

  if (_.isEmpty(data.name)) {
    var error = new Error();
    error.message = "Params name is Empty!";
    return errorHandler(res, error, error_code.ParamsError);
  }

  if (_.isEmpty(data.price)) {
    var error = new Error();
    error.message = "Params price is Empty!";
    return errorHandler(res, error, error_code.ParamsError);
  }

  if (_.isEmpty(data.typeCode)) {
    var error = new Error();
    error.message = "Params typeCode is Empty!";
    return errorHandler(res, error, error_code.ParamsError);
  }

  if (_.isEmpty(data.imageList)) {
    var error = new Error();
    error.message = "Params imageList is Empty!";
    return errorHandler(res, error, error_code.ParamsError);
  }

  commodityService.addCommodity(data, function(err, result){
    if(err){
      var error = new Error();
      error.message = err;
      return errorHandler(res, error, error_code.DatabaseQueryError);
    }

    return res.json({result:'success to insert commodity :'+ data.name});
  });
});

module.exports = router;
/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var router = require('express').Router();
var commodityService = require('../module/commodity');
var errorHandler = require('../common/error_handler');
var error_code = require('../common/error_code');

router.get('/types', function(req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
  };

  commodityService.listType(data, function (err, typeList) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code:error_code.Success,
      msg:err,
      data:typeList,
    };
    return res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  var data = {
    id: req.params.id || '',
    SSID: req.cookies.SSID || '',
  };

  commodityService.detail(data, function(err, commodity) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code:error_code.Success,
      msg:err,
      data:commodity,
    };
    return res.json(result);
  });
});

router.get('/:id/records', function(req, res, next) {
  var data = {
    id: req.params.id || '',
    SSID: req.cookies.SSID || '',
  };

});

router.get('/*', function(req, res, next){
  var data = {
    typeCode: req.query.typeCode || '',
    pageNo: req.query.pageNo || '',
    pageSize: req.query.pageSize || '',
    SSID: req.cookies.SSID || '',
  }

  if(_.isEmpty(data.pageSize)){
    var error = new Error();
    error.message = "Params pageSize is Empty!";
    errorHandler(res, error, error_code.ParamsError);
  }

  if(_.isEmpty(data.pageNo)){
    data.pageNo = 1;
  }

  data.start = (parseInt(data.pageNo) - 1) * data.pageSize;
  data.end = parseInt(data.pageNo) * data.pageSize;

  commodityService.listCommodity(data, function(err, commodities){
    if(err){
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    var result = {
      code:error_code.Success,
      msg:err,
      data:commodities,
    };
    return res.json(result);
  });
});

module.exports = router;
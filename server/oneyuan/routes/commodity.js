/**
 * Created by jlf on 15/10/30.
 */
var router = require('express').Router();
var commodityService = require('../module/commodity');
var errorHandler = require('../common/error_handler');
var error_code = require('../common/error_code');

router.get('/types', function(req, res, next) {
  var data = {
    SSID: req.cookies.SSID || '',
  };

  commodityService.listType(data, function (err, result) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
    return res.json(result);
  });
});

router.get('/:id', function(req, res, next) {
  var data = {
    id: req.params.id || '',
    SSID: req.cookies.SSID || '',
  };

  commodityService.addCommodity(data, function(err, result) {
    if (err) {
      var error = new Error();
      error.message = err;
      errorHandler(res, error, error_code.DatabaseQueryError);
    }
  });
});
router.get('/:id/records', function(req, res, next) {

});
router.post('/buy');
router.get('/', function(req, res, next){
  var data = {
    typeCode: req.query.typeCode || '',
    pageNo: req.query.pageNo || '',
    pageSize: req.query.pageSize || '',
    SSID: req.cookies.SSID || '',
  }
});
module.exports = router;
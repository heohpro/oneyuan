/**
 * Created by jlf on 15/11/1.
 */
var ErrorCode = require('./error_code');
var _ = require('underscore');
var logger = require('./logger');

function errorHandler(res, error, errorCode) {
  res.status(400);
  if (_.isEmpty(errorCode)) {
    errorCode = ErrorCode.SysError;
  }

  var errorObj = {
    errCode: errorCode,
    errMsg: error.message
  };
  logger.error(res.req.originalUrl + ' Error:' + JSON.stringify(errorObj));
  return res.json(errorObj);
}

module.exports = errorHandler;
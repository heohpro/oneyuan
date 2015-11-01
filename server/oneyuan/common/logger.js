/**
 * Created by jlf on 15/11/1.
 */
var DEFAULT_FORMAT = ':remote-addr - -' + ' ":method uri[:url] HTTP/:http-version"'
  + ' :status :content-length ":referrer"' + ' ":user-agent"';
var log4js = require('log4js');
var logger = log4js.getLogger('oneyuan-log');

function logWrite(req, res, fmt) {
  var baseLog = fmt(DEFAULT_FORMAT);
  return baseLog;
}

function loggerInit(config) {
  log4js.configure(config);
  return log4js.connectLogger(log4js.getLogger('oneyuan-log'), logWrite);
}

function info(value) {
  logger.info(value);
}

function error(value) {
  logger.error(value);
}

module.exports = {
  loggerInit:loggerInit,
  info:info,
  error:error,
}
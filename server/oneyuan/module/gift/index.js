/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var redis = require('redis');
var config = require('config');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../common/logger');
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

function generateNumber(data, callback) {
  var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
    {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
  );
  redisConnection.on('error', function(err) {
    callback(err.message, null);
  });

  redisConnection.incr(data.commodityInstanceId, function(err, lottyNumber) {
    lottyNumber = 100000 + parseInt(lottyNumber);

    redisConnection.quit();
    callback(null, lottyNumber);
  });
}

function generateLuckyNumber(data, callback) {
  Thenjs(function(cont) {
    _getLastPeoplePurchaseTime(data, function(err, queryResults) {
      if (err) {
        return cont(err, null);
      }

      cont(null, queryResults);
    });
  }).then(function(cont, arg) {
    _getTotalNumberOfCrowdfund(data, function(err, queryResult) {
      if (err) {
        return cont(err, null);
      }

      data.totalNumber = queryResult;

      cont(null, arg);
    });
  }).then(function(cont, arg) {
    var sum = 0;
    arg.forEach(function(element, index, array) {
      var timeNumber = parseFloat(_formateTime(element.createTime));
      sum = sum + timeNumber;
    });

    cont(null, sum % data.totalNumber);
  }).then(function(cont, arg){
    if(_.isEmpty(arg)){
      return cont('fail to generate lucky number!');
    }

    data.luckyNumber = 100001 + parseFloat(arg);
    _addLuckyNumber(data, function(err, insertResult){
      if(err){
        return cont(err, null);
      }

      logger.info('LuckyNumber  crowdFundInstanceId:'+data.crowdfundInstanceId+' luckyNumber:'+data.luckyNumber);
      callback(null, 'success to generate luckyNumber!');
    })
  }).fail(function(err, cont) {
    return callback(err.message, null);
  });
}
function _formateTime(time) {
  var hour = time.getHours().toString();
  var minute = time.getMinutes().toString();
  var second = time.getSeconds().toString();
  var millisecond = time.getMilliseconds().toString();
  var hourString = hour.length == 2 ? hour : '0' + hour;
  var minuteString = minute.length == 2 ? minute : '0' + minute;
  var secondString = second.length == 2 ? second : '0' + second;
  var millisecondString = millisecond.length == 3 ? millisecond : millisecond.length == 2 ? '0' + millisecond : '00' + millisecond;
  return hourString + minuteString + secondString + millisecondString;
}

function _getLastPeoplePurchaseTime(data, callback) {
  mysqlConnection.query('select createTime from order_of_crowdfund where `crowdfundInstanceId`=? order by createTime desc limit 50', [data.crowdfundInstanceId], function(err, queryResults) {
    if (err) {
      logger.error(err.message);
      return callback(err.message, null);
    }
    return callback(null, queryResults);
  });
}

function _getTotalNumberOfCrowdfund(data, callback) {
  mysqlConnection.query('select totalNumber from crowdfund_instance where `id`=?', [data.crowdfundInstanceId], function(err, queryResults) {
    if (err) {
      logger.error(err.message);
      return callback(err.message, null);
    }

    if (_.isEmpty(queryResults)) {
      return callback(err.message, null);
    }
    return callback(null, queryResults[0]);
  });
}

function _addLuckyNumber(data, callback){
  mysqlConnection.query('update crowdfund_instance set luckyNumber=?, isFinish=1 where `id`=?', [data.luckyNumber,data.crowdfundInstanceId], function(err, insertResult) {
    if (err) {
      logger.error(err.message);
      return callback(err.message, null);
    }

    return callback(null, 'success to add luckyNumber!');
  });
}

module.exports = {
  generateNumber: generateNumber,
  generateLuckyNumber: generateLuckyNumber,
}
/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var redis = require('redis');
var config = require('config');
var logger = require('../../common/logger');
var ObjectID = require('mongodb').ObjectID;
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

function generateNumber(data, callback) {
  var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
    {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
  );
  redisConnection.on('error', function(err) {
    callback(err.message, null);
  });

  redisConnection.incr(data.commodityInstanceId, function(err, lottyNumber) {
    lottyNumber = 10000 + parseInt(lottyNumber);

    var now = new Date().getTime();
    mysqlConnection.query('insert into order_of_crowdfund values(?,?,?,?,?)' +
    '', [(new ObjectID).toString(), data.userId, data.commodityInstanceId, lottyNumber, now], function(err, result) {
      if (err) {
        callback('insert into order error', null);
      }

      callback(null, 'success buy');
    })
  });
}

function generateLuckyNumber(data) {
  mysqlConnection.query('select * from order_of_crowdfund where `crowdfundInstanceId`=? order by createTime limit 50', [data.crowdfundInstanceId], function(err, results) {
    if (err) {
      logger.error(err.message);
    }
    return results;
  });
}

module.exports = {
  generateNumber: generateNumber,
  generateLuckyNumber: generateLuckyNumber,
}
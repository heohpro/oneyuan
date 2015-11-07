/**
 * Created by jlf on 15/11/5.
 */
var redis = require('redis');
var config = require('config');
var logger = require('../../common/logger');

var EXPIRE_SECONDS = 3 * (24 * 60 * 60);
function setUserId(data, callback) {
  var SSID = data.userId.toString() + (new Date()).getTime().toString();
  var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
    {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
  );

  redisConnection.on('error', function(err){
    logger.error('function setUserId: redis connect error!');
    return callback(err.message, null);
  });

  redisConnection.setex(SSID,EXPIRE_SECONDS,data.userId, function(err, result){
    if(err){
      return callback(err.message, null);
    }

    redisConnection.quit();
    callback(null, SSID);
  });
}

function getUserId(data, callback){
  var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
    {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
  );

  redisConnection.on('error', function(err){
    logger.error('function getUserId: redis connect error!');
    return callback(err.message, null);
  });

  redisConnection.get(data.SSID, function(err, userId){
    if(err){
      return callback(err.message, null);
    }
    console.log(userId);
    redisConnection.quit();
    callback(null, userId);
  });
}

module.exports = {
  setUserId: setUserId,
  getUserId: getUserId,
}
/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var config = require('config');
var crypto = require('crypto');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../common/logger');
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

function register(data, callback) {
  data.password = crypto.createHash('md5').update(data.password).digest('hex');
  mysqlConnection.query('insert into user(`id`,`loginName`,`password`,`createTime`,`updateTime`) ' +
  'values(?,?,?,?,?)', [data.id, data.loginName, data.password, data.createTime, data.updateTime], function (err, insertResult) {
    if (err) {
      callback(err.message, null);
    }
    logger.info('Success register user----userId:'+data.id);
    callback(null, 'success register!');
  });
}

function login(data, callback) {
  data.password = crypto.createHash('md5').update(data.password).digest('hex');
  mysqlConnection.query('select * from user where `loginName`=?', [data.loginName], function (err, queryResult) {
    if (err) {
      callback(err.message, null);
    }
    callback('', queryResult[0]);
  });
}

function logout() {

}

function profile(data, callback) {
  mysqlConnection.query('select id,nickName,loginName userName,mobilePhone,balance from user where `id`=?', [data.userId], function (err, queryResult) {
    if (err) {
      return callback(err.message, null);
    }
    return callback(null, queryResult[0]);
  });
}

function listRecordsOfCrowdFund(data, callback) {
  mysqlConnection.query('select crow.id,crow.name,crow.totalNumber,crow.periodId,crow.currentNumber,crow.luckyNumber,crow.imageList from order_of_crowdfund order, crowdfund_instance crow ' +
  'where order.userId=? and order.crowdfundInstanceId = crow.id', [data.userId], function (err, queryResult) {
    if (err) {
      return callback(err.message, null);
    }
    return callback(null, queryResult);
  });
}

function charge(data, callback) {
  data.createTime = new Date().getTime();

  mysqlConnection.beginTransaction(function (err) {
    if (err) {
      return callback(err.message, null);
    }
    mysqlConnection.query('update user set `balance`=`balance`+? where `id`=?', [data.balance, data.userId], function (err, chargeResult) {
      if (err) {
        mysqlConnection.rollback(function (err) {
          return callback(err.message, null);
        });

        return callback(err.message, null);
      }

      mysqlConnection.query('insert into bill values(?,?,?,?,?,?)' +
      '', [(new ObjectID()).toString(), data.userId, "充值", data.balance, data.createTime, "充值"], function (err, insertResult) {
        if (err) {
          mysqlConnection.rollback(function (err) {
            if(err) {
              return callback(err.message, null);
            }
          });
          return callback(err.message, null);
        }

        mysqlConnection.commit(function (err) {
          if(err){
            return callback(err.message, null);
          }

          logger.info('Charge   userId:'+data.id+' balance:'+data.balance);
          return callback(null, "success charge");
        });
      });
    });
  });
}


  module.exports = {
    register: register,
    login: login,
    logout: logout,
    profile: profile,
    listRecordsOfCrowdFund: listRecordsOfCrowdFund,
    charge: charge,
  }
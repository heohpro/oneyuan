/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var config = require('config');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

function register(data, callback) {
  data.password = crypto.createHash('md5').update(data.password).digest('hex');
  mysqlConnection.query('insert into user(`id`,`loginName`,`password`,`createTime`,`updateTime`) ' +
  'values(?,?,?,?,?)', [data.id, data.loginName, data.password, data.createTime, data.updateTime], function (err, insertResult) {
    if (err) {
      callback(err.message, null);
    }
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
  mysqlConnection.query('select * from user where `id`=?', [data.userId], function (err, queryResult) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, queryResult[0]);
  });
}

function listRecordsOfCrowdFund(data, callback) {
  mysqlConnection.query('select * from order_of_crowdfund where `userId`=?', [data.userId], function (err, queryResult) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, queryResult);
  });
}

function charge(data, callback) {
  data.createTime = new Date().getTime();
  var trans = connection.startTransaction();
  mysqlConnection.query('update user set `balance`=`balance`+? where `id`=?', [data.balance, data.userId], function (err, chargeResult) {
    if (err) {
      trans.rollback();
      callback(err.message, null);
    }

    mysqlConnection.query('insert into bill values(?,?,?,?,?,?)' +
    '', [(new ObjectID()).toString(), data.userId, "充值", data.balance, data.createTime, "充值"], function (err, insertResult) {
      if (err) {
        trans.rollback();
        callback(err.message, null);
      }

      tran.commit();
      callback(null, "success charge");
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
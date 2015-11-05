/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var config = require('config');
var crypto = require('crypto');
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
  mysqlConnection.query('select * from user where `id`=?', [data.id], function (err, queryResult) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, queryResult[0]);
  });
}

function listRecordsOfCrowdFund(data, callback){
  mysqlConnection.query('select * from order_of_crowdfund where `userId`=?', [data.id], function (err, queryResult) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, queryResult);
  });
}

function charge(data, callback){
  //todo bill
  mysqlConnection.query('update user set `balance`=`balance`+? where `id`=?',[data.balance,data.id], function(err, chargeResult){
    if (err) {
      callback(err.message, null);
    }
    callback(null, chargeResult);
  });
}

module.exports = {
  register: register,
  login: login,
  logout: logout,
  profile: profile,
  listRecordsOfCrowdFund:listRecordsOfCrowdFund,
  charge:charge,
}
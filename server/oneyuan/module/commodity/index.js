/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

/**
 * 添加t类型*/
/**
 * 手机平板 10
 * 电脑办公 11
 * 数码影音 12
 * 女性时尚 20
 * 美食天地 30
 * 潮流新品 40
 * 其他商品 90
 */
function addType(data, callback) {
  var data = {
    id: new ObjectID().toString(),
    code: '90',
    typeName: '其他商品',
  };
  mysqlConnection.query('insert into type(`id`,`code`,`typeName`) values(?,?,?)', [data.id, data.code, data.typeName], function (err, rows) {
    if (err) {
      callback(err, null);
    }
    console.log(rows);
    (null, rows);
  });
}

function listType(data, callback) {
  mysqlConnection.query('select code, typeName as Name from type', function (err, rows) {
    if (err) {
      callback(err, null);
    }
    callback(null, rows);
  });
}

/**
 * 增加商品*/
function addCommodity(data, callback) {
  var now = new Date().getTime();
  var data = {
    id: new ObjectID().toString(),
    name: 'Apple iPhone6s Plus 64G 颜色随机 唯一的不同，就是处处不同',
    price: 8080,
    typeCode: '10',
    label: 'iphone6s 苹果',
    imageList: 'http://res.126.net/p/dbqb/one/148/898/2e9c1febb2ae050e1729ec54ebcb0075.jpg',
    createTime: now,
    updateTime: now,
  };
  mysqlConnection.query('insert into commodity(`id`,`name`,`price`,`typeCode`,`label`,`imageList`,`createTime`,`updateTime`) ' +
  'values(?,?,?,?,?,?,?,?)', [data.id, data.name, data.price, data.typeCode, data.label, data.imageList, data.createTime, data.updateTime], function (err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

/**
 * 列表查看商品众筹
 * */
function listCommodity(data, callback) {
  mysqlConnection.query('select * from commodity where `typeCode` = ? limit ?,?', [data.typeCode, data.start, data.end], function (err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

/**
 * 生成众筹实例
 */
function addCrowdFundInstance(data, callback) {
  var now = new Date().getTime();
  data.commodityId = data.id;
  data.id = new ObjectID().toString();
  data.startTime = now;
  data.endTime = now + 3 * 60 * 60 * 1000;
  mysqlConnection.query('insert into crowdfund_instance(`id`,`commodityId`,`periodId`,`totalNumber`,`startTime`,`endTime`) ' +
  'values(?,?,?,?,?,?)', [data.id, data.commodityId, 1, data.price, data.startTime, data.endTime], function (err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

/**
 * 某商品的众筹记录
 * */
function listRecordsOfCrowdFund(data, callback){
  mysqlConnection.query('select order.id as recordId, u.id as userId, u.loginName as name,order.createTime as joinTime from order_of_crowdfund order,user u ' +
  'where crowdfundInstanceId = ?', [data.id], function (err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

/**
 * 商品的详情
 * */
function detail(data, callback) {
  if (_.isEmpty(data.id)) {
    console.log('id is Empty!');
    return res.json("error");
  }
  mysqlConnection.query('select crow.id id,com.name name,com.imageList url,com.introduction desc,com.detail detail,' +
  'crow.totalNumber totalNumber,crow.currentNumber currentNumber,crow.createTime createTime,crow.updateTime updateTime ' +
  'from commodity com, crowdfund_instance crow ' +
  'where crow.id=? and com.id=crow.commodityId and crow.isFinish=0', [data.id], function (err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows[0]);
  });
}

module.exports = {
  addType: addType,
  listType: listType,
  addCommodity: addCommodity,
  listCommodity: listCommodity,
  detail: detail,
  addCrowdFundInstance: addCrowdFundInstance,
}
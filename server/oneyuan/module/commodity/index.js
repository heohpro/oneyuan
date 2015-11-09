/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var redis = require('redis');
var Thenjs = require('thenjs');
var logger = require('../../common/logger');
var giftService = require('../gift');
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
  mysqlConnection.query('insert into type(`id`,`code`,`typeName`) values(?,?,?)', [data.id, data.code, data.typeName], function(err, rows) {
    if (err) {
      callback(err, null);
    }
    console.log(rows);
    (null, rows);
  });
}

function listType(data, callback) {
  mysqlConnection.query('select code, typeName as Name from type', function(err, rows) {
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
    name: '阳澄湖大闸蟹礼盒 6只装998型礼品券 ',
    price: 35,
    typeCode: '30',
    label: '阳澄湖 螃蟹',
    imageList: 'http://res.126.net/p/dbqb/one/73/823/fb9ef42900a61b3c460f4e0fcfbb4713.jpg',
    createTime: now,
    updateTime: now,
  };
  mysqlConnection.query('insert into commodity(`id`,`name`,`price`,`typeCode`,`label`,`imageList`,`createTime`,`updateTime`) ' +
  'values(?,?,?,?,?,?,?,?)', [data.id, data.name, data.price, data.typeCode, data.label, data.imageList, data.createTime, data.updateTime], function(err, rows) {
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
  mysqlConnection.query('select crow.id id,com.name name,com.imageList url,com.introduction introduction,com.detail detail,' +
  'crow.totalNumber totalNumber,crow.currentNumber currentNumber,crow.startTime startTime,crow.endTime endTime ' +
  'from commodity com, crowdfund_instance crow ' +
  'where com.id=crow.commodityId and crow.isFinish=0 and com.typeCode like ? limit ?,?', [data.typeCode, parseInt(data.start), parseInt(data.pageSize)], function(err, rows) {
    if (err) {
      console.log(err);
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
  'values(?,?,?,?,?,?)', [data.id, data.commodityId, 1, data.price, data.startTime, data.endTime], function(err, rows) {
    if (err) {
      callback(err.message, null);
    }

    var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
      {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
    );

    redisConnection.on('error', function(err){
      logger.error('function getUserId: redis connect error!');
      return callback(err.message, null);
    });

    redisConnection.set(data.id,'0', function(err, ok){
      if(err){
        return callback(err.message, null);
      }

      redisConnection.quit();
      callback(null, ok);
    });  });


}

/**
 * 某商品的众筹记录
 * */
function listRecords(data, callback) {
  mysqlConnection.query('select order.id as recordId, u.id as userId, u.loginName as name,order.createTime as joinTime from order_of_crowdfund order,user u ' +
  'where crowdfundInstanceId = ?', [data.id], function(err, rows) {
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
  mysqlConnection.query('select crow.id id,com.name name,com.imageList url,com.introduction introduction,com.detail detail,' +
  'crow.totalNumber totalNumber,crow.currentNumber currentNumber,crow.startTime startTime,crow.endTime endTime ' +
  'from commodity com, crowdfund_instance crow ' +
  'where crow.id=? and com.id=crow.commodityId and crow.isFinish=0', [data.commodityInstanceId], function(err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows[0]);
  });
}

function isJoin(data, callback) {
  mysqlConnection.query('select id from order_of_crowdfund where `userId`=? and `crowdfundInstanceId`=? ', [data.userId, data.commodityInstanceId], function(err, rows) {
    if (err) {
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

function purchaseCommodity(data, callback){
  Thenjs(function(cont){
    giftService.generateNumber(data, function(err, generateResult){
      if(err){
        return cont(err, null);
      }

      data.lottyNumber = generateResult;
      cont(null,null);
    })
  }).then(function(cont, arg){
    _keepAccountOfPurchase(data, function(err, billResult){
      if(err){
        return callback(err, null);
      }

      return callback(null, 'success buy commodity!');
    })
  }).fail(function(err, cont){
    return callback(err.message, null);
  });
}

/**
 * 记账
 * */
function _keepAccountOfPurchase(data, callback){
  var now = new Date().getTime();
  mysqlConnection.beginTransaction(function(err, trans){
    if(err){
      return callback(err.message, null);
    }

    trans.query('insert into order_of_crowdfund values(?,?,?,?,?)' +
    '', [(new ObjectID).toString(), data.userId, data.commodityInstanceId, data.lottyNumber, now], function(err, result) {
      if (err) {
        trans.rollback(function(err){
          return callback(err.message, null);
        })
        return callback('insert into order error', null);
      }

      trans.query('insert into bill values(?,?,?,?,?,?)' +
      '', [(new ObjectID()).toString(), data.userId, "消费", data.count, now, "购买众筹商品"], function (err, insertResult) {
        if (err) {
          trans.rollback(function (err) {
            if(err) {
              return callback(err.message, null);
            }
          });
          return callback(err.message, null);
        }

        trans.commit(function (err) {
          if(err){
            return callback(err.message, null);
          }

          return callback(null, "success keepAccountOf Purchase");
        });
      });
    })
  })
}

module.exports = {
  addType: addType,
  listType: listType,
  addCommodity: addCommodity,
  listCommodity: listCommodity,
  detail: detail,
  addCrowdFundInstance: addCrowdFundInstance,
  listRecords: listRecords,
  isJoin: isJoin,
  purchaseCommodity:purchaseCommodity,
}
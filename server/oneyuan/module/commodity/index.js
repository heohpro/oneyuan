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
  mysqlConnection.query('select id, name, imageList url, introduction, detail,' +
  ' totalNumber, currentNumber, startTime, endTime ' +
  'from crowdfund_instance ' +
  'where isFinish=0 and typeCode like ? limit ?,?', [data.typeCode, parseInt(data.start), parseInt(data.pageSize)], function(err, rows) {
    if (err) {
      console.log(err);
      callback(err.message, null);
    }
    callback(null, rows);
  });
}

function getCommodityNumber(data, callback) {
  mysqlConnection.query('select count(id) num ' +
  'from crowdfund_instance ' +
  'where isFinish=0 and typeCode like ?', [data.typeCode], function(err, count) {
    if (err) {
      console.log(err);
      callback(err.message, null);
    }

    callback(null, count[0].num);
  });
}

/**
 * 生成众筹实例
 */
function _addCrowdFundInstance(data, callback) {
  var now = new Date().getTime();
  data.id = new ObjectID().toString();
  data.startTime = now;
  data.endTime = now + 3 * 60 * 60 * 1000;
  mysqlConnection.query('insert into crowdfund_instance(`id`,`commodityId`,`name`,`typeCode`,' +
  '`label`,`price`,`imageList`,`detail`,`introduction`,`periodId`,`totalNumber`,`startTime`,`endTime`) ' +
  'values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.id, data.commodityId, data.name, data.typeCode, data.label, data.price,
    data.imageList, data.detail, data.introduction, parseInt(data.crowdfundNumber) + 1, data.price, data.startTime, data.endTime], function(err, rows) {
    if (err) {
      callback(err.message, null);
    }

    var redisConnection = redis.createClient(config.get('redis.port'), config.get('redis.host'),
      {auth_pass: config.get('redis.password'), connect_timeout: config.get('redis.timeout')}
    );

    redisConnection.on('error', function(err) {
      logger.error('function getUserId: redis connect error!');
      return callback(err.message, null);
    });

    redisConnection.set(data.id, '0', function(err, ok) {
      if (err) {
        return callback(err.message, null);
      }

      redisConnection.quit();
      callback(null, ok);
    });
  });
}

function _getCommodityInfo(data, callback) {
  mysqlConnection.query('select * from commodity where `id`=?', [data.commodityId], function(err, queryResult) {
    if (err) {
      return callback(err.message, null);
    }

    if (_.isEmpty(queryResult)) {
      return callback('don`t exist commodity info!', null);
    }
    return callback(null, queryResult[0]);
  });
}

function _updateCommodityInfo(data, callback) {
  mysqlConnection.query('update commodity set `crowdfundNumber`=? where `id`=?', [data.crowdfundNumber, data.commodityId], function(err, queryResult) {
    if (err) {
      return callback(err.message, null);
    }

    if (_.isEmpty(queryResult)) {
      return callback('don`t exist commodity info!', null);
    }
    return callback(null, queryResult[0]);
  });
}

function generateCrowdFund(data, callback) {
  console.log(data);
  Thenjs(function(cont) {
    _getCommodityInfo(data, function(err, queryResult) {
      if (err) {
        var error = new Error();
        error.message = err;
        return cont(error, null);
      }

      cont(null, queryResult);
    });
  }).then(function(cont, arg) {
    arg.commodityId = data.commodityId;
    _addCrowdFundInstance(arg, function(err, addResult) {
      if (err) {
        var error = new Error();
        error.message = err;
        return cont(error, null);
      }

      cont(null, arg.crowdfundNumber)
    });
  }).then(function(cont, arg) {
    data.crowdfundNumber = parseInt(arg) + 1;
    _updateCommodityInfo(data, function(err, updateResult) {
      if (err) {
        var error = new Error();
        error.message = err;
        return cont(error, null);
      }

      return callback(null, 'addInstance success!');
    });
  }).fail(function(err, cont) {
    logger.error("module commodity: generateCrowdFund" + err.message);
  });
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
  mysqlConnection.query('select id, name,imageList url, introduction, detail,' +
  ' totalNumber, currentNumber, startTime, endTime ' +
  'from crowdfund_instance ' +
  'where id=? and isFinish=0', [data.commodityInstanceId], function(err, rows) {
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

function purchaseCommodity(data, callback) {
  Thenjs(function(cont) {
    giftService.generateNumber(data, function(err, generateResult) {
      if (err) {
        return cont(err, null);
      }

      data.lottyNumber = generateResult;
      cont();
    })
  }).then(function(cont, arg) {
    _keepAccountOfPurchase(data, function(err, billResult) {
      if (err) {
        return callback(err, null);
      }

      cont();
    })
  }).then(function(cont, arg) {
    _updateCrowdFundInstance(data, function(err, result) {
      if (err) {
        return callback(err, null);
      }

      return callback(null, 'success buy commodity!');
    });
  }).fail(function(err, cont) {
    return callback(err.message, null);
  });
}

function _updateCrowdFundInstance(data, callback) {
  mysqlConnection.query('update crowdfund_instance set `currentNumber`=? where `id`=?', [data.lottyNumber, data.commodityInstanceId], function(err, queryResult) {
    if (err) {
      return callback(err.message, null);
    }

    if (_.isEmpty(queryResult)) {
      return callback('don`t exist commodity info!', null);
    }
    return callback(null, queryResult[0]);
  });
}

/**
 * 记账
 * */
function _keepAccountOfPurchase(data, callback) {
  var now = new Date().getTime();
  mysqlConnection.beginTransaction(function(err, trans) {
    if (err) {
      return callback(err.message, null);
    }

    trans.query('insert into order_of_crowdfund values(?,?,?,?,?)' +
    '', [(new ObjectID).toString(), data.userId, data.commodityInstanceId, data.lottyNumber, now], function(err, result) {
      if (err) {
        trans.rollback(function(err) {
          return callback(err.message, null);
        })
        return callback('insert into order error', null);
      }

      trans.query('insert into bill values(?,?,?,?,?,?)' +
      '', [(new ObjectID()).toString(), data.userId, "消费", data.count, now, "购买众筹商品"], function(err, insertResult) {
        if (err) {
          trans.rollback(function(err) {
            if (err) {
              return callback(err.message, null);
            }
          });
          return callback(err.message, null);
        }

        trans.commit(function(err) {
          if (err) {
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
  getCommodityNumber: getCommodityNumber,
  detail: detail,
  listRecords: listRecords,
  isJoin: isJoin,
  purchaseCommodity: purchaseCommodity,
  generateCrowdFund: generateCrowdFund,
}
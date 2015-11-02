/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var mysqlConnection = require('mysql').createConnection(config.get('mysql'));

/**
 * 添加t类型*/
function addType(){
  var data = {
    id:new ObjectID().toString(),
    code:'10',
    typeName:'手机平板',
  };
}

function listType(data, callback){

}

 /**
 * 增加商品*/
function addCommodity(data, callback) {
  var now = new Date().getTime();
  var data = {
    id: new ObjectID().toString(),
    name: 'Apple iPhone6s Plus 64G 颜色随机 唯一的不同，就是处处不同',
    price: 8080,
    type: '10',
    label: 'iphone6s 苹果',
    imageList: 'http://res.126.net/p/dbqb/one/148/898/2e9c1febb2ae050e1729ec54ebcb0075.jpg',
    createTime: now,
    updateTime: now,
  };
   mysqlConnection.query('select 1+1 as ss',function(err, rows){
     console.log(rows);
   });

//   query.on('error', function(err){
//     console.log("dafads"+err);
//   });
}

function detail(data, callback) {

  if (_.isEmpty(data.id)) {
    console.log('id is Empty!');
    return res.json("error");
  }
}

module.exports = {
  addCommodity: addCommodity,
  detail: detail,
  listType: listType,
}
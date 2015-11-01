/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');

/**
 * 增加商品*/
function addCommodity(req, res) {

}

function detail(req, res) {
  var data = {
    SSID: req.cookies.SSID || '',
    id: req.params.id || '',
  };
  if(_.isEmpty(data.id)){
    console.log('id is Empty!');
    return res.json("error");
  }
}

module.exports = {
  addCommodity: addCommodity,
  detail: detail,
}
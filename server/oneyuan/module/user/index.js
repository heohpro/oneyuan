/**
 * Created by jlf on 15/10/30.
 */
var _ = require('underscore');

function login(req, res){
  var data = {
    loginName: req.body.loginName || '',
    password: req.body.password || '',
  };
}

function addUser(req, res) {
  var data = {
    loginName: req.body.loginName || '',
    password: req.body.password || '',
  };
}

module.exports = {
  login: login,
  addUser: addUser,
}
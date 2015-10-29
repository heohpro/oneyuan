var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./user');

/* GET home page. */
function setRoute(app){
  app.use(bodyParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/user', users);
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    console.log(req.url, err.message);
    res.status(err.status || 500);
    res.json({errCode:res.statusCode, errMsg:'资源未找到或内部错误'});
  });
}

module.exports = {
  setRoute: setRoute,
};

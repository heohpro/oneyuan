var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./common/logger');
var config = require('config');
var Router = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('*', function(req, res, next) {
  if (req.get('referrer')) {
    var refUrl = url.parse(req.get('referrer'));
    res.header('Access-Control-Allow-Origin', refUrl.protocol + '//' + refUrl.host);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cookie');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  }

  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger.loggerInit(config.get("log4js")));
Router.setRoute(app);
app.listen(config.get('port'));
console.log('Express Listen ' + config.get('port') + "---current_developName:"+ config.get("developName"));

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}


module.exports = app;

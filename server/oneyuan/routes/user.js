var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/profile', function(req, res, next) {
  console.log('ok');
  res.send('respond with a resource');
});
router.get('/records');
router.post('/charge');
router.post('/login')

module.exports = router;

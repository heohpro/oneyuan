/**
 * Created by jlf on 15/10/30.
 */
var router = require('express').Router();

router.get('/types');
router.get('/types/:id');
router.get('/:id/records');
router.post('/buy');
router.get('/');
module.exports = router;
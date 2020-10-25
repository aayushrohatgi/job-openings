var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index controller');
  res.render('index', { title: 'Position Openings Portal' });
});

module.exports = router;
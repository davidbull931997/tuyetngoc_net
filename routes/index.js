var express = require('express');
var router = express.Router();
var mongoHelper = require('./mongoHelper');
var adminLoginStatus = false;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  adminLoginStatus == true;
});

router.get('/admin', function (req, res, next) {
  mongoHelper.findDocuments({}, 'Customers', (result) => {
    res.render('admin', {
      title: 'Express',
      customerList: result
    });
  });
});

router.post('/admin/adminLogin', function (req, res, next) {
  if (req.body.username == 'minhtan' && req.body.password == 'minhtan') {
    if (adminLoginStatus == true) { //logged
      res.send({
        status: false,
        code: 1
      });
    } else {
      adminLoginStatus = true;
      res.send({ status: true });
    }
  }
  else//wrong user or password
    res.send({
      status: false,
      code: 2
    });
});

router.post('/admin/adminUnLoad', function (req, res, next) {
  adminLoginStatus = false;
  res.end();
});

router.post('/admin/newUser', function (req, res, next) {
  // req.body.id,
  // req.body.username,
  // req.body.playtime,
  // req.body.release_card_day,
  // req.body.expire_card_day,
  // req.body.card_quantity
  mongoHelper.insertDocument({
    id: req.body.id,
    username: req.body.username,
    playtime: req.body.playtime,
    release_card_day: req.body.release_card_day,
    expire_card_day: req.body.expire_card_day,
    card_quantity: req.body.card_quantity
  }, 'Customers', () => {
    res.end();
  });
});

module.exports = router;
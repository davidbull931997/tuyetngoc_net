var express = require('express');
var router = express.Router();
var mongoHelper = require('./mongoHelper');
var adminLoginStatus = false;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'TuyetNgoc - Member' });
});

router.get('/admin', function (req, res, next) {
  mongoHelper.findDocuments({}, 'Customers', (result) => {
    res.render('admin', {
      title: 'TuyetNgoc - Admin',
      customerList: result
    });
  });
});

router.post('/getUser', function (req, res, next) {
  console.log(req.body);
  mongoHelper.findDocument({ username: req.body }, 'Customers', (result) => {
    if (result) {
      res.send({ flag: true, user: result });
      console.log(result);
    }
    else {
      res.send({ flag: false });
      console.log(result);
    }
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
  mongoHelper.insertDocument({
    username: req.body.username,
    playtime: req.body.playtime,
    release_card_day: req.body.release_card_day,
    expire_card_day: req.body.expire_card_day,
    card_quantity: req.body.card_quantity,
    reward: req.body['reward[]']
  }, 'Customers', (result) => {
    res.send(result.insertedId);
  });
});

router.post('/admin/removeUser', function (req, res, next) {
  mongoHelper.removeDocument(req.body._id, 'Customers', (result) => {
    res.end();
  });
});

router.post('/admin/updateUser', function (req, res, next) {
  mongoHelper.updateDocument(req.body._id, {
    playtime: req.body.playtime,
    card_quantity: req.body.card_quantity,
    reward: req.body['reward[]']
  }, 'Customers', (result) => {
    res.end();
  });
});

module.exports = router;
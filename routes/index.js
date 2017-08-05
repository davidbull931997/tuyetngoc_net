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
  mongoHelper.findDocuments({}, 'Customers', (result) => {
    if (result.length) {
      result.sort((a, b) => b["playtime"] - a["playtime"]);
      var i, user = {};
      for (i = 1; i <= result.length; i++) {
        if (result[i - 1].username.toUpperCase() == req.body.username) {
          user = result[i - 1];
          user.rank = i;
          break;
        }
      }
      if (user.username != undefined)
        res.send({ flag: true, user: user });
      else
        res.send({ flag: false });
    }
    else
      res.send({ flag: false });
  });
});

router.post('/admin/wakeHerokuApp', function (req, res, next) {
  console.log(`Wake Heroku app at ip address: ${req.ip}`);
  res.end();
});

router.post('/admin/adminLogin', function (req, res, next) {
  if (req.body.username == 'tabaminhtan' && req.body.password == '0947707703') {
    if (adminLoginStatus == true) { //logged
      res.send({
        status: false,
        code: 1
      });
    } else {
      console.log(`Admin login at ip adress: ${req.ip}`);
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
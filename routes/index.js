var express = require('express');
var router = express.Router();
var mongoHelper = require('./mongoHelper');
var adminLoginStatus = false;
const firebase = require('firebase-admin');
firebase.initializeApp({
    credential: firebase.credential.cert(require('./tuyetngoc-net-firebase-adminsdk-br29u-fd3536f90b.json')),
    databaseURL: "https://tuyetngoc-net.firebaseio.com"
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'TuyetNgoc - Member' });
});

router.get('/game', function (req, res, next) {
    res.render('game/index', { title: 'TuyetNgoc - Member' });
});

router.get('/admin', function (req, res, next) {
    firebase.firestore()
        .collection('customers')
        .get()
        .then(result => {
            var customers = [];
            result.docs.forEach(customer => customers.push({ _id: customer.id, ...customer.data() }));
            res.render('admin', {
                title: 'TuyetNgoc',
                customerList: customers
            });
        })
        .catch(err => console.log(err));
});

router.post('/getUser', function (req, res, next) {
    firebase.firestore()
        .collection('customers')
        .where('username', '==', req.body.username)
        .get()
        .then(r => {
            if (r.size) {
                var userInfo = r.docs[0].data();
                if (userInfo.password == req.body.password) {
                    delete userInfo.password;
                    userInfo._id = r.docs[0].id;
                    res.send({ flag: true, user: userInfo });
                } else res.send({ flag: 'password' });
            } else res.send({ flag: 'username' });
        })
        .catch(err => console.log(err));
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
    firebase.firestore()
        .collection('customers')
        .add({
            username: req.body.username,
            password: req.body.password,
            roll: parseInt(req.body.roll),
            playtime: parseInt(req.body.playtime),
            release_card_day: req.body.release_card_day,
            expire_card_day: req.body.expire_card_day,
            card_quantity: parseInt(req.body.card_quantity),
            reward: req.body['reward[]'],
            reward_history: req.body['reward_history[]']
        })
        .then(r => res.end(r.id))
        .catch(err => console.log(err));
});

router.post('/admin/removeUser', function (req, res, next) {
    firebase.firestore()
        .collection('customers')
        .doc(req.body._id)
        .delete()
        .then(r => res.end())
        .catch(err => console.log(err));
});

router.post('/admin/updateUser', function (req, res, next) {
    var newData = {
        //expire_card_day: req.body.expire_card_day,
        roll: parseInt(req.body.roll),
        //release_card_day: req.body.release_card_day,
        playtime: parseInt(req.body.playtime),
        reward: req.body['reward[]'],
        card_quantity: parseInt(req.body.card_quantity),
        password: req.body.password,
        reward_history: req.body['reward_history[]']
    };

    firebase.firestore()
        .collection('customers')
        .doc(req.body._id)
        .update(newData)
        .then(r => res.end())
        .catch(err => console.log(err));
});

module.exports = router;
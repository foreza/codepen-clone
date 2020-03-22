var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET Dashboard page. */
router.get('/dashboard', [collections.checkUserExists, collections.checkAuthState], function(req, res, next) {
  res.render('dashboard', { title: `Dashboard for:  ${req.session.user.fullName}` });
});

/* GET Pen page. */
router.get('/pen', [collections.checkUserExists, collections.checkAuthState], function(req, res, next) {
  res.render('pen', { title: 'Pen' });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/dashboard');
});

router.get('/logout', function (req, res, next) {
  req.session.reset();
  res.redirect('/login');
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
  res.render('dashboard', { title: `Dashboard for:  ${req.session.user.fullName}`, userId: `${req.session.user.id}` });
});

/* GET Pen page (for new pens) */
router.get('/pen', [collections.checkUserExists, collections.checkAuthState], (req, res, next) => {
  res.render('pen', { title: 'Pen', userId: req.session.user.id, penId: null});
});

/* GET Pen page (for existing pen) */
router.get('/:userId/pen/:penId', [collections.checkUserExists, collections.checkAuthState],  function (req, res, next) {
  res.render('pen', { title: 'Pen', userId: req.session.user.id, penId: req.params.penId});
});



module.exports = router;

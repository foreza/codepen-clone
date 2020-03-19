var express = require('express');
var router = express.Router();
var userUtil = require('../dbUtils/userUtils')

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
router.get('/dashboard', async function(req, res, next) {

  // TODO: move this into it's own middle ware so we can use this everywhere selectively
  if (req.session && req.session.user) {

    const user = await userUtil.checkUserSessionForID(req.session.user);   // ingest the id

    if (user.length > 0) {
      req.session.user = user[0].id;  
      res.locals.user = user[0].id;
      res.render('dashboard', { title: 'Dashboard' });
      
    } else {
      req.session.reset();
      res.redirect(301, '/login')
    }




  } else {
    res.redirect(301, '/login')
  }
  

});

router.get('/pen', function(req, res, next) {
  res.render('pen', { title: 'Pen' });
});

module.exports = router;

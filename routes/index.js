var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/dashboard');
});

router.get('/logout', function (req, res, next) {
  req.session.reset();
  res.redirect('/login');
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Signup' });
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET Dashboard page. */
router.get('/dashboard', [collections.checkUserExists, collections.checkAuthState], function (req, res, next) {

  let renderParams = {
    "userId": req.session.user.id,
    "username": req.session.user.username,
    "title": `Dashboard for: ${req.session.user.fullName}`,
    "pen": null
  }

  console.log(renderParams);

  res.render('dashboard', renderParams);
});

/* GET Pen page (for new pens) */
router.get('/pen', [collections.checkUserExists, collections.checkAuthState], (req, res, next) => {

  let renderParams = {
    "userId": req.session.user.id,
    "username": req.session.user.username,
    "title": 'Untitled Pen',
    "pen": null
  }
  res.render('pen', renderParams);
});

/* GET Pen page (for existing pen) */
router.get('/:username/pen/:hashId', [collections.checkUserExists, collections.checkAuthState, collections.decodeToPenId], async (req, res, next) => {

  try {
    const pen = await penUtil.getPenByPenIDTransaction(req.params.penId);
    let renderParams = {
      "userId": req.session.user.id,
      "username": req.session.user.username,
      "title": pen.penInfo.penName,
      "pen": {
        "penInfo": JSON.stringify(pen.penInfo),
        "penFragments": JSON.stringify(pen.penFragments),
        "penExternals": JSON.stringify(pen.penExternals)
      }
    }

    console.log(renderParams);
    res.render('pen', renderParams);
  } catch (err) {
    console.log("Error with retrieving pen: ", err);
    res.sendStatus(404);
  }
  
});


// TODO: 
router.get('/:userId', [collections.checkUserExists, collections.checkAuthState], async (req, res, next) => {
  res.redirect('/dashboard');
});



module.exports = router;

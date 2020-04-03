var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')
var penFragmentUtil = require('../dbUtils/penFragmentUtils')



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
  res.render('dashboard', { title: `Dashboard for:  ${req.session.user.fullName}`, userId: `${req.session.user.id}` });
});

/* GET Pen page (for new pens) */
router.get('/pen', [collections.checkUserExists, collections.checkAuthState], (req, res, next) => {
  
  let renderParams = {
    "userId": req.session.user.id,
    "title": 'New Pen',
    "pen": null
  }
  res.render('pen', renderParams);
});

/* GET Pen page (for existing pen) */
router.get('/:userId/pen/:penId', [collections.checkUserExists, collections.checkAuthState], async (req, res, next) => {

  const pen = (await penUtil.getPenByPenID(req.params.penId))[0];

  if (!pen) {
    res.sendStatus(404);
  } else {
    const penFragments = await penFragmentUtil.getFragmentsByPenId(req.params.penId);
    
    let renderParams = {
      "userId": req.session.user.id,
      "title": pen.penName,
      "pen": {
        "penInfo": pen,
        "penFragments": penFragments
      }
    }

    console.log("renderParams: ", renderParams);
    res.render('pen', renderParams);
  }


});


// TODO: 
router.get('/:userId', [collections.checkUserExists, collections.checkAuthState], async (req, res, next) => {
  res.redirect('/dashboard');
});



module.exports = router;

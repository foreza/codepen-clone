var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')
var penFragmentUtil = require('../dbUtils/penFragmentUtils')
var penExternalUtil = require('../dbUtils/penExternalUtils')




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
    "user": JSON.stringify(req.session.user),
    "title": `Dashboard for:  ${req.session.user.fullName}`,
    "pen": null
  }

  res.render('dashboard', renderParams);
});

/* GET Pen page (for new pens) */
router.get('/pen', [collections.checkUserExists, collections.checkAuthState], (req, res, next) => {
  
  let renderParams = {
    "user": JSON.stringify(req.session.user),
    "username": req.session.user.username,
    "title": 'New Pen',
    "pen": null
  }
  res.render('pen', renderParams);
});

/* GET Pen page (for existing pen) */
router.get('/:username/pen/:penId', [collections.checkUserExists, collections.checkAuthState], async (req, res, next) => {
  
  // Note: username param is not used at present

  const pen = (await penUtil.getPenByPenID(req.params.penId))[0];

  if (!pen) {
    res.sendStatus(404);
  } else {
    const penFragments = await penFragmentUtil.getFragmentsByPenId(req.params.penId);
    const penExternals = await penExternalUtil.getExternalsByPenId(req.params.penId);
    
    let renderParams = {
      "user": JSON.stringify(req.session.user),
      "username": req.session.user.username,
      "title": pen.penName,
      "pen": {
        "penInfo": JSON.stringify(pen),
        "penFragments": JSON.stringify(penFragments),
        "penExternals": JSON.stringify(penExternals)
      }
    }

    console.log(renderParams);

    res.render('pen', renderParams);
  }

});


// TODO: 
router.get('/:userId', [collections.checkUserExists, collections.checkAuthState], async (req, res, next) => {
  res.redirect('/dashboard');
});



module.exports = router;

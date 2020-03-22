var express = require('express');
var router = express.Router();
var userUtil = require('../dbUtils/userUtils')
var collections = require('../middleware/collections')
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', [collections.validateUserLogin], async function (req, res, next) {

  const user = await userUtil.checkValidUser(req);

  if (user.length === 0) {
    res.sendStatus(401);
  } else {
    const result = await bcrypt.compare(req.body.password, user[0].password);
    if (result) {
      req.session.user = user[0].id;      // use the id as the cookie value
      res.sendStatus(200);                // how do we redirect with ejs?
    } else {
      res.sendStatus(401);
    }

  }

});


router.post('/', [collections.validateUserCreation], async function (req, res, next) {

  // TODO: add BE validation check
  const user = req.body;

  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    user.password = hash;
    await userUtil.addUserQuery(user);
    res.sendStatus(201);
  });
});





module.exports = router;

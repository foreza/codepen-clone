var express = require('express');
var router = express.Router();
var userUtil = require('../dbUtils/userUtils')
var collections = require('../middleware/collections')
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET user by ID */
router.get('/:id', async function (req, res, next) {

  console.log("Lookup by this id: ", req.params.id);
  const user = await userUtil.getUserById(req.params.id);

  if (!user) {
    res.sendStatus(404);
  } else {
    res.json(user)
  }

});

/* POST new user */ 
router.post('/', [collections.validateUserCreation], async function (req, res, next) {
  const user = req.body;
  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    user.password = hash;
    const newUser = await userUtil.addUser(user);
    console.log(newUser[0][0]);
    res.status(201).json(newUser[0][0]);
  });
});

router.post('/login', [collections.validateUserLogin], async function (req, res, next) {

  const fetchedUser = await userUtil.checkValidUser(req.body);

  if (fetchedUser.length === 0) {
    res.sendStatus(401);
  } else {
    const result = await bcrypt.compare(req.body.password, fetchedUser[0].password);
    if (result) {
      req.session.user = fetchedUser[0];
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }

  }

});


router.get('/', function (req, res, next) {
  res.sendStatus(200);
});







module.exports = router;

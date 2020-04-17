var express = require('express');
var router = express.Router();
var userUtil = require('../dbUtils/userUtils')
var collections = require('../middleware/collections')
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET user by ID */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userUtil.getUserById(req.params.id);
    if (!user) {
      throw Error("User object empty");
    } else {
      res.json(user)
    }
  } catch (err) {
    console.error(`Get User failed: ${err}`)
    res.sendStatus(404);
  }
});

/* POST new user */ 
router.post('/', [collections.validateUserCreation], (req, res, next) => {
  const user = req.body;
  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    user.password = hash;
    try {
      const newUser = await userUtil.addUser(user);
      if (!newUser) {
        throw Error("New user object empty")
      } else {
        res.status(201).json(newUser[0][0]);
      }
    } catch (err) {
      console.error(`POST User failed: ${err}`)
      res.sendStatus(400);
    }

  });
});

/* LOGIN user */ 
router.post('/login', [collections.validateUserLogin], async (req, res, next) => {
  try {
    const fetchedUser = await userUtil.checkValidUser(req.body);
    if (fetchedUser.length === 0) {
      throw Error("Fetched User is invalid")
    } else {
      const result = await bcrypt.compare(req.body.password, fetchedUser[0].password);
      if (result) {
        req.session.user = fetchedUser[0];
        res.sendStatus(200);
      } else {
        throw Error("Invalid credentials")
      }
    }
  } catch (err) {
    console.error(`LOGIN User failed: ${err}`)
    res.sendStatus(401);
  }
 

});

/* Default */ 
router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

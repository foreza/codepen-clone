var express = require('express');
var router = express.Router();
var userUtil = require('../dbUtils/userUtils')


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', async function (req, res, next) {

  // TODO: add BE validation check
    const user = await userUtil.checkValidUser(req);

    if (user.length === 0){      
      res.sendStatus(401);
    } else {
      console.log(`Matching: ${user[0].password} to ${req.query.password}`)
      if (user[0].password === req.query.password){
        req.session.user = user[0].id;      // use the id as the cookie value
        res.sendStatus(200); // how do we redirect with ejs?
      } else {
        res.sendStatus(401);
      }
    } 
  
});


router.post('/', [], async function (req, res, next) {

  // TODO: add BE validation check

  const user = await userUtil.addUserQuery(req);
  if (user.length === 0) {
    // handle better
    res.sendStatus(403);
  } else {
    res.sendStatus(201);
  }
  

});





module.exports = router;

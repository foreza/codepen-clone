var express = require('express');
var router = express.Router();
var db = require('../models/index')
var userUtil = require('../dbUtils/userUtils')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', async function (req, res, next) {

  // TODO: add BE validation check

    const user = await db.sequelize.query(userUtil.checkValidUser, {
      replacements: { ...req.query},
      type: db.sequelize.QueryTypes.SELECT
    });

    if (user.length > 0){
      res.cookie('kookie', `${user[0].id}`)
      res.redirect(301, '/dashboard');
    } else {
      res.sendStatus(401);
    }
 
  
});


router.post('/', [], async function (req, res, next) {

  // TODO: add BE validation check

  await db.sequelize.query(userUtil.addUserQuery, {
    replacements: { ...req.body, createdAt: new Date() },
    type: db.sequelize.QueryTypes.INSERT
  });

  res.sendStatus(201);

});





module.exports = router;

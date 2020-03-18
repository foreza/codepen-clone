var express = require('express');
var router = express.Router();
var db = require('../models/index')
var userUtil = require('../dbUtils/userUtils')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
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

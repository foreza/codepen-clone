var express = require('express');
var router = express.Router();
var penUtil = require('../dbUtils/penUtils')


const penLimit = 50;

// Get Pen given a pen ID
router.get('/:id', async (req, res, next) => {
    console.log("Get pen by this id: ", req.params.id);
    const pen = await penUtil.getPenByPenID(req.params.id);
    if (!pen) {
      res.sendStatus(404);
    } else {
      res.json(pen);
    }
});

// Get a collection of pens given a user ID
router.get('/user/:userId', async (req, res, next) => {
    console.log("Get pens by this user id: ", req.params.userId);
    const penList = await penUtil.getPenByUserID(req.params.userId, penLimit);
    if (!penList) {
      res.sendStatus(404);
    } else {
      res.json(penList);
    }
});


// Update everything about a pen given a pen ID
router.put('/:id', async (req, res, next) => {
    console.log("Update pen by this id: ", req.body);
    const updatedPen = await penUtil.updatePenContentByPenID(req.body);
    if (!updatedPen) {
      res.sendStatus(404);
    } else {
      res.json(updatedPen);
    }
});

// Create a new pen
router.post('/', [], async (req, res, next) => {
    console.log("Adding new pen. Req body: ", req.body);
    const pen = req.body;
    const newPen = await penUtil.addNewPen(pen);
    console.log("Returned from DB:", newPen[0][0]);
    res.status(201).json(newPen[0][0]);
  });


router.get('/', (req, res, next) => {
    res.sendStatus(200);
});

module.exports = router;

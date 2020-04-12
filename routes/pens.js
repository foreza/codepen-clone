var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
const penLimit = 50;


// Both work! TODO: Which one is "better"?

// router.get('/:id', collections.checkPenIDValidity, (req, res, next) => {
//   penUtil.getPenByPenIDTransaction(req.params.id)
//     .then(pen => {
//       res.json(pen);
//     }).catch(err => {
//       console.error(`GET Pen Error: ${err}`);
//       res.sendStatus(404);
//     });
// });


router.get('/:id', collections.checkPenIDValidity, async (req, res, next) => {
  try {
    const pen = await penUtil.getPenByPenIDTransaction(req.params.id);
    res.json(pen);
  } catch (err) {
    console.error(`GET Pen Error: ${err}`);
    res.sendStatus(404);
  }
});



// Get a collection of pens given a user ID
router.get('/user/:userId', async (req, res, next) => {
  const penList = await penUtil.getPenByUserID(req.params.userId, penLimit);
  if (!penList) {
    res.sendStatus(404);
  } else {
    for (var i = 0; i < penList.length; ++i) {
      const newhashId = hashids.encode(penList[i].penId);
      penList[i].hashId = newhashId;
    }
    res.json(penList);
  }
});


// Update everything about a pen given a pen ID
router.put('/:penId', [], async (req, res, next) => {
  const updatedPen = await penUtil.updatePenContentByTransaction(req.body).catch(
    err => {
      console.error(`Pen Update Error: ${err}`);
      res.sendStatus(400);
    });
  if (!updatedPen || updatedPen.length <= 0) {
    res.sendStatus(404);
  } else {
    res.json(updatedPen);
  }

});


// Create a new pen
router.post('/', (req, res, next) => {
  penUtil.addNewPenByTransaction(req.body).then(pen => {
    if (pen) {
      newPen = pen[0];
      console.log("Added new pen: ", newPen);
      const newhashId = hashids.encode(newPen[0].penId);
      console.log(`[encodeToHashId] - Converted ${newPen[0].penId} to ${newhashId}`);
      newPen[0].hashId = newhashId;
      res.status(201).json(newPen[0]);
    }
  }).catch(err => {
    console.error(`Pen Creation Error:", ${err}`);
    res.sendStatus(400);  // 
  });
});


router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

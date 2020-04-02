var express = require('express');
var router = express.Router();
var penUtil = require('../dbUtils/penUtils')
var penFragmentUtil = require('../dbUtils/penFragmentUtils')
const penLimit = 50;

// Get Pen and associated Pen fragments given pen ID
router.get('/:id', async (req, res, next) => {
  const pen = await penUtil.getPenByPenID(req.params.id);
  if (!pen || pen.length === 0) {
    res.sendStatus(404);
  } else {
    const penFragments = await penFragmentUtil.getFragmentsByPenId(req.params.id);
    const responsePayload = {
      penInfo: pen[0],
      penFragments: penFragments
    };
    res.json(responsePayload);
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
router.put('/:penId', async (req, res, next) => {
  console.log("Update pen by this penId: ", req.params.penId);

  // Building around this
  // const body = {
  //   penInfo: pen[0],
  //   penFragments: penFragments
  // };

  const updatedPen = await penUtil.updatePenContentByPenID(req.body.penInfo);
  if (!updatedPen || updatedPen.length <= 0) {
    res.sendStatus(404);
  } else {
    const fragmentUpdates = req.body.penFragments;
    for (var i = 0; i < fragmentUpdates.length; ++i) {
      const fragmentUpdate = {
        fragmentId: fragmentUpdates[i].fragmentId,
        body: fragmentUpdates[i].body ? fragmentUpdates[i].body : null,
        htmlClass: fragmentUpdates[i].htmlClass ? fragmentUpdates[i].htmlClass : null,
        htmlHead: fragmentUpdates[i].htmlHead ? fragmentUpdates[i].htmlHead : null,
      }

      await penFragmentUtil.updatePenFragment(fragmentUpdate);
    }

    res.json(updatedPen[0][0]);

  }

});

// Create a new pen
router.post('/', [], async (req, res, next) => {
  console.log("Adding new pen. Req body: ", req.body);

  // Building around this
  // const body = {
  //   penInfo: pen[0],
  //   penFragments: penFragments
  // };

  const pen = req.body.penInfo;
  const newPen = (await penUtil.addNewPen(pen))[0];

  if (!newPen || newPen.length <= 0) {
    res.sendStatus(404);
  } else {
    const fragments = req.body.penFragments;

    for (var i = 0; i < fragments.length; ++i) {

      const fragmentBody = {
        penId: newPen[0].penId,
        fragmentType: fragments[i].fragmentType,
        body: fragments[i].body ? fragments[i].body : null,
        htmlClass: fragments[i].htmlClass ? fragments[i].htmlClass : null,
        htmlHead: fragments[i].htmlHead ? fragments[i].htmlHead : null,
        createdAt: new Date()
      }

      await penFragmentUtil.createPenFragment(fragmentBody);

    }
    res.status(201).json(newPen[0]);
  }

});


router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

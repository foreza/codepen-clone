var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')
var penFragmentUtil = require('../dbUtils/penFragmentUtils')
var penExternalUtil = require('../dbUtils/penExternalUtils')
const Hashids = require('hashids/cjs')
const hashids = new Hashids()

const penLimit = 50;

// Get Pen and associated Pen fragments given pen ID
// router.get('/:id', [collections.checkPenIDValidity], async (req, res, next) => {
//   const pen = await penUtil.getPenByPenID(req.params.id);
//   if (!pen || pen.length === 0) {
//     res.sendStatus(404);
//   } else {
//     const penFragments = await penFragmentUtil.getFragmentsByPenId(req.params.id);
//     const penExternals = await penExternalUtil.getExternalsByPenId(req.params.id);
//     const responsePayload = {
//       penInfo: pen[0],
//       penFragments: penFragments,
//       penExternals: penExternals
//     };
//     res.json(responsePayload);
//   }
// });


router.get('/:id', [collections.checkPenIDValidity], async (req, res, next) => {
  const pen = await penUtil.getPenByPenIDTransaction(req.params.id);
  console.log(pen);
  if (!pen) {
    res.sendStatus(404);
  } else {
    res.json(pen);
  }
});


// Get a collection of pens given a user ID
router.get('/user/:userId', async (req, res, next) => {
  const penList = await penUtil.getPenByUserID(req.params.userId, penLimit);
  if (!penList) {
    res.sendStatus(404);
  } else {
    for (var i = 0; i < penList.length; ++i){
      const newhashId = hashids.encode(penList[i].penId);
      penList[i].hashId = newhashId;
    }
    res.json(penList);
  }
});


// Update everything about a pen given a pen ID
router.put('/:penId', [], async (req, res, next) => {

  const updatedPen = await penUtil.updatePenContentByTransaction(req.body);
  
  if (!updatedPen || updatedPen.length <= 0) {
    res.sendStatus(404);
  } else {
    res.json(updatedPen);
  }

});


// Update everything about a pen given a pen ID
router.delete('/:penId/external/:externalId', async (req, res, next) => {
  try {
    penExternalUtil.deleteExternalByExternalId(req.params.externalId)
  } catch (e) {
    res.sendStatus(404)
  }
  res.sendStatus(200);
});


// Create a new pen
router.post('/', [], async (req, res, next) => {

  const pen = req.body.penInfo;

   // This will be set later once we retrieve the new pen ID
  // req.body.penInfo.hashId = '000000';    
  let newPen = (await penUtil.addNewPen(pen))[0];

  console.log("Added new pen: ", newPen);

  if (!newPen || newPen.length <= 0) {
    res.sendStatus(404);
  } else {
    
    const fragments = req.body.penFragments;
    for (var i = 0; i < fragments.length; ++i) {
      const fragmentBody = {
        penId: newPen[0].penId,
        fragmentType: fragments[i].fragmentType,
        body: fragments[i].body ? fragments[i].body : null,
        createdAt: new Date()
      }
      await penFragmentUtil.createPenFragment(fragmentBody);
    }

    const externals = req.body.penExternals;
    if (externals) {
      for (var i = 0; i < externals.length; ++i) {

        const newExternal = {
          penId: newPen[0].penId,
          externalType: externals[i].externalType,
          url: externals[i].url
        }
        
        await penExternalUtil.createPenExternal(newExternal);
  
      }
    }

    const newhashId = hashids.encode(newPen[0].penId);
    console.log(`[encodeToHashId] - Converted ${newPen[0].penId} to ${newhashId}`);   
    newPen[0].hashId = newhashId;
    res.status(201).json(newPen[0]);
  }

});


router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

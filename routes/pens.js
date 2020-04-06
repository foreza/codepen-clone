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
router.get('/:id', [collections.checkPenIDValidity], async (req, res, next) => {
  const pen = await penUtil.getPenByPenID(req.params.id);
  if (!pen || pen.length === 0) {
    res.sendStatus(404);
  } else {
    const penFragments = await penFragmentUtil.getFragmentsByPenId(req.params.id);
    const penExternals = await penExternalUtil.getExternalsByPenId(req.params.id);
    const responsePayload = {
      penInfo: pen[0],
      penFragments: penFragments,
      penExternals: penExternals
    };
    res.json(responsePayload);
  }
});


// Get a collection of pens given a user ID
router.get('/user/:userId', async (req, res, next) => {
  const penList = await penUtil.getPenByUserID(req.params.userId, penLimit);
  if (!penList) {
    res.sendStatus(404);
  } else {
    res.json(penList);
  }
});


// Update everything about a pen given a pen ID
router.put('/:penId', [], async (req, res, next) => {

  const updatedPen = await penUtil.updatePenContentByPenID(req.body.penInfo);
  if (!updatedPen || updatedPen.length <= 0) {
    res.sendStatus(404);
  } else {

    // TODO: These should be ideally all 1 DB transaction. We'll let server do heavy lifting for now, fix this later

    // HANDLE fragment updates
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

    // Handling external update/deletion/creation
    const externalUpdates = req.body.penExternals;
    const updatedExternals = [];
    for (var i = 0; i < externalUpdates.length; ++i) {

      console.log("processing: ", externalUpdates[i])

      // If the ID exists (meaning, not new)
      if (externalUpdates[i].externalId){

        // If this ID was marked for deletion
        if (externalUpdates[i].delete) {
          console.log("Removing external: ", externalUpdates[i].externalId)
          await penExternalUtil.deleteExternalByExternalId(externalUpdates[i].externalId);
        } else {
          const externalUpdate = {
            externalId: externalUpdates[i].externalId,
            url: externalUpdates[i].url
          }
          console.log("Updating external: ", externalUpdates[i].externalId)
          const updatedExternal = await penExternalUtil.updatePenExternal(externalUpdate);
          updatedExternals.push(updatedExternal[0][0]);
        }
        
      } else {
        // ID doesn't exist, meaning new
        const newExternal = {
          penId: req.params.penId,
          externalType: externalUpdates[i].externalType,
          url: externalUpdates[i].url
        }
        console.log("Creating new external: ", externalUpdates[i].url)

        const createdExternal = await (penExternalUtil.createPenExternal(newExternal))
        console.log("pushing this: ", createdExternal[0][0]);
        updatedExternals.push(createdExternal[0][0]);
      }


    }

    const updatedPenPayload = {
      penInfo : updatedPen[0][0],
      penExternals : updatedExternals
    }

    // res.json(updatedPen[0][0]);

    console.log("updatedPenPayload: ", updatedPenPayload)
    res.json(updatedPenPayload);

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
  req.body.penInfo.hashId = '000000';    
  let newPen = (await penUtil.addNewPen(pen))[0];

  console.log("Added new pen: ", newPen);

  if (!newPen || newPen.length <= 0) {
    res.sendStatus(404);
  } else {

    const newhashId = hashids.encode(newPen[0].penId);
    console.log(`[encodeToHashId] - Converted ${newPen[0].penId} to ${newhashId}`);

    newPen = (await penUtil.updatePenWithHashId({
      penId: newPen[0].penId,
      hashId: newhashId
    }))[0];

    
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
   
    res.status(201).json(newPen[0]);
  }

});


router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

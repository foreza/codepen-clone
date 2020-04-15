var express = require('express');
var router = express.Router();
var collections = require('../middleware/collections')
var penUtil = require('../dbUtils/penUtils')
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
const penLimit = 50;

const puppeteer = require('puppeteer');

router.get('/:id', collections.checkPenIDValidity, async (req, res, next) => {
  try {
    const pen = await penUtil.getPenByPenIDTransaction(req.params.id);
    res.json(pen);
  } catch (err) {
    console.error(`GET Pen Error: ${err}`);
    res.sendStatus(404);
  }
});



// Test route for puppet
router.get('/:id/puppet', async (req, res, next) => {

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
    });
    const link = `http://${req.get('Host')}/pens/${req.params.id}/preview`;
    console.log(link)

    await page.goto(link);
    await page.screenshot({path: `./public/previews/${req.params.id}.png`});
    await browser.close();
    res.sendStatus(200);
  
  } catch (e) {
    console.log("Error with puppet")
    res.sendStatus(500);
  }

})


router.get('/:id/preview', collections.checkPenIDValidity, async (req, res, next) => {
  try {
    const pen = await penUtil.getPenByPenIDTransaction(req.params.id);

    let htmlFragment, cssFragment, jsFragment = "";
    let externalsArr = [];

    for (var i = 0; i < pen.penFragments.length; ++i) {
      switch (pen.penFragments[i].fragmentType) {
          case 0:
            htmlFragment = pen.penFragments[i].body;
            break;
          case 1:
            cssFragment = pen.penFragments[i].body;
            break;
          case 2:
            jsFragment = pen.penFragments[i].body;
            break;
      } 
   }


   if (typeof pen.penExternals != undefined){
    for (var i = 0; i < pen.penExternals.length; ++i) {

      switch (pen.penExternals[i].externalType) {
        case 0: // css
          externalsArr.push(`<link type="text/css" rel="stylesheet" 
          href='${pen.penExternals[i].url}' />`);
          break;
        case 1: // js
          externalsArr.push(`<script type="text/javascript" 
          src='${pen.penExternals[i].url}'></script>`);
          break;
      }
    }
   }
   


    let renderParams = {
      "htmlHead": pen.penInfo.htmlHead,
      "htmlClass": pen.penInfo.htmlClass,
      "htmlFragment": htmlFragment,
      "cssFragment": cssFragment,
      "jsFragment": jsFragment,
      "penExternals": externalsArr
    }
  
    console.log(renderParams);
    res.render('pen-preview', renderParams)

  } catch (err) {
    console.error(`GET Pen Preview Error: ${err}`);
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

  try {
    const updatedPen = await penUtil.updatePenContentByTransaction(req.body);

    if (!updatedPen || updatedPen.length <= 0) {
      res.sendStatus(404);
    } else {
        try {
          await collections.generatePreview(req, req.params.penId);
          res.json(updatedPen);
        } catch (e) {
          console.log("Error with preview.")
          res.sendStatus(500);
        }
    }

  } catch (err) {
    err => {
      console.error(`Pen Update Error: ${err}`);
      res.sendStatus(400);
    };
  }


});


// Create a new pen
router.post('/', async (req, res, next) => {

  try {
    let pen = await penUtil.addNewPenByTransaction(req.body)

    if (pen) {
      newPen = pen[0];
      console.log("Added new pen: ", newPen);
      const newhashId = hashids.encode(newPen[0].penId);
      console.log(`[encodeToHashId] - Converted ${newPen[0].penId} to ${newhashId}`);
      newPen[0].hashId = newhashId;

      try {
        await collections.generatePreview(req, newPen[0].penId);
        res.status(201).json(newPen[0]);
      } catch (e) {
        console.log("Error with preview.")
        res.sendStatus(500);
      }

    } else {
      throw Error("Pen was null")
    }

  } catch (err) {
    console.error(`Pen Creation Error:", ${err}`);
    res.sendStatus(400);   
  };

});


router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;

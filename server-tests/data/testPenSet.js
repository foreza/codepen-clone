const smokeTestPens = {};

smokeTestPens.test_pen_0_res = {
   "penInfo":{
      "penId": 1,
      "penName":"Nook's Cranny",
      "hashId":"jR", // TODO: shouldn't hardcode this.
      "userId":1,
      "htmlClass":'testClass',
      "htmlHead":'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "numFavorites":1,
      "numComments":2,
      "numViews":3
   }
}

smokeTestPens.test_pen_0 = {
    "penInfo":{
       "penName":"Nook's Cranny",
       "hashId":"jR", // TODO: shouldn't hardcode this.
       "userId":1,
       "htmlClass":'testClass',
       "htmlHead":'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
       "numFavorites":1,
       "numComments":2,
       "numViews":3
    },
    "penFragments":[
       {
          "fragmentType":0,
          "body":"<h2>tom nook's workbench</h2>",
       },
       {
          "fragmentType":1,
          "body":"h1 { color: brown }"    
       },
       {
          "fragmentType":2,
          "body":"console.log(\"Take your time on your loan!\")"
       },
    ],
    "penExternals":[
      {
         "externalType":0,
         "url":"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
      },
      {
         "externalType":1,
         "url":"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
      }
   ]
}
const params = { smokeTestPens }

module.exports = params;
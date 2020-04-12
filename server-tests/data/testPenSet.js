const smokeTestPens = {};

smokeTestPens.test_pen_0_res = {
   "penInfo":{
      "penId": 1,
      "hashId": `jR`,                // Is there a way to not do this?       
      "penName":"Nook's Cranny",
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



smokeTestPens.test_pen_0_updated_1 = {
   "penInfo":{
      "penId": 1,
      "penName":"Nook's Cranny (Updated!)",
      "userId":1,
      "htmlClass":'testClass - updated!',
      "htmlHead":'<meta name="viewport" content="width=device-width, initial-scale=1.0, updated">',
      "numFavorites":2,
      "numComments":3,
      "numViews":4
   },
   "penFragments":[
      {
         "fragmentId": 1,
         "body":"<h2>tom nook's workbench - updated!</h2>",
      },
      {
         "fragmentId": 2,
         "body":"h1 { color: red }"    
      },
      {
         "fragmentId": 3,
         "body":"console.log(\"Take your sweet time on your loan!\")"
      }
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



smokeTestPens.test_pen_0_updated_1_res = {
   "penInfo":{
      "penId": 1,
      "penName":"Nook's Cranny (Updated!)",
      "userId":1,
      "htmlClass":'testClass - updated!',
      "htmlHead":'<meta name="viewport" content="width=device-width, initial-scale=1.0, updated">',
      "numFavorites":2,
      "numComments":3,
      "numViews":4
   },
   "penFragments":[
      {  
         "fragmentId": 1,
         "fragmentType":0,
         "body":"<h2>tom nook's workbench - updated!</h2>",
      },
      {
         "fragmentId": 2,
         "fragmentType":1,
         "body":"h1 { color: red }"    
      },
      {
         "fragmentId": 3,
         "fragmentType":2,
         "body":"console.log(\"Take your sweet time on your loan!\")"
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
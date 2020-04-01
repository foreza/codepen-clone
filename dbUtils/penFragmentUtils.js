var db = require('../models/index')
const util = {};


/* 
    PEN FRAGMENT CREATION: 
    PenFragments belong to a pen, and are associated based off of penId.
    This query should only be invoked during the creation of a pen.

    Required Params:
    * penId (fkey)      
    * fragmentType (0,1,2..) - see below

    fragmentTypes:
    0 - HTML
    1 - CSS
    2 - JS

    Optional Params can be null (indicating empty)
    * body
    * htmlClass
    * htmlHead
*/

// INSERT INTO "PenFragments" ( 
//     "penId", "fragmentType", "body", "htmlClass", "htmlHead") 
// VALUES (2, 0, '<h1>test</h1>', null, null)
// RETURNING *;

const createPenFragmentQuery = `INSERT INTO "PenFragments" ( 
    "penId", "fragmentType", "body", "htmlClass", "htmlHead") 
VALUES (:penId, :fragmentType,  :body, :htmlClass, :htmlHead)
RETURNING *;`
util.createPenFragment = async (fragment) => {
    const ret = await db.sequelize.query(createPenFragment, {
        replacements: { ...fragment},
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}



/*
    PEN FRAGMENT UPDATE (Body):
    PenFragments typically will have their content updated via save operation.
    PenFragments additionally allow for a html head/class to be specified or changed.

    Required params:
    * fragmentId (primary key)
    
    Remaining params can be null (indicating empty)
    * body
    * htmlClass
    * htmlHead
*/

// UPDATE "PenFragments" 
// SET "body"='<h2>meeeeenaaa</h2>', 
// "htmlClass"='getDunkedOn', 
// "htmlHead"='metaIsMeta' 
// WHERE ("fragmentId"=1)
// RETURNING *;

const updatePenFragmentQuery = (update) => { return `UPDATE "PenFragments" 
SET "body"='${update.body}, 
htmlClass"='${update.htmlClass}', 
"htmlHead"='${update.htmlHead} 
WHERE ("fragmentId"=${update.fragmentId})
RETURNING *;` };
util.updatePenFragment = async (update) => {
    const ret = await db.sequelize.query(updatePenFragmentQuery(update), {
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


/*
    GET PEN FRAGMENT by PenID:
    Each Fragment has a penId.
    To render a pen, we need to provide all associated fragments with that penId

    Required params:
    * penId (fkey)
*/

// SELECT * FROM "PenFragments" WHERE ("penId"=2);

const getFragmentsByPenIdQuery = (penId) => { return `SELECT * FROM "PenFragments" WHERE ("penId"=${penId});` };
util.getFragmentsByPenId = (penId) => db.sequelize.query(getFragmentsByPenIdQuery(penId), {
    type: db.sequelize.QueryTypes.SELECT,
});



/*
    GET PEN FRAGMENT by fragmentId  (Body):

    Required params:
    * fragmentId (primary key)
*/

// SELECT * FROM "PenFragments" WHERE ("fragmentId"=2);

const getFragmentsByFragmentIdQuery = (penId) => { return `SELECT * FROM "PenFragments" WHERE ("penId"=${penId});` };
util.getFragmentById = (penId) => db.sequelize.query(getFragmentsByFragmentIdQuery(penId), {
    type: db.sequelize.QueryTypes.SELECT,
});






module.exports = util;
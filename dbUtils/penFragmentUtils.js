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
    Required params:
    * fragmentId (primary key)
    
    Remaining params can be null (indicating empty)
    * body
*/
const updatePenFragmentBodyQuery = (update) => { return `UPDATE "PenFragments" 
SET "body"='${update.body}' WHERE ("fragmentId"=${update.fragmentId})
RETURNING *;` };
util.updatePenContentByPenID = async (update) => {
    const ret = await db.sequelize.query(updatePenFragmentBodyQuery(update), {
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}

/*
    PEN FRAGMENT UPDATE (HTML head/class):
    PenFragments additionally allow for a html head/class to be specified or changed.
    Required params:
    * fragmentId (primary key)
    
    Remaining params can be null (indicating empty)
    * htmlClass
    * htmlHead
*/
const updatePenFragmentHTMLQuery = (update) => { return `UPDATE "PenFragments" 
SET "htmlClass"='${update.htmlClass}', "htmlHead"='${update.htmlHead}'  WHERE ("fragmentId"=${update.fragmentId})
RETURNING *;` };
util.updatePenContentByPenID = async (update) => {
    const ret = await db.sequelize.query(updatePenFragmentHTMLQuery(update), {
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


const getFragmentsByPenIdQuery = (penId) => { return `SELECT * FROM "PenFragments" WHERE ("penId"=${penId});` };
util.getPenByPenID = (penId) => db.sequelize.query(getFragmentsByPenIdQuery(penId), {
    type: db.sequelize.QueryTypes.SELECT,
});


const getXPensByUserIDQuery = (userId, count) => { return `SELECT * FROM "Pens" WHERE ("userId"=${userId}) LIMIT ${count};` };
util.getPenByUserID = (userId, count) => db.sequelize.query(getXPensByUserIDQuery(userId, count), {
    type: db.sequelize.QueryTypes.SELECT
});




module.exports = util;
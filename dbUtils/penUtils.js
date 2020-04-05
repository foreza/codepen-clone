var db = require('../models/index')
const util = {};

/* 
    CREATE PEN: 
    Pens belong to a User, and are associated based off of userId.

    Required Params:
    * userId (fkey)      
    * penName
    * hashId

    Optional Params can be null (indicating empty)
    * numFavorites
    * numComments
    * numViews
*/

// INSERT INTO "Pens" ( 
//     "userId", "penName", "hashId", "numFavorites",  "numComments", "numViews") 
// VALUES (1, 'basic bob', 'A9A9A9A9', 40,  20, 999)
// RETURNING *;


// TODO: Use a transaction to ensure that Pen Creation is coupled with Pen Fragment creation

const addNewPenQuery = `INSERT INTO "Pens" ( 
    "userId", "penName", "hashId", "numFavorites",  "numComments", "numViews") 
VALUES (:userId, :penName, :hashId, :numFavorites,  :numComments, :numViews)
RETURNING *;`
util.addNewPen = async (pen) => {
    const ret = await db.sequelize.query(addNewPenQuery, {
        replacements: { ...pen },
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}

const updatePenWithHashQuery = `UPDATE "Pens" 
    SET "hashId"=:hashId WHERE ("penId"=:penId)
    RETURNING *;`

util.updatePenWithHashId = async (update) => {
    const ret = await db.sequelize.query(updatePenWithHashQuery, {
        replacements: { ...update },
        type: db.sequelize.QueryTypes.UPDATE
    })

    return ret;
}



/* 
    UPDATE PEN: 
    We can update the name of the pen, as well as any of the optional params.

    Required Params:
    * penId (primary key)      
    * penName

    Optional Params can be null (indicating empty)
    * numFavorites
    * numComments
    * numViews
*/

// UPDATE "Pens" 
// SET "penName"='a whole new world', "numFavorites"=50, "numComments"=10, "numViews"=568
// WHERE ("penId"=4)
// RETURNING *;

const updatePenInfoByPenIDQuery = (update) => {
    return `UPDATE "Pens" 
SET "penName"='${update.penName}', "numFavorites"='${update.numFavorites}', "numComments"='${update.numComments}', "numViews"='${update.numViews}'
WHERE ("penId"=${update.penId})
RETURNING *;` };
util.updatePenContentByPenID = async (update) => {
    const ret = await db.sequelize.query(updatePenInfoByPenIDQuery(update), {
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


/* 
    GET PEN: 
    We can retrieve a pen given the id

    Required Params:
    * penId (primary key)      
*/

// SELECT * FROM "Pens" WHERE ("penId"=4);

const getPenByPenIDQuery = (id) => { return `SELECT * FROM "Pens" WHERE ("penId"=${id});` };
util.getPenByPenID = (id) => db.sequelize.query(getPenByPenIDQuery(id), {
    type: db.sequelize.QueryTypes.SELECT,
});


/* 
    GET PENS associated with User : 
    We can retrieve a set of User Pens associated with a userId

    Required Params:
    * userId (fkey)   
    * count (# of pens to return)   
*/

// SELECT * FROM "Pens" WHERE ("userId"=1) LIMIT 10;

const getXPensByUserIDQuery = (userId, count) => { return `SELECT * FROM "Pens" WHERE ("userId"=${userId}) LIMIT ${count};` };
util.getPenByUserID = (userId, count) => db.sequelize.query(getXPensByUserIDQuery(userId, count), {
    type: db.sequelize.QueryTypes.SELECT
});


module.exports = util;
var db = require('../models/index')
const util = {};


// TRANSACTIONS:


/* 
    GET PEN: 
    We can retrieve a pen AND it's associated info given the penid

    Required Params:
    * penId (primary key)      
*/

// SELECT * FROM "Pens" WHERE ("penId"=4);

// const getPenTransactionQuery = (id) => { return `SELECT * FROM "Pens" WHERE ("penId"=${id});` };
util.getPenByPenIDTransaction = async (id) => {
    return db.sequelize.transaction((t) => {

        let penInfo;
        let penFragments;
        let penExternals;

        try {
            return db.sequelize.query(getPenByPenIDQuery(id), {
                type: db.sequelize.QueryTypes.SELECT, transaction: t
            }).then((pen) => {
                penInfo = pen;
                return db.sequelize.query(`SELECT * FROM "PenFragments" WHERE ("penId"=${id}) ORDER BY "fragmentType" ASC;`, {
                    type: db.sequelize.QueryTypes.SELECT, transaction: t
                }).then((fragmentList) => {
                    penFragments = fragmentList;
                    return db.sequelize.query(`SELECT * FROM "PenExternals" WHERE ("penId"=${id}) ORDER BY "externalType" ASC;`, {
                        type: db.sequelize.QueryTypes.SELECT, transaction: t
                    }).then((externalsList) => {
                        penExternals = externalsList;

                        let obj = {
                            "penInfo": pen[0],
                            "penFragments": penFragments,
                            "penExternals": penExternals
                        }

                        console.log(obj)

                        return obj;

                    })
                })
            });



        } catch (e) {

            console.log("rolling back!")
            t.rollback();
            // do some error handling here
        }

    });


};









/* 
    CREATE PEN: 
    Pens belong to a User, and are associated based off of userId.

    Required Params:
    * userId (fkey)      
    * penName
    
    Optional Params can be null (indicating empty)
    * numFavorites
    * numComments
    * numViews
    * htmlClass
    * htmlHead
*/

// INSERT INTO "Pens" ( 
//     "userId", "penName", "htmlClass", "htmlHead"  "numFavorites",  "numComments", "numViews") 
// VALUES (1, 'basic bob', 'A9A9A9A9', "blah", "<meta>blaaah</meta>", 40,  20, 999)
// RETURNING *;


// TODO: Use a transaction to ensure that Pen Creation is coupled with Pen Fragment creation

const addNewPenQuery = `INSERT INTO "Pens" ( 
    "userId", "penName", "htmlClass", "htmlHead", "numFavorites", "numComments", "numViews") 
VALUES (:userId, :penName, :htmlClass, :htmlHead, :numFavorites,  :numComments, :numViews)
RETURNING *;`
util.addNewPen = async (pen) => {
    const ret = await db.sequelize.query(addNewPenQuery, {
        replacements: { ...pen },
        type: db.sequelize.QueryTypes.INSERT
    });

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
    * htmlClass
    * htmlHead
*/

// UPDATE "Pens" 
// SET "penName"='a whole new world', "blah", "<meta>blaaah</meta>", "numFavorites"=50, "numComments"=10, "numViews"=568
// WHERE ("penId"=4)
// RETURNING *;

const updatePenInfoByPenIDQuery = `UPDATE "Pens" 
SET "penName"=:penName, "htmlClass"=:htmlClass, "htmlHead"=:htmlHead,  "numFavorites"=:numFavorites, "numComments"=:numComments, "numViews"=:numViews
WHERE ("penId"=:penId)
RETURNING *;`

// const updatePenInfoByPenIDQuery = (update) => {
//     return `UPDATE "Pens" 
// SET "penName"='${update.penName}', "numFavorites"='${update.numFavorites}', "numComments"='${update.numComments}', "numViews"='${update.numViews}'
// WHERE ("penId"=${update.penId})
// RETURNING *;` };

util.updatePenContentByPenID = async (update) => {
    const ret = await db.sequelize.query(updatePenInfoByPenIDQuery, {
        replacements: { ...update },
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
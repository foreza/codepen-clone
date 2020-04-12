var db = require('../models/index')
var fragmentUtil = require('./penFragmentUtils')
var externalUtil = require('./penExternalUtils')
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
                if (pen.length <= 0) {
                    return null;
                } else {
                    console.log("pen:", pen)
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
                }
                
            })



        } catch (e) {
            console.log("Rolling back transaction")
            t.rollback();
        }

    });


};



util.updatePenContentByTransaction = (update) => {
    return db.sequelize.transaction(async (t) => {

        const penId = update.penInfo.penId;
        console.log(`penId is ${penId}`);

        let penInfo;
        let penFragments = [];
        let penExternals = [];

        try {

            penInfo = await db.sequelize.query(updatePenInfoByPenIDQuery, {
                type: db.sequelize.QueryTypes.UPDATE,
                transaction: t,
                replacements: { ...update.penInfo }
            });


            for (var i = 0; i < update.penFragments.length; ++i) {

                const fragmentUpdate = {
                    fragmentId: update.penFragments[i].fragmentId,
                    body: update.penFragments[i].body ? update.penFragments[i].body : null
                }

                const frag = await db.sequelize.query(
                    `UPDATE "PenFragments" 
                    SET "body"=:body 
                    WHERE ("fragmentId"=:fragmentId) 
                    RETURNING *;`, {
                    type: db.sequelize.QueryTypes.UPDATE,
                    transaction: t,
                    replacements: { ...fragmentUpdate }
                })

                penFragments.push(frag[0][0]);

            }

            // length check

            for (var i = 0; i < update.penExternals.length; ++i) {

                // If the ID exists (meaning, not new)
                if (update.penExternals[i].externalId) {

                    console.log("processing: ", update.penExternals[i]);

                    // If this ID was marked for deletion (no url)
                    if (!update.penExternals[i].url) {

                        await db.sequelize.query(
                            `DELETE FROM "PenExternals" WHERE ("externalId"=${update.penExternals[i].externalId});`, {
                            type: db.sequelize.QueryTypes.DELETE,
                            transaction: t
                        })

                    } else {
                        const externalUpdate = {
                            externalId: update.penExternals[i].externalId,
                            url: update.penExternals[i].url
                        }

                        const updatedExternal = await db.sequelize.query(
                            `UPDATE "PenExternals" SET "url"=:url WHERE ("externalId"=:externalId) RETURNING *;`, {
                            type: db.sequelize.QueryTypes.UPDATE,
                            transaction: t,
                            replacements: { ...externalUpdate }
                        })

                        penExternals.push(updatedExternal[0][0]);
                    }

                } else {
                    // ID doesn't exist, meaning new
                    const newExternal = {
                        penId: penId,
                        externalType: update.penExternals[i].externalType,
                        url: update.penExternals[i].url
                    }
                    console.log("Creating new external: ", update.penExternals[i].url)

                    const createdExternal = await db.sequelize.query(
                        `INSERT INTO "PenExternals" ( 
                            "penId", "externalType", "url") 
                        VALUES (:penId, :externalType,  :url)
                        RETURNING *;`, {
                        type: db.sequelize.QueryTypes.INSERT,
                        transaction: t,
                        replacements: { ...newExternal }
                    }
                    )
                    console.log("pushing this: ", createdExternal[0][0]);
                    updatedExternals.push(createdExternal[0][0]);
                }

            }

            let obj = {
                "penInfo": penInfo[0][0],
                "penFragments": penFragments,
                "penExternals": penExternals
            }

            return obj;


        }


        catch (e) {
            t.rollback()
            // handle error
        }

    })
}






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
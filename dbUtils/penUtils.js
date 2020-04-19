var db = require('../models/index')
var fragmentUtil = require('../dbUtils/penFragmentUtils')
var externalUtil = require('../dbUtils/penExternalUtils')
const util = {};

/* 
    GET PEN: 
    Retrieve Pen/Fragments/Externals by penId 

    Required Params:
    * penId (primary key)      
*/

const getPenByPenIDQuery =
    `SELECT * 
FROM "Pens" 
WHERE ("penId"=:penId);`;

util.getPenByPenIDTransaction = (id) => {
    return db.sequelize.transaction(async (t) => {

        let penInfo;
        let penFragments = [];
        let penExternals = [];

        try {
            penInfo = await db.sequelize.query(getPenByPenIDQuery, {
                type: db.sequelize.QueryTypes.SELECT,
                transaction: t,
                replacements: { penId: id }
            });

            if (penInfo.length <= 0) {
                throw Error("No pens found");
            }

        } catch (err) {
            t.rollback();
            throw Error(`Error with Pen Info GET: ${err}`);
        }

        try {
            penFragments = await db.sequelize.query(fragmentUtil.getFragmentsByPenIdQuery(), {
                type: db.sequelize.QueryTypes.SELECT,
                transaction: t,
                replacements: { penId: id }
            });

            if (penFragments.length <= 0) {
                throw Error("No fragments found");  // TODO: Will we always require fragments?
            }
        } catch (err) {
            t.rollback();
            throw Error(`Error with Pen Fragment GET: ${err}`);
        }

        try {
            penExternals = await db.sequelize.query(externalUtil.getExternalsByPenIdQuery(), {
                type: db.sequelize.QueryTypes.SELECT,
                transaction: t,
                replacements: { penId: id }
            });
        } catch (err) {
            t.rollback();
            throw Error(`Error with Pen Externals GET: ${err}`);
        }

        let obj = {
            "penInfo": penInfo[0],
            "penFragments": penFragments,
            "penExternals": penExternals
        }

        return obj;

    });


};




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

const updatePenInfoByPenIDQuery =
    `UPDATE "Pens" 
SET "penName"=:penName, "htmlClass"=:htmlClass, "htmlHead"=:htmlHead,  
"numFavorites"=:numFavorites, "numComments"=:numComments, "numViews"=:numViews
WHERE ("penId"=:penId) 
RETURNING *;`

util.updatePenContentByTransaction = (update) => {
    return db.sequelize.transaction(async (t) => {

        const penId = update.penInfo.penId;
        let penInfo;
        let penFragments = [];
        let penExternals = [];

        try {
            penInfo = await db.sequelize.query(updatePenInfoByPenIDQuery, {
                type: db.sequelize.QueryTypes.UPDATE,
                transaction: t,
                replacements: { ...update.penInfo }
            });
        } catch (err) {
            t.rollback();
            throw Error(`Error with Pen Info Update: ${err}`);
        }

        for (var i = 0; i < update.penFragments.length; ++i) {

            const fragmentUpdate = {
                fragmentId: update.penFragments[i].fragmentId,
                body: update.penFragments[i].body ? update.penFragments[i].body : null
            }

            try {
                const frag = await db.sequelize.query(
                    `UPDATE "PenFragments" 
                        SET "body"=:body 
                        WHERE ("fragmentId"=:fragmentId) 
                        RETURNING *;`, {
                    type: db.sequelize.QueryTypes.UPDATE,
                    transaction: t,
                    replacements: { ...fragmentUpdate }
                });

                penFragments.push(frag[0][0]);

            } catch (err) {
                t.rollback();
                throw Error(`Error with Pen Fragment Update: ${err}`);
            }
        }

        if (update.penExternals) {
            for (var i = 0; i < update.penExternals.length; ++i) {

                // If the ID exists (meaning, not new)
                if (update.penExternals[i].externalId) {

                    // If this ID was marked for deletion (no url)
                    if (!update.penExternals[i].url) {
                        try {
                            await db.sequelize.query(
                                externalUtil.deleteExternalByExternalIdQuery(), {
                                type: db.sequelize.QueryTypes.DELETE,
                                transaction: t,
                                replacements: { externalId: update.penExternals[i].externalId }
                            });
                        } catch (err) {
                            t.rollback();
                            throw Error(`Error with Pen External Update - deletion: 
                            ${update.penExternals[i].externalId} -> ${err}`);
                        }
                    } else {
                        const externalUpdate = {
                            externalId: update.penExternals[i].externalId,
                            url: update.penExternals[i].url
                        }

                        try {
                            const updatedExternal = await db.sequelize.query(
                                externalUtil.updatePenExternalQuery(), {
                                type: db.sequelize.QueryTypes.UPDATE,
                                transaction: t,
                                replacements: { ...externalUpdate }
                            });
                            penExternals.push(updatedExternal[0][0]);
                        } catch (err) {
                            t.rollback();
                            throw Error(`Error with Pen External Update - update existing:
                            ${update.penExternals[i].externalId} -> ${err}`);
                        }

                    }

                } else {
                    // ID doesn't exist, meaning new
                    const newExternal = {
                        penId: penId,
                        externalType: update.penExternals[i].externalType,
                        url: update.penExternals[i].url
                    }

                    try {
                        const createdExternal = await db.sequelize.query(
                            externalUtil.createPenExternalQuery(), {
                            type: db.sequelize.QueryTypes.INSERT,
                            transaction: t,
                            replacements: { ...newExternal }
                        });
                        penExternals.push(createdExternal[0][0]);
                    } catch (err) {
                        t.rollback();
                        throw Error(`Error with Pen External Update - make new: 
                        ${update.penExternals[i].url} -> ${err}`);
                    }

                }

            }
        }

        let obj = {
            "penInfo": penInfo[0][0],
            "penFragments": penFragments,
            "penExternals": penExternals
        }

        return obj;
    });
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
    * etc..
*/

// INSERT INTO "Pens" ( 
//     "userId", "penName", "htmlClass", "htmlHead"  "numFavorites",  "numComments", "numViews") 
// VALUES (1, 'basic bob', 'A9A9A9A9', "blah", "<meta>blaaah</meta>", 40,  20, 999)
// RETURNING *;


const addNewPenQuery = `INSERT INTO "Pens" ( 
    "userId", "penName", "htmlClass", "htmlHead", "numFavorites", "numComments", "numViews") 
VALUES (:userId, :penName, :htmlClass, :htmlHead, :numFavorites,  :numComments, :numViews)
RETURNING *;`

util.addNewPenByTransaction = (pen) => {
    return db.sequelize.transaction(async (t) => {
        let penInfo;

        try {
            penInfo = await db.sequelize.query(addNewPenQuery, {
                type: db.sequelize.QueryTypes.INSERT,
                transaction: t,
                replacements: { ...pen.penInfo }
            });
        } catch (err) {
            t.rollback();
            throw Error(`${err} at adding PenInfo`);
        }

        const newPenId = penInfo[0][0].penId;

        for (var i = 0; i < pen.penFragments.length; ++i) {

            const fragmentBody = {
                penId: newPenId,
                fragmentType: pen.penFragments[i].fragmentType,
                body: pen.penFragments[i].body ? pen.penFragments[i].body : null,
                createdAt: new Date()
            }

            try {
                await db.sequelize.query(
                    fragmentUtil.createPenFragmentQuery(), {
                    type: db.sequelize.QueryTypes.INSERT,
                    transaction: t,
                    replacements: { ...fragmentBody }
                });
            } catch (err) {
                t.rollback();
                throw Error(`${err} at penFragments: ${pen.penFragments[i]}`);
            }
        }

        if (pen.penExternals) {
            for (var i = 0; i < pen.penExternals.length; ++i) {
                const newExternal = {
                    penId: newPenId,
                    externalType: pen.penExternals[i].externalType,
                    url: pen.penExternals[i].url
                }

                try {
                    await db.sequelize.query(
                        externalUtil.createPenExternalQuery(), {
                        type: db.sequelize.QueryTypes.INSERT,
                        transaction: t,
                        replacements: { ...newExternal }
                    })
                } catch (err) {
                    t.rollback();
                    throw Error(`${err} at penExternals: ${pen.penExternals[i]}`);

                }
            }
        }

        return penInfo;
    });
}


/* 
    GET PENS associated with User : 
    We can retrieve a set of User Pens with pen Previews associated with a userId

    Required Params:
    * userId (fkey)   
    * count (# of pens to return)   
*/

const getXPensByUserIDWithPreviewQuery = `SELECT * FROM "Pens" INNER JOIN (
	SELECT * FROM (
		SELECT DENSE_RANK () OVER (
			PARTITION BY "PenPreviews"."penId" 
			order by "PenPreviews"."createdAt" desc) image_rank, 
		"PenPreviews"."penId", "PenPreviews"."uri"
		FROM "PenPreviews") as ranked
    WHERE ranked.image_rank = 1) as ranked_previews 
    ON ranked_previews."penId" = "Pens"."penId"
    WHERE "Pens"."userId" = :userId
    LIMIT :count;`

util.getPenByUserID = (userId, count) => db.sequelize.query(
    getXPensByUserIDWithPreviewQuery, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { "userId": userId, "count": count }
});

module.exports = util;
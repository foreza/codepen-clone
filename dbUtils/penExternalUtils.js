var db = require('../models/index')
const util = {};


/* 
    PEN Externals CREATION: 
    Externals belong to a pen, and are associated based off of penId.

    Required Params:
    * penId (fkey)      
    * externalType (0,1..) - see below
    * url

    externalTypes:
    0 - CSS
    1 - JS
*/

// INSERT INTO "PenExternals" ( 
//     "penId", "externalType", "url") 
// VALUES (1, 0, 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css')
// RETURNING *;

const createPenExternalQuery = `INSERT INTO "PenExternals" ( 
    "penId", "externalType", "url") 
VALUES (:penId, :externalType,  :url)
RETURNING *;`

util.createPenExternalQuery = () => {
    return createPenExternalQuery;
}

util.createPenExternal = async (external) => {
    const ret = await db.sequelize.query(createPenExternalQuery, {
        replacements: { ...external },
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}



/*
    PEN External UPDATE (url):
    PenExternals typically will have their content updated via save operation.
    PenExternals additionally allow for a html head/class to be specified or changed.

    Required params:
    * externalId (primary key)
    * url
*/

// UPDATE "PenExternals" 
// SET "url"='https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'
// WHERE ("externalId"=1)
// RETURNING *;

const updatePenExternalQuery = `UPDATE "PenExternals" 
SET "url"=:url
WHERE ("externalId"=:externalId)
RETURNING *;`

util.updatePenExternalQuery = () => {
    return updatePenExternalQuery;
}

util.updatePenExternal = async (update) => {
    const ret = await db.sequelize.query(updatePenExternalQuery, {
        replacements: { ...update },
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


/*
    GET PEN External by PenID:
    Each external has a penId.
    We need to provide all associated externals with that penId

    Required params:
    * penId (fkey)
*/

// SELECT * FROM "PenExternals" WHERE ("penId"=2);

// const getExternalsByPenIdQuery = (penId) => {
//     return `SELECT * FROM "PenExternals" 
//     WHERE ("penId"=${penId}) 
//     ORDER BY "externalType" ASC;`
// };

const getExternalsByPenIdQuery = `SELECT * FROM "PenExternals" 
    WHERE ("penId"=:penId) 
    ORDER BY "externalType" ASC;`

util.getExternalsByPenIdQuery = () => {
    return getExternalsByPenIdQuery;
}

util.getExternalsByPenId = (penId) => db.sequelize.query(getExternalsByPenIdQuery, {
    replacements: { penId: penId },
    type: db.sequelize.QueryTypes.SELECT,
});



/*
    GET PEN External by externalId :

    Required params:
    * externalId (primary key)
*/

// SELECT * FROM "PenExternals" WHERE ("externalId"=2);

// const getExternalsByExternalIdQuery = (externalId) => {
//     return `SELECT * FROM "PenExternals" 
//     WHERE ("externalId"=${externalId});`
// };

const getExternalsByExternalIdQuery = `SELECT * FROM "PenExternals" 
    WHERE ("externalId"=:externalId);`;

util.getExternalsByExternalIdQuery = () => {
    return getExternalsByExternalIdQuery;
};

util.getExternalByExternalId = (externalId) => db.sequelize.query(getExternalsByExternalIdQuery, {
    replacements: { externalId: externalId },
    type: db.sequelize.QueryTypes.SELECT,
});


/*
    DELETE PEN External by externalId:

    Required params:
    * externalId (primary key)
*/

// DELETE FROM "PenExternals" WHERE ("externalId"=3);


// const deleteExternalByExternalIdQuery = (externalId) => {
//     return `DELETE FROM "PenExternals" 
//     WHERE ("externalId"=${externalId});`
// };

const deleteExternalByExternalIdQuery = `DELETE FROM "PenExternals" 
    WHERE ("externalId"=:externalId);`

util.deleteExternalByExternalIdQuery = () => {
    return deleteExternalByExternalIdQuery;
}

util.deleteExternalByExternalId = (externalId) => db.sequelize.query(deleteExternalByExternalIdQuery, {
    replacements: { externalId: externalId },
    type: db.sequelize.QueryTypes.DELETE,
});






module.exports = util;
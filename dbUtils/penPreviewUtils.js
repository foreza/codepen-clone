var db = require('../models/index')
const util = {};


/* 
    PEN Preview CREATION: 
    Previews belong to a pen. The most recent one will be shown. 

    Required Params:
    * penId (fkey)      
    * uri  - the pen URI. Temporarily will be /public
*/


const createPenPreviewQuery = `INSERT INTO "PenPreviews" ( 
    "penId", "uri", "createdAt") 
VALUES (:penId, :uri,  :createdAt)
RETURNING *;`

util.createPenPreviewQuery = () => {
    return createPenPreviewQuery;
}

util.createPenPreview = async (preview) => {
    const ret = await db.sequelize.query(createPenPreviewQuery, {
        replacements: { ...preview },
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}


/* 
    PEN Preview SELECT: 
    Previews belong to a pen. The most recent one will be shown. 

    Required Params:
    * penId (fkey)      
]*/


const getLastPenPreviewQuery = `SELECT * FROM "PenPreviews" 
WHERE ("penId"=:penId) 
ORDER BY "createdAt" DESC;
LIMIT 1`

util.getLastPenPreviewQuery = () => {
    return getLastPenPreviewQuery;
}

util.getLastPenPreview = async (penId) => {
    const ret = await db.sequelize.query(getLastPenPreviewQuery, {
        replacements: {"penId": penId },
        type: db.sequelize.QueryTypes.SELECT
    });

    return ret;
}

module.exports = util;


// Sample query to get the most recent pens previews by rank 

// SELECT * FROM "Pens" INNER JOIN (
// 	SELECT * FROM (
// 		SELECT DENSE_RANK () OVER (
// 			PARTITION BY "PenPreviews"."penId" 
// 			order by "PenPreviews"."createdAt" desc) image_rank, 
// 		"PenPreviews"."penId", "PenPreviews"."uri"
// 		FROM "PenPreviews") as ranked
// 	WHERE ranked.image_rank = 1) as ranked_previews ON ranked_previews."penId" = "Pens"."penId";
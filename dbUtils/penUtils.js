var db = require('../models/index')
const util = {};


const addNewPenQuery = `INSERT INTO "Pens" ( 
    "userId", "penName", "cssContent", "jsContent",  "htmlContent") 
VALUES (:userId, :penName, :cssContent, :jsContent,  :htmlContent)
RETURNING *;`
util.addNewPen = async (pen) => {
    const ret = await db.sequelize.query(addNewPenQuery, {
        replacements: { ...pen},
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}


const updatePenContentByPenIDQuery = (update) => { return `UPDATE "Pens" 
SET "penName"='${update.penName}', "cssContent"='${update.cssContent}', "jsContent"='${update.jsContent}', "htmlContent"='${update.htmlContent}'
WHERE ("penId"=${update.penId})
RETURNING *;` };
util.updatePenContentByPenID = async (pen) => {
    const ret = await db.sequelize.query(updatePenContentByPenIDQuery(pen), {
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


const getPenByPenIDQuery = (id) => { return `SELECT * FROM "Pens" WHERE ("penId"=${id});` };
util.getPenByPenID = (id) => db.sequelize.query(getPenByPenIDQuery(id), {
    type: db.sequelize.QueryTypes.SELECT
});


const getXPensByUserIDQuery = (userId, count) => { return `SELECT * FROM "Pens" WHERE ("userId"=${userId}) LIMIT ${count};` };
util.getPenByUserID = (userId, count) => db.sequelize.query(getXPensByUserIDQuery(userId, count), {
    type: db.sequelize.QueryTypes.SELECT
});




module.exports = util;
var db = require('../models/index')
const util = {};


const addNewPenQuery = `INSERT INTO "Pens" 
( "userId", "penName", "cssContent", "jsContent", 
"htmlContent", "cssExternal", "htmlExternal", "jsExternal") 
VALUES (:userId, :penName, :cssContent, :jsContent, 
     :htmlContent, :cssExternal,:htmlExternal,:jsExternal)
RETURNING *;`
util.addNewPen = async (pen) => {
    const ret = await db.sequelize.query(addNewPenQuery, {
        replacements: { ...pen},
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}


const updatePenAllByPenIDQuery = (id) => { return `UPDATE "Pens" 
SET ("penName", "cssContent", "jsContent", "htmlContent", 
"cssExternal", "htmlExternal", "jsExternal") 
VALUES (:penName, :cssContent, :jsContent, :htmlContent, 
    :cssExternal,:htmlExternal,:jsExternal)
WHERE ("penId"=${id})
RETURNING *;` };
util.updatePenByPenID = async (pen) => {
    const ret = await db.sequelize.query(updatePenByPenIDQuery, {
        replacements: { ...pen},
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


const updatePenNameByPenIDQuery = (id) => { return `UPDATE "Pens" 
SET ("penName") VALUES (:penName)
WHERE ("penId"=${id})
RETURNING *;`}
util.updatePenByPenID = async (pen) => {
    const ret = await db.sequelize.query(updatePenNameByPenIDQuery, {
        replacements: { ...pen},
        type: db.sequelize.QueryTypes.UPDATE
    });

    return ret;
}


const getPenByPenIDQuery = (id) => { return `SELECT * FROM "Pens" WHERE ("penId"=${id});` };
util.getPenByPenID = (id) => db.sequelize.query(getPenByPenIDQuery(id), {
    type: db.sequelize.QueryTypes.SELECT
});


const getXPensByUserIDQuery = (userId, count) => { return `SELECT * FROM "Pens" WHERE ("userId"=${userId}) LIMIT ${count};` };
util.getPenByPenID = (userId) => db.sequelize.query(getXPensByUserIDQuery(userId), {
    type: db.sequelize.QueryTypes.SELECT
});




module.exports = util;
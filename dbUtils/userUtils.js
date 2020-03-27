var db = require('../models/index')
const util = {};

const addUserQuery = `INSERT INTO "Users" ( "fullName", "username", "email", "password", "createdAt") VALUES (:fullName, :username, :email, :password, :createdAt)RETURNING *;`
util.addUser = async (user) => {
    const ret = await db.sequelize.query(addUserQuery, {
        replacements: { ...user, createdAt: new Date() },
        type: db.sequelize.QueryTypes.INSERT
    });

    return ret;
}

const checkValidUserQuery = `SELECT * FROM "Users" 
                        WHERE (
                            email=:usernameOrEmail OR 
                            username=:usernameOrEmail
                            ) 
                        LIMIT 1;`
util.checkValidUser = (user) => db.sequelize.query(checkValidUserQuery, {
    replacements: { ...user },
    type: db.sequelize.QueryTypes.SELECT
});


const getUserByIdQuery = (id) => { return `SELECT * FROM "Users" WHERE (id=${id});` };
util.getUserById = (id) => db.sequelize.query(getUserByIdQuery(id), {
    type: db.sequelize.QueryTypes.SELECT
});

// TODO: flesh this out and plug in

util.getUserByUserName = (name) => db.sequelize.query(`SELECT * FROM "Users" WHERE (username=${name});`, {
    type: db.sequelize.QueryTypes.SELECT
});

util.getUserByEmail = (name) => db.sequelize.query(`SELECT * FROM "Users" WHERE (email=${email});`, {
    type: db.sequelize.QueryTypes.SELECT
});



module.exports = util;
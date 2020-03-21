var db = require('../models/index')
const util = {};

const addUserQuery = 'INSERT INTO "Users" ("fullName", "username", "email", "password", "createdAt") VALUES (:fullName, :username, :email, :password, :createdAt);'
util.addUserQuery = (user) => db.sequelize.query(addUserQuery, {
    replacements: { ...user, createdAt: new Date() },
    type: db.sequelize.QueryTypes.INSERT
});

const checkValidUser = 'SELECT * FROM "Users" WHERE (email=:usernameOrEmail OR username=:usernameOrEmail) LIMIT 1;'
util.checkValidUser = (req) => db.sequelize.query(checkValidUser, {
    replacements: { ...req.query },
    type: db.sequelize.QueryTypes.SELECT
});


util.checkUserSessionForID = (id) => db.sequelize.query(`SELECT * FROM "Users" WHERE (id=${id});`, {
    type: db.sequelize.QueryTypes.SELECT
});

module.exports = util;
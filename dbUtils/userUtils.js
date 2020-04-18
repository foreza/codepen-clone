var db = require('../models/index')
const util = {};

const addUserQuery =
    `INSERT INTO "Users" 
("fullName", "username", "email", "password", "createdAt") 
VALUES (:fullName, :username, :email, :password, :createdAt)
RETURNING *;`

util.addUser = (user) => db.sequelize.query(addUserQuery, {
    replacements: { ...user, createdAt: new Date() },
    type: db.sequelize.QueryTypes.INSERT
});

const checkValidUserQuery =
    `SELECT * FROM "Users" WHERE 
(email=:usernameOrEmail OR username=:usernameOrEmail) 
LIMIT 1;`

util.checkValidUser = (user) => db.sequelize.query(checkValidUserQuery, {
    replacements: { ...user },
    type: db.sequelize.QueryTypes.SELECT
});

const getUserByIdQuery =
    `SELECT * FROM "Users" WHERE 
(id=:id);`;

util.getUserById = (id) => db.sequelize.query(getUserByIdQuery, {
    replacements: { id: id },
    type: db.sequelize.QueryTypes.SELECT
});

module.exports = util;
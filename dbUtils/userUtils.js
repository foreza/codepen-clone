
const util = {};

util.addUserQuery = 'INSERT INTO "Users" ("fullName", "username", "email", "password", "createdAt") VALUES (:fullName, :username, :email, :password, :createdAt);'

module.exports = util;
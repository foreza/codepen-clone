
const util = {};

util.addUserQuery = 'INSERT INTO "Users" ("fullName", "username", "email", "password", "createdAt") VALUES (:fullName, :username, :email, :password, :createdAt);'

util.checkValidUser = 'SELECT * FROM "Users" WHERE (email=:usernameOrEmail OR username=:usernameOrEmail) AND password=:password'

module.exports = util;
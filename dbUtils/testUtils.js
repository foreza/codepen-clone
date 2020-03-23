var db = require('../models/index')
const testUtils = {};

const deleteUserRowsQuery = 'DELETE FROM "Users";'
testUtils.deleteUserRowsQuery = () => {
    db.sequelize.query(deleteUserRowsQuery, {
        type: db.sequelize.QueryTypes.DELETE
    });
}

testUtils.addUser = async (user) => {
    const tUser = User.build({ ...user });
    await tUser.save();
}

// ORM Method to just do a basic check (not checking id)
testUtils.getTestUserByUserName = async (name) => {
    const tUser = await db.User.findOne({
        attributes: ['fullName', 'username', 'email', 'password'],
        where: { username: name }
    });
    if (tUser.dataValues) { 
        console.log("retrieved: ", tUser)
        return tUser.dataValues;
    } else {
        return false;
    }
};

const addTestUserQuery = 'INSERT INTO "Users" ("fullName", "username", "email", "password", "createdAt") VALUES (:fullName, :username, :email, :password, :createdAt);'
testUtils.addUserQuery = (user) => {
    db.sequelize.query(addTestUserQuery, {
        replacements: { ...user, createdAt: new Date() },
        type: db.sequelize.QueryTypes.INSERT
    });
}





module.exports = testUtils;
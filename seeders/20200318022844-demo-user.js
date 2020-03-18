'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', 
    [{
      fullName: "yvonne yuan",
      email: "yyy@yyy.com",
      username: "y3y3y3y3",
      password: "asdfghjkl",
      createdAt: new Date()
    },
    {
      fullName: "jae ch00",
      email: "jaaaa@yyy.coc",
      username: "jananabanana",
      password: "lkjhgfdsa",
      createdAt: new Date()
    },
  ], {});
    /*

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};

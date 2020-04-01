'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users',
      [{
        fullName: 'jason chiu',
        email: 'jasonthechiu@gmail.com',
        username: 'jason.chiu',
        password: '$2b$10$niKa1WTwIMlGpaLecybrUOw75He7FRmyvUHnB9ID14G4HC9zCkej.',
        createdAt: new Date()
      },
      // {
      //   fullName: "yvonne yuan",
      //   email: "yyy@yyy.com",
      //   username: "yyyyyy",
      //   password: "asdlkfjasldkfjalskdfjaasdf",
      //   createdAt: new Date()
      // },
      // {
      //   fullName: "jae ch00",
      //   email: "jaaaa@yyy.coc",
      //   username: "jananabanana",
      //   password: "lkjhgfdsa",
      //   createdAt: new Date()
      
      ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null);
  }
};

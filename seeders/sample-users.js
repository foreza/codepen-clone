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
      }], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null);
  }
};

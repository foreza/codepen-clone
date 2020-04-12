'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pens',
      [
        {
          penName: "Seed Pen #1",
          userId: 1,
          htmlHead: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
          htmlClass: `class-i-got-that`,
          numFavorites: 999,
          numViews: 999,
          numComments: 999
        },
        {
          penName: "Seed Pen #2",
          userId: 1,
          htmlHead: null,
          htmlClass: null,
          numFavorites: 33,
          numViews: 44,
          numComments: 55
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pens', null, {});
  }
};

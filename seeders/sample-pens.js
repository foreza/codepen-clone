'use strict';

// const Hashids = require('hashids/cjs')
// const hashids = new Hashids()


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pens',
      [
        {
          penName: "Seed Pen #1",
          userId: 1,
          numFavorites: 999,
          numViews: 999,
          numComments: 999
        },
        {
          penName: "Seed Pen #2",
          userId: 1,
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

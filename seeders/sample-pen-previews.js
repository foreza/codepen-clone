'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PenPreviews',
      [ {
        previewId: 1,
        penId: 1,
        uri: "/images/placeholder.jpg",
        createdAt: new Date()
      }, {
        previewId: 2,
        penId: 2,
        uri: "/images/placeholder.jpg",
        createdAt: new Date()
      }

      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PenPreviews', null, {});
  }
};

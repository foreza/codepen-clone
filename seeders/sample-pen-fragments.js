'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PenFragments',
      [
        {
          penId: 1,
          fragmentType: 0,
          body: '<h1>hello there</1>',
          createdAt: new Date()
        },
        {
          penId: 1,
          fragmentType: 1,
          body: 'h1 { color: blue }',
          createdAt: new Date()
        },
        {
          penId: 1,
          fragmentType: 2,
          body: 'console.log("general kenobi!")',
          createdAt: new Date()
        },
        {
          penId: 2,
          fragmentType: 0,
          body: '<h1>jedi scum</1>',
          createdAt: new Date()
        },
        {
          penId: 2,
          fragmentType: 1,
          body: 'h1 { color: red }',
          createdAt: new Date()
        },
        {
          penId: 2,
          fragmentType: 2,
          body: 'console.log("i will have a new apprentice!")',
          createdAt: new Date()
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PenFragments', null, {});
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pens', 
    [
      { 
      penName: "this pen is a good one",
      userId: 1,
      cssContent: "not valid css dawg",
      jsContent: "not valid js dawg",
      htmlContent: "not valid html dawg",
      cssExternal: ["you got this css, dawg", "at least i think you got this, dawg"],
      htmlExternal: ["you got this html, dawg", "at least i think you got this, dawg"],
      jsExternal: ["you got this js dawg", "at least i think you got this, dawg"]
    },
    { 
      penName: "this pen is ALSO a good one",
      userId: 1,
      cssContent: "not valid css dawg",
      jsContent: "not valid js dawg",
      htmlContent: "not valid html dawg",
      cssExternal: ["you got this css, dawg", "at least i think you got this, dawg"],
      htmlExternal: ["you got this html, dawg", "at least i think you got this, dawg"],
      jsExternal: ["you got this js dawg", "at least i think you got this, dawg"]
    }
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

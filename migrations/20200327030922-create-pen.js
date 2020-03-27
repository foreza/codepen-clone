'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pens', {
      penId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER      
      },
      penName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cssContent: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      jsContent: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      htmlContent: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      cssExternal: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      htmlExternal: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      jsExternal: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Pens');
  }
};
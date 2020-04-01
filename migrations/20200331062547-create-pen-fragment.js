'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PenFragments', {
      fragmentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      penId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pens',
          key: 'penId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      fragmentType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      body: {
        type: Sequelize.STRING
      },
      htmlClass: {
        type: Sequelize.STRING
      },
      htmlHead: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PenFragments');

  }
};